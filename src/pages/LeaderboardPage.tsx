import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Footprints,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Flame,
  Leaf,
  Compass,
  Gift,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { User, LeaderboardEntry, AchievementBadge } from '../types';
import { storage } from '../lib/storage';

interface LeaderboardPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  currentUser,
  onNavigate,
  onUpdateUser,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    storage.getLeaderboard(currentUser.id)
  );
  const [badges, setBadges] = useState<AchievementBadge[]>(() =>
    storage.getBadges(currentUser.id)
  );
  const [optIn, setOptIn] = useState<boolean>(currentUser.optInLeaderboard !== false);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges'>('leaderboard');

  useEffect(() => {
    const refresh = () => {
      setLeaderboard(storage.getLeaderboard(currentUser.id));
      setBadges(storage.getBadges(currentUser.id));
      const user = storage.getCurrentUser();
      if (user && user.id === currentUser.id) {
        setOptIn(user.optInLeaderboard !== false);
      }
    };

    refresh();
    const unsubscribe = storage.subscribe(refresh);
    return () => unsubscribe();
  }, [currentUser.id]);

  const handleToggleOptIn = (checked: boolean) => {
    setOptIn(checked);
    const updated = storage.updateProfile(currentUser.id, { optInLeaderboard: checked });
    if (updated) {
      onUpdateUser(updated);
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'Gift':
        return <Gift className="w-5 h-5 text-emerald-600" />;
      default:
        return <Footprints className="w-5 h-5 text-emerald-600" />;
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Community & Achievements
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus League</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare verified weekly walking distance with fellow citizens and collect sustainability milestone badges.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Leaderboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Achievement Badges</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              {unlockedCount}/6
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: COMMUNITY LEADERBOARD (Part 13) */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Privacy & Opt-In Control Card */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy-Preserving Community Leaderboard</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xl">
                Only your public display name and weekly walking totals are visible. Email addresses and individual GPS routes are strictly private and never exposed.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => handleToggleOptIn(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-slate-800">
                {optIn ? 'Participating in Leaderboard' : 'Opted Out (Hidden)'}
              </span>
            </label>
          </div>

          {/* Leaderboard Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Weekly Top Walkers</h3>
                <p className="text-xs text-slate-500">
                  Ranked by verified walking distance completed during the current calendar week (Mon – Sun)
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Current Week
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-6 w-16">Rank</th>
                    <th className="py-3.5 px-6">Participant</th>
                    <th className="py-3.5 px-6">Weekly Distance</th>
                    <th className="py-3.5 px-6">Weekly Credits</th>
                    <th className="py-3.5 px-6">Lifetime Distance</th>
                    <th className="py-3.5 px-6">Badges Unlocked</th>
                    <th className="py-3.5 px-6 text-right">Top Title</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.userId}
                      className={`transition-colors ${
                        entry.isCurrentUser
                          ? 'bg-emerald-50/60 font-semibold'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-6">
                        {entry.rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs shadow-2xs">
                            1
                          </span>
                        ) : entry.rank === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-bold text-xs">
                            2
                          </span>
                        ) : entry.rank === 3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                            3
                          </span>
                        ) : (
                          <span className="font-mono text-slate-500 pl-1.5">{entry.rank}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            {entry.displayName.charAt(0).toUpperCase()}
                          </div>
                          <span>{entry.displayName}</span>
                          {entry.isCurrentUser && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-6 font-mono font-bold text-slate-900 text-sm tabular-nums">
                        {entry.weeklyDistanceKm.toFixed(2)} km
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="font-mono font-bold text-emerald-700 tabular-nums bg-emerald-50 px-2 py-0.5 rounded-md">
                          +{entry.weeklyCredits} Credits
                        </span>
                      </td>

                      <td className="py-3.5 px-6 font-mono text-slate-600 tabular-nums">
                        {entry.totalDistanceKm.toFixed(2)} km
                      </td>

                      <td className="py-3.5 px-6 font-medium text-slate-700">
                        {entry.badgeCount} / 6
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          {entry.topBadgeName || 'Citizen Walker'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACHIEVEMENT BADGES GALLERY (Part 9) */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="p-4 rounded-3xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                You have unlocked <strong>{unlockedCount} of 6</strong> achievement badges. Keep walking to unlock the rest!
              </span>
            </div>
            <span className="font-mono font-bold bg-white px-3 py-1 rounded-xl text-emerald-800 border border-emerald-200">
              {Math.round((unlockedCount / 6) * 100)}% Complete
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {badges.map((b) => {
              const percent = Math.min(100, Math.round((b.progress / b.maxProgress) * 100));

              return (
                <div
                  key={b.id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 ${
                    b.unlocked
                      ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/10'
                      : 'bg-slate-50/60 border-slate-200 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs ${
                        b.unlocked
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {getBadgeIcon(b.icon)}
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        b.unlocked
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {b.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">{b.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{b.description}</p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Milestone Progress</span>
                      <span className="font-mono font-bold text-slate-800 tabular-nums">
                        {b.progress} / {b.maxProgress} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          b.unlocked ? 'bg-emerald-600' : 'bg-slate-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {b.unlocked && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Earned through verified active walking</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
