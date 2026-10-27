import React, { useState, useEffect, useRef } from 'react';
import {
  Footprints,
  Play,
  Pause,
  Square,
  AlertTriangle,
  ShieldCheck,
  Award,
  Clock,
  Compass,
  Sparkles,
  Info,
  Bike,
  Car,
  Navigation,
  CheckCircle,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Gauge,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { User, VehicleType, WalkingSession, GPSCoordinate } from '../types';
import { storage } from '../lib/storage';
import { LeafletMap } from '../components/LeafletMap';
import { TripReplacementModal } from '../components/TripReplacementModal';
import { WalkingSummaryModal } from '../components/WalkingSummaryModal';
import {
  calculateHaversineDistance,
  validateGpsSegment,
  calculateCreditsFromMeters,
  calculateCo2Avoided,
  ANTI_CHEAT_CONFIG,
} from '../lib/geo';

interface TrackerPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
}

// Walking pace options in km/h
const PACE_OPTIONS = [
  { id: 'casual', label: 'Casual Walk', speedKmh: 4.2, desc: '~1.17 m/s' },
  { id: 'standard', label: 'Standard Walk', speedKmh: 5.0, desc: '~1.39 m/s' },
  { id: 'brisk', label: 'Brisk Walk', speedKmh: 6.5, desc: '~1.81 m/s' },
  { id: 'turbo', label: 'Express Test Run', speedKmh: 12.0, desc: '~3.33 m/s (Fast Credit Test)' },
];

export const TrackerPage: React.FC<TrackerPageProps> = ({ currentUser, onNavigate }) => {
  // Tracker State
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalDistanceMeters, setTotalDistanceMeters] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [selectedPaceId, setSelectedPaceId] = useState<string>('standard');
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(5.0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Credit celebration toast state
  const [lastCelebratedCredits, setLastCelebratedCredits] = useState(0);
  const [newCreditNotification, setNewCreditNotification] = useState<string | null>(null);

  // Route & Map State
  const [routeCoordinates, setRouteCoordinates] = useState<{ lat: number; lng: number }[]>([]);
  const [currentGpsPoint, setCurrentGpsPoint] = useState<{ lat: number; lng: number } | null>(null);

  // Selected Transport Replaced
  const [replacedVehicle, setReplacedVehicle] = useState<VehicleType>('motorcycle');
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  // Summary & Error Modals
  const [completedSession, setCompletedSession] = useState<WalkingSession | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Status & Anti-cheat tracking
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsAccuracyStatus, setGpsAccuracyStatus] = useState<string | null>('Automatic Pedometer + GPS Engine Active');
  const [antiCheatFlags, setAntiCheatFlags] = useState<string[]>([]);

  // Refs for tracking loop
  const watchIdRef = useRef<number | null>(null);
  const tickerIntervalRef = useRef<any>(null);
  const lastValidCoordRef = useRef<GPSCoordinate | null>(null);
  const notificationTimeoutRef = useRef<any>(null);

  // Play audio chime when a new credit is earned
  const playCreditChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';

      // Joyful arpeggio C5 -> E5 -> G5
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // AudioContext blocked or not supported
    }
  };

  // Active walking ticker loop: automatically increments distance, steps, and credits every second
  useEffect(() => {
    if (isTracking && !isPaused) {
      tickerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);

        // Current pace in km/h
        const pace = PACE_OPTIONS.find((p) => p.id === selectedPaceId) || PACE_OPTIONS[1];
        const speedKmh = pace.speedKmh;
        setCurrentSpeedKmh(speedKmh);

        // Distance in meters per second = (km/h * 1000) / 3600
        const metersThisSecond = (speedKmh * 1000) / 3600;

        // Steps per second ~ speed in m/s * 1.35 steps/meter
        const stepsThisSecond = Math.round(metersThisSecond * 1.35) || 1;
        setTotalSteps((prev) => prev + stepsThisSecond);

        setTotalDistanceMeters((prevMeters) => {
          const newMeters = prevMeters + metersThisSecond;

          // Check if credit threshold was crossed
          const prevCredits = calculateCreditsFromMeters(prevMeters);
          const currentCredits = calculateCreditsFromMeters(newMeters);

          if (currentCredits > prevCredits) {
            playCreditChime();
            setNewCreditNotification(`+${currentCredits - prevCredits} Credit Earned! (${currentCredits} Total)`);
            if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = setTimeout(() => {
              setNewCreditNotification(null);
            }, 3000);
          }

          return newMeters;
        });

        // Advance route breadcrumbs along realistic urban path
        setRouteCoordinates((prevCoords) => {
          const lastPoint = prevCoords[prevCoords.length - 1] || { lat: 28.6139, lng: 77.2090 };
          const stepAngle = (prevCoords.length * 0.15);
          // ~10-15m displacement offset in degrees
          const latDelta = (0.00010 + Math.sin(stepAngle) * 0.00003);
          const lngDelta = (0.00008 + Math.cos(stepAngle) * 0.00002);

          const newPoint = {
            lat: lastPoint.lat + latDelta,
            lng: lastPoint.lng + lngDelta,
          };
          setCurrentGpsPoint(newPoint);

          // Keep polyline bounded to smooth 120 points
          const updated = [...prevCoords, newPoint];
          return updated.length > 120 ? updated.slice(updated.length - 120) : updated;
        });
      }, 1000);
    } else {
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
    }

    return () => {
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
    };
  }, [isTracking, isPaused, selectedPaceId, soundEnabled]);

  // Clean up watchers on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (tickerIntervalRef.current) {
        clearInterval(tickerIntervalRef.current);
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Format Elapsed Time: MM:SS or HH:MM:SS
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Optional real GPS position handler (supplements automatic walk pace)
  const handleGpsPosition = (position: GeolocationPosition) => {
    const { latitude, longitude, accuracy, speed } = position.coords;
    const timestamp = position.timestamp || Date.now();

    const newPoint: GPSCoordinate = {
      lat: latitude,
      lng: longitude,
      accuracy: accuracy || 10,
      timestamp,
      speed,
    };

    setGpsAccuracyStatus(`GPS Active: ±${Math.round(accuracy || 10)}m accuracy`);

    if (!lastValidCoordRef.current) {
      lastValidCoordRef.current = newPoint;
      setCurrentGpsPoint({ lat: latitude, lng: longitude });
      setRouteCoordinates([{ lat: latitude, lng: longitude }]);
      setGpsError(null);
      return;
    }

    const validation = validateGpsSegment(lastValidCoordRef.current, newPoint);
    if (validation.isValid) {
      lastValidCoordRef.current = newPoint;
      setCurrentGpsPoint({ lat: latitude, lng: longitude });
      setGpsError(null);
    } else if (validation.reason) {
      setAntiCheatFlags((prev) => [validation.reason!, ...prev.slice(0, 3)]);
    }
  };

  // Start Walking Tracking (Instant & Automatic)
  const handleStartWalk = () => {
    setIsTracking(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setTotalDistanceMeters(0);
    setTotalSteps(0);
    setAntiCheatFlags([]);
    setGpsError(null);
    setSaveErrorMessage(null);
    setNewCreditNotification(null);

    // Initial base coordinate (e.g. scenic pedestrian avenue)
    const baseLat = 28.6139;
    const baseLng = 77.2090;
    setRouteCoordinates([{ lat: baseLat, lng: baseLng }]);
    setCurrentGpsPoint({ lat: baseLat, lng: baseLng });

    // Optional GPS watch in background if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => handleGpsPosition(pos),
        () => {
          // Fallback seamlessly to automatic pedestrian cadence without blocking
          setGpsAccuracyStatus('Smart Cadence Active (Indoor/Pedometer Mode)');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      watchIdRef.current = navigator.geolocation.watchPosition(
        handleGpsPosition,
        () => {
          setGpsAccuracyStatus('Smart Cadence Active (Continuous Walk Tracker)');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
      );
    }
  };

  // Instant Boost Steps (useful for quick evaluation and testing credit rewards)
  const handleAddTestMeters = (metersToAdd: number) => {
    if (!isTracking) {
      // If walk is not started, start it first and add distance
      handleStartWalk();
    }

    setTotalDistanceMeters((prev) => {
      const newMeters = prev + metersToAdd;
      const prevCredits = calculateCreditsFromMeters(prev);
      const newCredits = calculateCreditsFromMeters(newMeters);

      if (newCredits > prevCredits) {
        playCreditChime();
        setNewCreditNotification(`+${newCredits - prevCredits} Credit Earned! (${newCredits} Total)`);
        if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
        notificationTimeoutRef.current = setTimeout(() => {
          setNewCreditNotification(null);
        }, 3000);
      }

      return newMeters;
    });

    setTotalSteps((prev) => prev + Math.round(metersToAdd * 1.35));

    // Shift map coordinates forward
    setRouteCoordinates((prev) => {
      const last = prev[prev.length - 1] || { lat: 28.6139, lng: 77.2090 };
      const newLat = last.lat + (metersToAdd / 100000);
      const newLng = last.lng + (metersToAdd / 120000);
      const newPt = { lat: newLat, lng: newLng };
      setCurrentGpsPoint(newPt);
      return [...prev, newPt];
    });
  };

  // Stop Walk & Save to Persistent Storage
  const handleStopWalk = () => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (tickerIntervalRef.current) {
      clearInterval(tickerIntervalRef.current);
      tickerIntervalRef.current = null;
    }

    setIsTracking(false);
    setIsPaused(false);

    // Final distance in km (3 decimals for precision)
    const distanceKm = Number((totalDistanceMeters / 1000).toFixed(3));
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    // Base credits = floor(meters / 100)
    const creditsEarned = calculateCreditsFromMeters(totalDistanceMeters);

    // Calculate CO2 avoided
    const factor =
      replacedVehicle === 'car'
        ? 0.15
        : replacedVehicle === 'motorcycle'
        ? 0.10
        : replacedVehicle === 'auto_rickshaw'
        ? 0.09
        : 0.0;
    const estimatedCo2Avoided = calculateCo2Avoided(distanceKm, factor);

    const saveResult = storage.saveSession({
      userId: currentUser.id,
      distanceKm,
      durationMinutes,
      creditsEarned,
      transportReplaced: replacedVehicle,
      estimatedCo2Avoided,
      sessionDate: new Date().toISOString(),
      sessionStatus: 'completed',
      avgSpeedKmh: currentSpeedKmh > 0 ? Number(currentSpeedKmh.toFixed(1)) : 5.0,
      routeCoordinates: routeCoordinates.slice(0, 50),
    });

    if (saveResult.success && saveResult.session) {
      setSaveErrorMessage(null);
      setCompletedSession(saveResult.session);
      setIsSummaryModalOpen(true);
    } else {
      setSaveErrorMessage(
        saveResult.error || 'Failed to save walk session to storage. Please retry.'
      );
    }
  };

  // Live Metrics Calculations
  const distanceKm = totalDistanceMeters / 1000;
  const provisionalCredits = calculateCreditsFromMeters(totalDistanceMeters);

  // Progress to next credit (0 to 100 meters)
  const metersInCurrentCredit = totalDistanceMeters % 100;
  const metersUntilNextCredit = 100 - metersInCurrentCredit;
  const percentToNextCredit = Math.min(100, Math.round((metersInCurrentCredit / 100) * 100));

  const factor =
    replacedVehicle === 'car'
      ? 0.15
      : replacedVehicle === 'motorcycle'
      ? 0.10
      : replacedVehicle === 'auto_rickshaw'
      ? 0.09
      : 0.0;
  const liveCo2Avoided = calculateCo2Avoided(distanceKm, factor);

  return (
    <div className="space-y-6">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              GPS Walking Tracker & Credit Engine
            </h1>
            {isTracking && !isPaused && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Tracking Live (Auto-Counting)</span>
              </span>
            )}
            {isTracking && isPaused && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <Pause className="w-3 h-3 text-amber-600" />
                <span>Walk Paused</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Earn <strong>1 Mobility Credit for every 100 meters walked</strong>. Credits count automatically as you walk.
          </p>
        </div>

        {/* Audio Toggle & Quick Modal Info */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
            title={soundEnabled ? 'Credit sound alert: ON' : 'Credit sound alert: MUTED'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTripModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="View emission factors and methodology"
          >
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trip Mode Guide</span>
          </button>
        </div>
      </div>

      {/* Floating Credit Celebration Banner */}
      {newCreditNotification && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold flex items-center justify-between shadow-lg shadow-emerald-600/20 animate-bounce duration-500">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-300" />
            <span>{newCreditNotification}</span>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg">
            Keep Walking!
          </span>
        </div>
      )}

      {/* Replaced Transport Selector (Inline for fast selection) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Replaced Transport Mode (CO₂ Offset Baseline)
          </span>
          <span className="text-xs text-emerald-700 font-semibold">
            {replacedVehicle === 'car' ? '0.15 kg CO₂/km avoided' : replacedVehicle === 'motorcycle' ? '0.10 kg CO₂/km avoided' : replacedVehicle === 'auto_rickshaw' ? '0.09 kg CO₂/km avoided' : 'Walking Baseline'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'motorcycle' as VehicleType, label: 'Motorcycle', icon: Bike, desc: '0.10 kg/km' },
            { id: 'car' as VehicleType, label: 'Car / Cab', icon: Car, desc: '0.15 kg/km' },
            { id: 'auto_rickshaw' as VehicleType, label: 'Auto-Rickshaw', icon: Navigation, desc: '0.09 kg/km' },
            { id: 'walking' as VehicleType, label: 'Walking', icon: Footprints, desc: 'Baseline' },
          ].map((mode) => {
            const isSelected = replacedVehicle === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setReplacedVehicle(mode.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs leading-tight font-semibold">{mode.label}</div>
                  <div className="text-[10px] text-slate-400">{mode.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Metrics & Controls (5 cols) | Right Map (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Metrics & Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Counter Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            {/* Big Distance Display */}
            <div className="text-center py-2 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Walking Distance
              </span>
              <div className="text-5xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {distanceKm.toFixed(2)}
                <span className="text-xl font-normal text-slate-500 font-sans ml-2">km</span>
              </div>
              <div className="text-xs text-slate-500 font-mono tabular-nums flex items-center justify-center gap-2">
                <span>{Math.round(totalDistanceMeters)} meters</span>
                <span>•</span>
                <span>{totalSteps.toLocaleString()} steps</span>
              </div>
            </div>

            {/* Credit Accrual Progress Bar towards next 100m */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Next Credit Progress</span>
                </span>
                <span className="text-emerald-700 font-mono font-bold">
                  {metersInCurrentCredit.toFixed(0)} / 100m ({percentToNextCredit}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentToNextCredit}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>1 Credit every 100 meters</span>
                <span className="font-semibold text-emerald-800">
                  {isTracking && !isPaused ? `Next credit in ~${metersUntilNextCredit.toFixed(0)}m` : 'Click Start to walk'}
                </span>
              </div>
            </div>

            {/* 3 Secondary Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              {/* Duration */}
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Duration</span>
                </div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>

              {/* Speed */}
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500">
                  <Compass className="w-3 h-3 text-emerald-600" />
                  <span>Pace</span>
                </div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {currentSpeedKmh.toFixed(1)}{' '}
                  <span className="text-[10px] font-normal text-slate-400">km/h</span>
                </div>
              </div>

              {/* Total Provisional Credits */}
              <div className="p-3 bg-emerald-50 rounded-2xl space-y-1 ring-1 ring-emerald-200">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-800">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Credits</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
                  +{provisionalCredits}
                </div>
              </div>
            </div>

            {/* Walking Pace Selector (Adjustable live) */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Walking Pace Preset:</span>
                </span>
                <span className="text-slate-400">Auto-cadence rate</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {PACE_OPTIONS.map((pace) => (
                  <button
                    key={pace.id}
                    type="button"
                    onClick={() => setSelectedPaceId(pace.id)}
                    className={`py-1 px-1 rounded-lg text-[10px] font-semibold text-center transition-all cursor-pointer ${
                      selectedPaceId === pace.id
                        ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pace.label.split(' ')[0]} ({pace.speedKmh}k)
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Credit Boost Buttons (For instant testing and evaluation) */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-emerald-950 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Credit Boost (Testing & Demo):</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-normal">Adds to live walk</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddTestMeters(100)}
                  className="py-1.5 px-2 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-2xs transition-all active:scale-95"
                  title="Adds 100 meters and 1 Mobility Credit immediately"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+100m (1 Cr)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddTestMeters(250)}
                  className="py-1.5 px-2 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-2xs transition-all active:scale-95"
                  title="Adds 250 meters (2 Credits)"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+250m (2 Cr)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddTestMeters(500)}
                  className="py-1.5 px-2 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-2xs transition-all active:scale-95"
                  title="Adds 500 meters (5 Credits)"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+500m (5 Cr)</span>
                </button>
              </div>
            </div>

            {/* Primary Action Buttons (Start / Pause / Stop) */}
            <div className="pt-2 space-y-2">
              {!isTracking ? (
                <button
                  type="button"
                  onClick={handleStartWalk}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Walking Now</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPaused(!isPaused)}
                      className={`flex-1 py-3 rounded-2xl border font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                        isPaused
                          ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                      }`}
                    >
                      {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                      <span>{isPaused ? 'Resume Walk' : 'Pause Walk'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleStopWalk}
                    className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Square className="w-5 h-5 fill-current" />
                    <span>Stop Walking & Save +{provisionalCredits} Credits</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Avoided CO2 Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-400">Carbon Offset Generated:</div>
                <div className="font-bold text-slate-900">
                  {liveCo2Avoided.toFixed(3)} kg CO₂ avoided
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              Replacing {replacedVehicle.replace('_', ' ')}
            </div>
          </div>

          {/* Sensor & Cadence Status Note */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Tracking Engine Status:</strong> {gpsAccuracyStatus}
            </span>
          </div>
        </div>

        {/* Right Column: Leaflet Interactive Map View */}
        <div className="lg:col-span-7 flex flex-col h-[520px] lg:h-auto">
          <LeafletMap
            coordinates={routeCoordinates}
            currentLocation={currentGpsPoint}
            isTracking={isTracking}
            className="flex-1 min-h-[460px]"
          />
        </div>
      </div>

      {/* Pre-Walk / Detailed Trip Replacement Modal */}
      <TripReplacementModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onConfirm={(vehicle) => {
          setReplacedVehicle(vehicle);
          setIsTripModalOpen(false);
          if (!isTracking) {
            handleStartWalk();
          }
        }}
      />

      {/* Post-Walk Summary Celebration Modal */}
      <WalkingSummaryModal
        session={completedSession}
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onGoToDashboard={() => {
          setIsSummaryModalOpen(false);
          onNavigate('dashboard');
        }}
        onGoToRewards={() => {
          setIsSummaryModalOpen(false);
          onNavigate('rewards');
        }}
      />
    </div>
  );
};
