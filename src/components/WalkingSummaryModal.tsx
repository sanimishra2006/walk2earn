import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Footprints, Clock, Award, Leaf, ArrowRight, ShieldCheck, Bike, Car, Navigation } from 'lucide-react';
import { WalkingSession } from '../types';

interface WalkingSummaryModalProps {
  session: WalkingSession | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
  onGoToRewards: () => void;
}

export const WalkingSummaryModal: React.FC<WalkingSummaryModalProps> = ({
  session,
  isOpen,
  onClose,
  onGoToDashboard,
  onGoToRewards,
}) => {
  useEffect(() => {
    if (isOpen && session && session.creditsEarned > 0) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#a3e635', '#22c55e', '#3b82f6'],
        });
      } catch {
        // Safe fallback if canvas-confetti is not supported
      }
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const getVehicleIcon = () => {
    switch (session.transportReplaced) {
      case 'car':
        return <Car className="w-4 h-4 text-emerald-600" />;
      case 'auto_rickshaw':
        return <Navigation className="w-4 h-4 text-emerald-600" />;
      case 'motorcycle':
        return <Bike className="w-4 h-4 text-emerald-600" />;
      default:
        return <Footprints className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Celebration Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Congratulations! Walk Completed!
          </h2>
          <p className="text-sm text-slate-500">
            {session.isSimulatedDemo ? (
              <span className="text-amber-600 font-medium">
                [Demo Simulation Walk Completed – Verified Route Simulation]
              </span>
            ) : (
              'Your GPS verified walk has been recorded and credited to your wallet.'
            )}
          </p>
        </div>

        {/* 4 Core Summary Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          
          {/* Metric 1: Distance */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Footprints className="w-3.5 h-3.5 text-emerald-600" />
              <span>Distance</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {session.distanceKm.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">km</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {(session.distanceKm * 1000).toFixed(0)} meters tracked
            </div>
          </div>

          {/* Metric 2: Duration */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Duration</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {session.durationMinutes}{' '}
              <span className="text-xs font-normal text-slate-500">min</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Avg speed: {session.avgSpeedKmh ? session.avgSpeedKmh.toFixed(1) : '4.8'} km/h
            </div>
          </div>

          {/* Metric 3: Credits Earned */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mobility Credits</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
              +{session.creditsEarned}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              1 credit per 100m walked
            </div>
          </div>

          {/* Metric 4: CO2 Avoided */}
          <div className="p-4 rounded-2xl bg-lime-50/70 border border-lime-100 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Leaf className="w-3.5 h-3.5 text-lime-600" />
              <span>CO₂ Avoided</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {session.estimatedCo2Avoided.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Equivalent ~{(session.estimatedCo2Avoided * 4.2).toFixed(1)} hrs tree absorption
            </div>
          </div>
        </div>

        {/* Environmental Trip Replacement Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
              {getVehicleIcon()}
            </div>
            <div>
              <div className="text-slate-500">Replaced Transport Mode</div>
              <div className="font-semibold text-slate-900 capitalize">
                {session.transportReplaced.replace('_', ' ')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anti-Cheat Verified</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onGoToDashboard}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors cursor-pointer text-center"
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            onClick={onGoToRewards}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Redeem Rewards</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
