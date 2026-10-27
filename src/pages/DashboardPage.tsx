import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Footprints,
  Award,
  Leaf,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Bike,
  Car,
  Navigation,
  RefreshCw,
  Plus,
  Flame,
  CheckCircle2,
  Target,
  Trophy,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { User, WalkingSession, AchievementBadge } from '../types';
import { storage } from '../lib/storage';
import { WeeklyChart } from '../components/WeeklyChart';

interface DashboardPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  onStartWalk: () => void;
  onRefreshData?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  onNavigate,
  onStartWalk,
}) => {
  const [sessions, setSessions] = useState<WalkingSession[]>(() =>
    storage.getSessions(currentUser.id)
  );
  const [stats, setStats] = useState(() => storage.getUserStats(currentUser.id));
  const [streak, setStreak] = useState(() => storage.getWalkingStreak(currentUser.id));
  const [badges, setBadges] = useState<AchievementBadge[]>(() =>
    storage.getBadges(currentUser.id)
  );
  const [dailyGoalKm, setDailyGoalKm] = useState<number>(currentUser.dailyGoalKm || 3.0);
  const [goalCelebrated, setGoalCelebrated] = useState(false);

  // Subscribe to storage changes for instant real-time synchronization
  useEffect(() => {
    const refresh = () => {
      setSessions(storage.getSessions(currentUser.id));
      setStats(storage.getUserStats(currentUser.id));
      setStreak(storage.getWalkingStreak(currentUser.id));
      setBadges(storage.getBadges(currentUser.id));
      const user = storage.getCurrentUser();
      if (user && user.id === currentUser.id && user.dailyGoalKm) {
        setDailyGoalKm(user.dailyGoalKm);
      }
    };

    refresh();
    const unsubscribe = storage.subscribe(refresh);
    return () => unsubscribe();
  }, [currentUser.id]);

  // Goal celebration effect
  useEffect(() => {
    if (stats.dailyGoalAchieved && !goalCelebrated && stats.totalWalks > 0) {
      setGoalCelebrated(true);
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#a3e635', '#22c55e', '#f59e0b'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [stats.dailyGoalAchieved, stats.totalWalks, goalCelebrated]);

  const handleSelectGoal = (km: number) => {
    setDailyGoalKm(km);
    storage.updateProfile(currentUser.id, { dailyGoalKm: km });
  };

  const handleResetToEmpty = () => {
    if (
      window.confirm(
        'Reset this account to 0 walks & 0 credits to test the empty state and test scenarios?'
      )
    ) {
      storage.resetToFreshAccount(currentUser.id);
    }
  };

  const handleLoadDemoData = () => {
    storage.loginAsDemoUser();
    window.location.reload();
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

  // Daily Goal Progress Calculation
  const goalProgressPercent = Math.min(
    100,
    Math.round((stats.todayDistanceKm / dailyGoalKm) * 100)
  );

  // SVG circular ring circumference (r=42 -> 2 * PI * 42 ~= 263.89)
  const ringRadius = 42;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (goalProgressPercent / 100) * circumference;

  // Environmental impact stats
  const co2Breakdown = storage.getCo2BreakdownByTransport(currentUser.id);
  const weeklyDistance = storage.getWeeklyDistance(currentUser.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Quick Action */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              <Leaf className="w-3.5 h-3.5" />
              <span>Smart Walking Reward System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {currentUser.fullName}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Turn your daily pedestrian transit into verified mobility credits. Every 100 meters walked replaces vehicle exhaust and earns 1 credit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartWalk}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Footprints className="w-4 h-4" />
              <span>Start Walking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Academic Presentation Helper Controls */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Presentation Testing Controls:</span>
            {stats.totalWalks > 0 ? (
              <button
                onClick={handleResetToEmpty}
                className="hover:text-white underline cursor-pointer text-slate-300"
              >
                Reset to Zero/Empty State
              </button>
            ) : (
              <button
                onClick={handleLoadDemoData}
                className="hover:text-white underline cursor-pointer text-emerald-300 font-semibold"
              >
                Load Sample Walk Data
              </button>
            )}
          </div>
          <span className="font-mono text-[11px] text-emerald-300">
            User ID: {currentUser.id}
          </span>
        </div>
      </div>

      {/* 4 Core Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Distance Walked */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Distance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {stats.totalDistanceKm.toFixed(2)}{' '}
              <span className="text-sm font-semibold text-slate-400 font-sans">km</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>{stats.totalWalks} recorded walking {stats.totalWalks === 1 ? 'session' : 'sessions'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Available Mobility Credits */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available Credits
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {stats.totalCredits}{' '}
              <span className="text-sm font-semibold text-slate-400 font-sans">Credits</span>
            </div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center justify-between">
              <span>Total earned: {stats.lifetimeCredits}</span>
              <button
                onClick={() => onNavigate('rewards')}
                className="underline hover:text-emerald-800 cursor-pointer font-medium"
              >
                Redeem →
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Estimated CO2 Avoided */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              CO₂ Avoided
            </span>
            <div className="w-9 h-9 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {stats.totalCo2AvoidedKg.toFixed(2)}{' '}
              <span className="text-sm font-semibold text-slate-400 font-sans">kg</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              From replaced motor journeys
            </div>
          </div>
        </div>

        {/* Card 4: Completed Challenges */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Challenges
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {stats.completedChallenges}{' '}
              <span className="text-sm font-semibold text-slate-400 font-sans">Completed</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Active challenges</span>
              <button
                onClick={() => onNavigate('challenges')}
                className="underline hover:text-slate-800 cursor-pointer text-emerald-700 font-medium"
              >
                View →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Daily Goal Ring (Part 7) + Walking Streak System (Part 8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NEW FEATURE: My Daily Walking Goal */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>My Daily Walking Goal</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Today's Target: {dailyGoalKm} km
              </h3>
            </div>

            {/* Target Select Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[1, 2, 3, 5].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => handleSelectGoal(km)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    dailyGoalKm === km
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {km}k
                </button>
              ))}
            </div>
          </div>

          {/* Circular Progress Ring & Numbers */}
          <div className="flex items-center gap-6 pt-2">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={ringRadius}
                  className="text-slate-100"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={ringRadius}
                  className={`${
                    goalProgressPercent >= 100 ? 'text-emerald-600' : 'text-emerald-500'
                  } transition-all duration-700 ease-out`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold font-mono text-slate-900">
                  {goalProgressPercent}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Done</span>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Today's Distance:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {stats.todayDistanceKm.toFixed(2)} km
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Daily Target:</span>
                <span className="font-mono font-bold text-slate-700">
                  {dailyGoalKm.toFixed(1)} km
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Remaining:</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {Math.max(0, dailyGoalKm - stats.todayDistanceKm).toFixed(2)} km
                </span>
              </div>

              {stats.dailyGoalAchieved ? (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Congratulations! You achieved your daily walking goal!</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Hit your daily target to sustain your habit and advance challenges.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NEW FEATURE: Walking Streak System */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Walking Streak System</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Daily Habit Momentum
              </h3>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Current Streak
              </span>
              <div className="text-3xl font-extrabold text-amber-900 font-mono tabular-nums">
                {streak.currentStreak}{' '}
                <span className="text-sm font-normal text-amber-700 font-sans">
                  {streak.currentStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="text-[10px] text-amber-700">
                {streak.currentStreak > 0 ? 'Streak active today!' : 'Walk >= 1 km to start'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Longest Streak
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {streak.longestStreak}{' '}
                <span className="text-sm font-normal text-slate-500 font-sans">
                  {streak.longestStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                All-time record
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              <strong>Qualifying Rule:</strong> Complete at least 1.0 km on consecutive calendar days.
            </span>
            {streak.lastQualifyingDate && (
              <span className="font-mono text-slate-600 shrink-0 ml-2">
                Last: {streak.lastQualifyingDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* NEW FEATURE: Smart Environmental Impact Card (Part 10) */}
      <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Smart Environmental Impact</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your Green Contribution</h3>
          </div>
          <div className="text-xs text-slate-500 sm:text-right">
            Based on user-reported replaced vehicles
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Avoided Today</span>
            <div className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {stats.todayCo2AvoidedKg.toFixed(3)} kg
            </div>
            <div className="text-[10px] text-slate-400">CO₂ greenhouse gas</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Avoided This Week</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
              {storage.getWeeklyCo2Avoided(currentUser.id).toFixed(2)} kg
            </div>
            <div className="text-[10px] text-slate-400">Mon – Sun period</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Lifetime Avoided</span>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
              {stats.totalCo2AvoidedKg.toFixed(2)} kg
            </div>
            <div className="text-[10px] text-slate-400">Across all sessions</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Credits Generated</span>
            <div className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {stats.lifetimeCredits}
            </div>
            <div className="text-[10px] text-slate-400">Mobility tokens earned</div>
          </div>
        </div>

        {/* Breakdown by vehicle offset */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 text-xs space-y-2">
          <span className="font-semibold text-slate-700 block">
            Estimated Avoided Emissions by Transport Mode:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-600">Motorcycle offset:</span>
              <span className="font-mono font-bold text-slate-900">
                {co2Breakdown.motorcycle} kg
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-600">Car offset:</span>
              <span className="font-mono font-bold text-slate-900">
                {co2Breakdown.car} kg
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-600">Auto-rickshaw offset:</span>
              <span className="font-mono font-bold text-slate-900">
                {co2Breakdown.auto_rickshaw} kg
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Methodology:</strong> Illustrative academic emission factors used to encourage sustainable active transit.
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Activity Interactive Chart */}
      <WeeklyChart sessions={sessions} dailyGoalKm={dailyGoalKm} />

      {/* Achievement Badges Preview Grid (Part 9) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Achievement Badges</h3>
            <p className="text-xs text-slate-500">
              Unlock badges by completing walks, hitting distance milestones, and maintaining streaks
            </p>
          </div>
          <button
            onClick={() => onNavigate('badges')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            View All Badges →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all ${
                b.unlocked
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-bold text-sm ${
                  b.unlocked
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {b.unlocked ? <Trophy className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div className="font-bold text-xs text-slate-900 truncate">{b.name}</div>
              <div className="text-[10px] text-slate-500">
                {b.unlocked ? (
                  <span className="text-emerald-700 font-semibold">Unlocked</span>
                ) : (
                  <span>{b.progress}/{b.maxProgress}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Table / Empty State */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Walking Activity</h3>
            <p className="text-xs text-slate-500">
              Verified sessions logged with GPS distance and motor vehicle offset
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            View Full History →
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Footprints className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Your walking journey starts here!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No walks recorded yet. Take your first walk, choose your replaced transit mode, and start earning mobility credits!
              </p>
            </div>
            <button
              onClick={onStartWalk}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Start Your First Walk</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Distance</th>
                  <th className="py-3 px-6">Duration</th>
                  <th className="py-3 px-6">Credits Earned</th>
                  <th className="py-3 px-6">Replaced Transport</th>
                  <th className="py-3 px-6 text-right">CO₂ Avoided</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sessions.slice(0, 5).map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-900 text-xs">
                      {new Date(session.sessionDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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

                    <td className="py-3.5 px-6 font-mono tabular-nums text-slate-600 text-xs">
                      {session.durationMinutes} min
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="font-mono font-bold text-emerald-700 tabular-nums text-xs bg-emerald-50 px-2 py-0.5 rounded-md">
                        +{session.creditsEarned} Credits
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 capitalize">
                        {getVehicleIcon(session.transportReplaced)}
                        <span>{session.transportReplaced.replace('_', ' ')}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 text-right font-mono font-medium text-slate-900 text-xs tabular-nums">
                      {session.estimatedCo2Avoided.toFixed(2)} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
