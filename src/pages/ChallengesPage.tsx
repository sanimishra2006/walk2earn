import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Footprints,
  Compass,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Gift,
  Calendar,
} from 'lucide-react';
import { User, Challenge, UserChallenge } from '../types';
import { storage } from '../lib/storage';

interface ChallengesPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  onRefreshData?: () => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [challenges] = useState<Challenge[]>(() => storage.getChallenges());
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>(() =>
    storage.getUserChallenges(currentUser.id)
  );
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);

  // Subscribe to real-time storage updates
  useEffect(() => {
    const refresh = () => {
      storage.recalculateChallengesForUser(currentUser.id);
      setUserChallenges(storage.getUserChallenges(currentUser.id));
    };

    refresh();
    const unsubscribe = storage.subscribe(refresh);
    return () => unsubscribe();
  }, [currentUser.id]);

  const getChallengeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6 text-emerald-600" />;
      case 'Award':
        return <Award className="w-6 h-6 text-emerald-600" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-emerald-600" />;
      default:
        return <Footprints className="w-6 h-6 text-emerald-600" />;
    }
  };

  const handleClaim = (challengeId: string) => {
    const res = storage.claimChallengeReward(currentUser.id, challengeId);
    if (res.success) {
      setUserChallenges(storage.getUserChallenges(currentUser.id));
      setClaimSuccessMsg(
        `Claimed +${res.credits} Bonus Mobility Credits! Added directly to your credit wallet.`
      );
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#a3e635', '#22c55e', '#3b82f6'],
        });
      } catch {
        // Fallback
      }
      setTimeout(() => setClaimSuccessMsg(null), 4500);
    } else {
      alert(res.error || 'Failed to claim reward');
    }
  };

  // Split into active and completed/claimed challenges
  const activeList: { challenge: Challenge; userProgress: UserChallenge }[] = [];
  const completedList: { challenge: Challenge; userProgress: UserChallenge }[] = [];

  challenges.forEach((ch) => {
    const up =
      userChallenges.find((u) => u.challengeId === ch.id) || {
        id: `uch-${ch.id}`,
        userId: currentUser.id,
        challengeId: ch.id,
        progressKm: 0,
        isCompleted: false,
        rewardClaimed: false,
      };

    if (up.rewardClaimed) {
      completedList.push({ challenge: ch, userProgress: up });
    } else {
      activeList.push({ challenge: ch, userProgress: up });
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Walking Challenges
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bonus Credits</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hit daily, consecutive day, and weekly walking milestones to unlock bonus mobility credits and level up your status.
          </p>
        </div>

        <button
          onClick={() => onNavigate('tracker')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Footprints className="w-4 h-4" />
          <span>Walk for Challenges</span>
        </button>
      </div>

      {/* Claim Success Banner */}
      {claimSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{claimSuccessMsg}</span>
        </div>
      )}

      {/* Active Challenges Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Active & Ready to Claim</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeList.map(({ challenge, userProgress }) => {
            const percent = Math.min(
              100,
              Math.round((userProgress.progressKm / challenge.targetDistanceKm) * 100)
            );
            const isReadyToClaim = userProgress.isCompleted && !userProgress.rewardClaimed;

            const unitLabel =
              challenge.challengeType === 'consecutive' ? 'qualifying days' : 'km';

            return (
              <div
                key={challenge.id}
                className={`p-6 rounded-3xl border transition-all bg-white shadow-xs space-y-5 ${
                  isReadyToClaim
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      {getChallengeIcon(challenge.badgeIcon)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{challenge.name}</h3>
                      <div className="text-xs text-slate-500 capitalize flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{challenge.challengeType} target</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-extrabold text-emerald-700 text-base">
                      +{challenge.bonusCredits}
                    </span>
                    <div className="text-[10px] text-slate-400">Bonus Credits</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Progress Bar & Numeric Labels */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Progress</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {userProgress.progressKm.toFixed(1)} / {challenge.targetDistanceKm} {unitLabel} ({percent}%)
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 100 ? 'bg-emerald-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Claim or Walk Action */}
                <div className="pt-2">
                  {isReadyToClaim ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(challenge.id)}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-pulse"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim +{challenge.bonusCredits} Bonus Credits!</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>
                        {(challenge.targetDistanceKm - userProgress.progressKm).toFixed(1)}{' '}
                        {unitLabel} remaining
                      </span>
                      <button
                        onClick={() => onNavigate('tracker')}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Start walk</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Challenges Section */}
      {completedList.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Completed & Claimed Achievements</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedList.map(({ challenge, userProgress }) => (
              <div
                key={challenge.id}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{challenge.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Goal of {challenge.targetDistanceKm} {challenge.challengeType === 'consecutive' ? 'days' : 'km'} completed
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    +{challenge.bonusCredits} Claimed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
