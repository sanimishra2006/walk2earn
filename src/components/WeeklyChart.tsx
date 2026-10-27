import React, { useState } from 'react';
import { WalkingSession } from '../types';

interface WeeklyChartProps {
  sessions: WalkingSession[];
  dailyGoalKm?: number;
}

interface DayData {
  dayName: string;
  dayShort: string;
  dateStr: string;
  distanceKm: number;
  creditsEarned: number;
  co2Avoided: number;
  walksCount: number;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ sessions, dailyGoalKm = 3.0 }) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  // Compute Monday to Sunday of the current week (or last 7 days)
  const days: DayData[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayShort, index) => {
    // Current week dates
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 for Monday, 6 for Sunday
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - dayOfWeek + index);
    const dateStr = targetDate.toISOString().split('T')[0];

    // Find sessions on this date
    const daySessions = sessions.filter((s) => {
      if (s.isSimulatedDemo) return false;
      const sDate = new Date(s.sessionDate).toISOString().split('T')[0];
      return sDate === dateStr;
    });

    const distanceKm = daySessions.reduce((acc, s) => acc + s.distanceKm, 0);
    const creditsEarned = daySessions.reduce((acc, s) => acc + s.creditsEarned, 0);
    const co2Avoided = daySessions.reduce((acc, s) => acc + s.estimatedCo2Avoided, 0);

    const fullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return {
      dayName: fullNames[index],
      dayShort,
      dateStr,
      distanceKm: Number(distanceKm.toFixed(2)),
      creditsEarned,
      co2Avoided: Number(co2Avoided.toFixed(2)),
      walksCount: daySessions.length,
    };
  });

  const maxDistance = Math.max(5.0, ...days.map((d) => d.distanceKm));
  const totalWeeklyKm = days.reduce((sum, d) => sum + d.distanceKm, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Weekly Walking Activity
          </h3>
          <p className="text-xs text-slate-500">
            Distance walked each day (Mon – Sun) from verified GPS sessions
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block"></span>
            <span>Distance (km)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-dashed border-t border-emerald-400 inline-block"></span>
            <span>Target ({dailyGoalKm} km)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas / SVG Container */}
      <div className="relative pt-6 pb-2">
        {/* Goal Line Reference */}
        <div
          className="absolute left-10 right-0 border-b border-dashed border-emerald-400/80 pointer-events-none z-10 flex items-center justify-end"
          style={{
            bottom: `calc(${Math.min(100, (dailyGoalKm / maxDistance) * 100)}% * 0.75 + 40px)`,
          }}
        >
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm font-mono mr-2">
            Target {dailyGoalKm} km
          </span>
        </div>

        {/* Bar Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end pl-10 pr-2 border-b border-slate-100">
          {days.map((day) => {
            const heightPercent = maxDistance > 0 ? (day.distanceKm / maxDistance) * 100 : 0;
            const isToday = day.dateStr === new Date().toISOString().split('T')[0];
            const isGoalMet = day.distanceKm >= dailyGoalKm;

            return (
              <div
                key={day.dayShort}
                className="relative h-full flex flex-col justify-end items-center group cursor-pointer"
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Distance Label above bar */}
                {day.distanceKm > 0 && (
                  <span className="text-[11px] font-mono tabular-nums font-semibold text-slate-700 mb-1 opacity-90 transition-opacity">
                    {day.distanceKm}
                  </span>
                )}

                {/* Animated Bar */}
                <div
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${
                    isGoalMet
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-xs'
                      : day.distanceKm > 0
                      ? 'bg-emerald-400/80 hover:bg-emerald-500'
                      : 'bg-slate-100'
                  }`}
                  style={{
                    height: `${Math.max(6, heightPercent)}%`,
                  }}
                >
                  {isGoalMet && (
                    <div className="w-full h-1.5 rounded-t-xl bg-lime-300/80"></div>
                  )}
                </div>

                {/* Day of Week Label */}
                <div className="mt-3 text-center">
                  <span
                    className={`text-xs font-medium block ${
                      isToday ? 'text-emerald-700 font-bold underline decoration-2' : 'text-slate-500'
                    }`}
                  >
                    {day.dayShort}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Hover Details Card or Weekly Summary */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2">
        {hoveredDay ? (
          <div className="flex items-center gap-3 text-slate-700 font-medium animate-in fade-in">
            <span className="font-bold text-slate-900">{hoveredDay.dayName}:</span>
            <span>
              <strong className="text-emerald-700">{hoveredDay.distanceKm} km</strong> walked ({hoveredDay.walksCount} {hoveredDay.walksCount === 1 ? 'walk' : 'walks'})
            </span>
            <span>·</span>
            <span>+{hoveredDay.creditsEarned} Credits</span>
            <span>·</span>
            <span>{hoveredDay.co2Avoided} kg CO₂ avoided</span>
          </div>
        ) : (
          <div className="text-slate-500">
            Total this week:{' '}
            <strong className="text-slate-900 font-mono font-bold">{totalWeeklyKm.toFixed(2)} km</strong>
            {' · '}
            Hover over bars to inspect daily statistics.
          </div>
        )}
        <div className="text-[11px] text-slate-400">
          Updated in real-time from completed GPS walks
        </div>
      </div>
    </div>
  );
};
