import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Footprints,
  Award,
  Calendar,
  Compass,
  Zap,
  ArrowRight,
  Leaf,
} from 'lucide-react';
import { User, WalkingSession } from '../types';
import { storage } from '../lib/storage';
import { WeeklyChart } from '../components/WeeklyChart';

interface AnalyticsPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ currentUser, onNavigate }) => {
  const [sessions, setSessions] = useState<WalkingSession[]>(() =>
    storage.getSessions(currentUser.id)
  );
  const [stats, setStats] = useState(() => storage.getUserStats(currentUser.id));

  useEffect(() => {
    const refresh = () => {
      setSessions(storage.getSessions(currentUser.id));
      setStats(storage.getUserStats(currentUser.id));
    };

    refresh();
    const unsubscribe = storage.subscribe(refresh);
    return () => unsubscribe();
  }, [currentUser.id]);

  // Compute Personal Statistics
  const avgDistance = sessions.length > 0 ? stats.totalDistanceKm / sessions.length : 0;
  const longestWalk =
    sessions.length > 0 ? Math.max(...sessions.map((s) => s.distanceKm)) : 0;

  const totalHours = Math.floor(stats.totalMinutes / 60);
  const remainingMinutes = stats.totalMinutes % 60;

  // Compute Most Active Day of Week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  sessions.forEach((s) => {
    const d = new Date(s.sessionDate).getDay();
    dayTotals[d] += s.distanceKm;
  });
  let maxDayIndex = 0;
  let maxDayKm = 0;
  dayTotals.forEach((km, idx) => {
    if (km > maxDayKm) {
      maxDayKm = km;
      maxDayIndex = idx;
    }
  });
  const mostActiveDay = maxDayKm > 0 ? dayNames[maxDayIndex] : 'No walks yet';

  // Compute Monthly Walking Distance for current year (Jan - Dec)
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const currentYear = new Date().getFullYear();
  const monthlyDistances = monthNames.map((name, idx) => {
    const monthlySessions = sessions.filter((s) => {
      const d = new Date(s.sessionDate);
      return d.getFullYear() === currentYear && d.getMonth() === idx;
    });
    const distanceKm = monthlySessions.reduce((sum, s) => sum + s.distanceKm, 0);
    const credits = monthlySessions.reduce((sum, s) => sum + s.creditsEarned, 0);
    return {
      monthName: name,
      distanceKm: Number(distanceKm.toFixed(2)),
      credits,
      sessionsCount: monthlySessions.length,
    };
  });
  const maxMonthlyKm = Math.max(5.0, ...monthlyDistances.map((m) => m.distanceKm));

  // Compute Credit Earnings Timeline (recent transactions grouped by date)
  const txs = storage.getTransactions(currentUser.id).filter((t) => t.type !== 'REDEEM_REWARD');
  const recentEarnings = txs.slice(0, 7).reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              My Walking Analytics
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personal Insights</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive breakdown of your distance progression, walking duration, and mobility credit generation.
          </p>
        </div>

        <button
          onClick={() => onNavigate('tracker')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Footprints className="w-4 h-4" />
          <span>Record New Session</span>
        </button>
      </div>

      {/* 5 Personal Key Statistics Cards (Part 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1: Average Distance */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Avg Walk Distance</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {avgDistance.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">km</span>
          </div>
          <div className="text-[10px] text-slate-400">Per recorded session</div>
        </div>

        {/* Metric 2: Total Walking Time */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Walking Time</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalHours}h {remainingMinutes}m
          </div>
          <div className="text-[10px] text-slate-400">{stats.totalMinutes} total minutes</div>
        </div>

        {/* Metric 3: Total Completed Sessions */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Footprints className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed Walks</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {stats.totalWalks}
          </div>
          <div className="text-[10px] text-slate-400">Verified GPS trips</div>
        </div>

        {/* Metric 4: Longest Recorded Walk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Longest Walk</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {longestWalk.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">km</span>
          </div>
          <div className="text-[10px] text-slate-400">Single session record</div>
        </div>

        {/* Metric 5: Most Active Walking Day */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Most Active Day</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 truncate">
            {mostActiveDay}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {maxDayKm > 0 ? `${maxDayKm.toFixed(1)} km logged` : 'Start walking'}
          </div>
        </div>
      </div>

      {/* Weekly Distance Chart */}
      <WeeklyChart sessions={sessions} dailyGoalKm={currentUser.dailyGoalKm || 3.0} />

      {/* Monthly Walking Chart (Part 11) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Monthly Walking Distance ({currentYear})
            </h3>
            <p className="text-xs text-slate-500">
              Cumulative walking distance across calendar months
            </p>
          </div>
          <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
            Annual Total: {stats.totalDistanceKm.toFixed(2)} km
          </div>
        </div>

        {/* 12-Month Bar Visualization */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 h-44 items-end pt-4 border-b border-slate-100">
          {monthlyDistances.map((m) => {
            const heightPercent = maxMonthlyKm > 0 ? (m.distanceKm / maxMonthlyKm) * 100 : 0;
            const currentMonthIdx = new Date().getMonth();
            const isCurrentMonth = monthNames[currentMonthIdx] === m.monthName;

            return (
              <div
                key={m.monthName}
                className="h-full flex flex-col justify-end items-center group cursor-pointer"
                title={`${m.monthName}: ${m.distanceKm} km (${m.sessionsCount} walks, +${m.credits} credits)`}
              >
                {m.distanceKm > 0 && (
                  <span className="text-[10px] font-mono font-semibold text-slate-600 mb-1 opacity-80">
                    {m.distanceKm}
                  </span>
                )}
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                    m.distanceKm > 0
                      ? isCurrentMonth
                        ? 'bg-emerald-600 shadow-xs'
                        : 'bg-emerald-400 hover:bg-emerald-500'
                      : 'bg-slate-100'
                  }`}
                  style={{ height: `${Math.max(6, heightPercent)}%` }}
                />
                <span
                  className={`text-[11px] mt-2 block ${
                    isCurrentMonth ? 'text-emerald-700 font-bold underline' : 'text-slate-400'
                  }`}
                >
                  {m.monthName}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
          <span>Values calculated from verified user walking records</span>
          <span className="font-mono text-[11px]">Target: 1 credit per 100m</span>
        </div>
      </div>

      {/* Credit Earnings Over Time Chart / Ledger (Part 11) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Credit Earnings Timeline</h3>
            <p className="text-xs text-slate-500">
              Recent mobility credit awards from walking sessions and completed challenges
            </p>
          </div>
          <button
            onClick={() => onNavigate('rewards')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            Open Wallet Ledger →
          </button>
        </div>

        {recentEarnings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No credit transactions recorded yet. Complete a walk to start earning!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentEarnings.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    +{tx.credits} Credits
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-2">{tx.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
