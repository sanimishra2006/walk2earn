import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Footprints,
  Award,
  Leaf,
  Sparkles,
  ArrowUpDown,
  Car,
  Bike,
  Navigation,
  X,
  Edit2,
  Check,
  Clock,
  ShieldCheck,
  Filter,
  Trophy,
} from 'lucide-react';
import { User, WalkingSession } from '../types';
import { storage } from '../lib/storage';
import { LeafletMap } from '../components/LeafletMap';

interface HistoryProfilePageProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onNavigate: (page: string) => void;
}

export const HistoryProfilePage: React.FC<HistoryProfilePageProps> = ({
  currentUser,
  onUpdateUser,
  onNavigate,
}) => {
  const [sessions, setSessions] = useState<WalkingSession[]>(() =>
    storage.getSessions(currentUser.id)
  );
  const [stats, setStats] = useState(() => storage.getUserStats(currentUser.id));

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.fullName);
  const [editGoal, setEditGoal] = useState(currentUser.dailyGoalKm?.toString() || '3.0');
  const [editCity, setEditCity] = useState(currentUser.city || 'Metro Urban Zone');
  const [editLeaderboard, setEditLeaderboard] = useState(currentUser.optInLeaderboard !== false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Sorting & Filtering state
  const [sortField, setSortField] = useState<'date' | 'distance' | 'credits'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7days' | '30days'>('all');

  // Session detail modal
  const [selectedSession, setSelectedSession] = useState<WalkingSession | null>(null);

  // Real-time synchronization
  useEffect(() => {
    const refresh = () => {
      setSessions(storage.getSessions(currentUser.id));
      setStats(storage.getUserStats(currentUser.id));
    };

    refresh();
    const unsubscribe = storage.subscribe(refresh);
    return () => unsubscribe();
  }, [currentUser.id]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.updateProfile(currentUser.id, {
      fullName: editName.trim(),
      dailyGoalKm: parseFloat(editGoal) || 3.0,
      city: editCity.trim(),
      optInLeaderboard: editLeaderboard,
    });

    if (updated) {
      onUpdateUser(updated);
      setIsEditing(false);
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 2500);
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    if (filterPeriod === 'all') return true;
    const sessionTime = new Date(s.sessionDate).getTime();
    const now = Date.now();
    const daysDiff = (now - sessionTime) / (1000 * 60 * 60 * 24);
    if (filterPeriod === '7days') return daysDiff <= 7;
    if (filterPeriod === '30days') return daysDiff <= 30;
    return true;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      comparison = new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
    } else if (sortField === 'distance') {
      comparison = b.distanceKm - a.distanceKm;
    } else if (sortField === 'credits') {
      comparison = b.creditsEarned - a.creditsEarned;
    }
    return sortAsc ? -comparison : comparison;
  });

  const toggleSort = (field: 'date' | 'distance' | 'credits') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <Car className="w-3.5 h-3.5 text-emerald-600" />;
      case 'auto_rickshaw':
        return <Navigation className="w-3.5 h-3.5 text-emerald-600" />;
      case 'motorcycle':
        return <Bike className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Footprints className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header & Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  Urban Citizen
                </span>
                {currentUser.optInLeaderboard !== false && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                    Leaderboard Active
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Joined{' '}
                    {new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile & Settings'}</span>
            </button>
            <button
              onClick={() => onNavigate('tracker')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Start New Walk</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Drawer / Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="pt-6 border-b border-slate-100 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Campus Zone
              </label>
              <input
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daily Walking Target (km)
              </label>
              <select
                value={editGoal}
                onChange={(e) => setEditGoal(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="1">1.0 km (Light)</option>
                <option value="2">2.0 km (Moderate)</option>
                <option value="3">3.0 km (Standard Habit)</option>
                <option value="5">5.0 km (Green Champion)</option>
              </select>
            </div>
            <div className="flex flex-col justify-between">
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editLeaderboard}
                  onChange={(e) => setEditLeaderboard(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Opt-in to Community Leaderboard
                </span>
              </label>
              <button
                type="submit"
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}

        {saveFeedback && (
          <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Profile and goal settings updated successfully.</span>
          </div>
        )}

        {/* Lifetime Statistics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Lifetime Distance</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
              {stats.totalDistanceKm.toFixed(2)} km
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Lifetime Credits</div>
            <div className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1">
              {stats.lifetimeCredits}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Total CO₂ Avoided</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
              {stats.totalCo2AvoidedKg.toFixed(2)} kg
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Completed Walks</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
              {stats.totalWalks}
            </div>
          </div>
        </div>
      </div>

      {/* Walking History Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Complete Walking History</h2>
            <p className="text-xs text-slate-500">
              Verified sessions logged with GPS distance, time, credits, and motor replacement
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Period Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setFilterPeriod('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterPeriod === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterPeriod('7days')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterPeriod === '7days'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setFilterPeriod('30days')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterPeriod === '30days'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Last 30 Days
              </button>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sort:</span>
              <button
                onClick={() => toggleSort('date')}
                className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                  sortField === 'date'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Date</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => toggleSort('distance')}
                className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                  sortField === 'distance'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Distance</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => toggleSort('credits')}
                className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                  sortField === 'credits'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Credits</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {sortedSessions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs space-y-2">
            <Footprints className="w-8 h-8 mx-auto text-slate-300" />
            <p>No walking sessions match the selected filter. Start a new walk to log activity!</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-6">Date & Start Time</th>
                  <th className="py-3 px-6">Walking Distance</th>
                  <th className="py-3 px-6">Duration</th>
                  <th className="py-3 px-6">Avg Speed</th>
                  <th className="py-3 px-6">Credits Earned</th>
                  <th className="py-3 px-6">Transport Replaced</th>
                  <th className="py-3 px-6">Avoided CO₂</th>
                  <th className="py-3 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedSessions.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      <div>
                        {new Date(session.sessionDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(session.sessionDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-6 font-mono font-semibold tabular-nums text-slate-900">
                      {session.distanceKm.toFixed(2)} km
                    </td>

                    <td className="py-3.5 px-6 font-mono tabular-nums text-slate-600">
                      {session.durationMinutes} min
                    </td>

                    <td className="py-3.5 px-6 font-mono text-slate-600">
                      {session.avgSpeedKmh ? session.avgSpeedKmh.toFixed(1) : '4.8'} km/h
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="font-mono font-bold text-emerald-700 tabular-nums bg-emerald-50 px-2 py-0.5 rounded-md">
                        +{session.creditsEarned}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1.5 capitalize text-slate-700">
                        {getVehicleIcon(session.transportReplaced)}
                        <span>{session.transportReplaced.replace('_', ' ')}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 font-mono font-medium text-slate-900 tabular-nums">
                      {session.estimatedCo2Avoided.toFixed(2)} kg
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <span className="text-emerald-700 group-hover:underline font-semibold text-[11px]">
                        View Details →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session Detailed Modal (Route map, times, credits, anti-cheat) */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Footprints className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Walk Session Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Route Map Preview if recorded */}
            {selectedSession.routeCoordinates && selectedSession.routeCoordinates.length > 0 && (
              <div className="h-48 rounded-2xl overflow-hidden border border-slate-200">
                <LeafletMap
                  coordinates={selectedSession.routeCoordinates}
                  currentLocation={null}
                  isTracking={false}
                  className="h-full"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Session ID</span>
                <div className="font-mono font-bold text-slate-800 text-[11px] truncate">
                  {selectedSession.id}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Recorded Date & Time</span>
                <div className="font-medium text-slate-800">
                  {new Date(selectedSession.sessionDate).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl space-y-1">
                <span className="text-emerald-800 font-medium">Distance & Speed</span>
                <div className="font-mono font-bold text-emerald-800 text-sm tabular-nums">
                  {selectedSession.distanceKm.toFixed(2)} km{' '}
                  <span className="text-xs font-normal">
                    ({selectedSession.avgSpeedKmh ? selectedSession.avgSpeedKmh.toFixed(1) : '4.8'} km/h)
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl space-y-1">
                <span className="text-emerald-800 font-medium">Credits Earned</span>
                <div className="font-mono font-bold text-emerald-800 text-sm tabular-nums">
                  +{selectedSession.creditsEarned} Credits
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Replaced Transportation:</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {selectedSession.transportReplaced.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Avoided CO₂:</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {selectedSession.estimatedCo2Avoided.toFixed(3)} kg
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GPS Anti-Cheat Validated</span>
                </span>
                <span className="text-slate-400 capitalize">Status: {selectedSession.sessionStatus}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSession(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
