import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  ShoppingBag,
  Coffee,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { User, Reward, Redemption } from '../types';
import { storage } from '../lib/storage';

interface RewardsPageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
  onRefreshData?: () => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [wallet, setWallet] = useState(() => storage.getWalletBalance(currentUser.id));
  const [rewards] = useState<Reward[]>(() => storage.getRewards());
  const [redemptions, setRedemptions] = useState<Redemption[]>(() =>
    storage.getRedemptions(currentUser.id)
  );

  // Confirmation Modal state
  const [pendingReward, setPendingReward] = useState<Reward | null>(null);

  // Success Modal & Toast state
  const [activeRedemption, setActiveRedemption] = useState<Redemption | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Subscribe to real-time storage updates
  useEffect(() => {
    const refresh = () => {
      setWallet(storage.getWalletBalance(currentUser.id));
      setRedemptions(storage.getRedemptions(currentUser.id));
    };

    refresh();
    const unsubscribe = storage.subscribe(refresh);
    return () => unsubscribe();
  }, [currentUser.id]);

  const handleOpenConfirm = (reward: Reward) => {
    setErrorMessage(null);

    if (wallet.availableBalance < reward.creditCost) {
      setErrorMessage(
        `You need more Mobility Credits to unlock this reward. Keep walking! (Cost: ${reward.creditCost} Credits, Available: ${wallet.availableBalance} Credits)`
      );
      return;
    }

    setPendingReward(reward);
  };

  const handleConfirmRedeem = () => {
    if (!pendingReward) return;

    const res = storage.redeemReward(currentUser.id, pendingReward.id);
    setPendingReward(null);

    if (res.success && res.redemption) {
      setActiveRedemption(res.redemption);
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
    } else {
      setErrorMessage(res.error || 'Failed to complete redemption.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coupon':
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'certificate':
        return <FileCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Award className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Mobility Credit Wallet Header */}
      <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 -mb-10 -mr-10 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Mobility Credit Wallet & Ledger
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Your Available Mobility Credits
            </h1>
            <p className="text-xs text-slate-300 max-w-md">
              Verified tokens earned at 1 credit per 100 meters walked. Redeemable for verified virtual badges, coupons, and certificates.
            </p>
          </div>

          <div className="flex items-baseline gap-2 bg-white/10 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white tabular-nums">
              {wallet.availableBalance}
            </span>
            <span className="text-sm font-semibold text-emerald-300 uppercase">Credits</span>
          </div>
        </div>

        {/* Wallet Ledger Breakdown */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400">Walking Earned:</span>
            <div className="font-mono font-bold text-white text-sm tabular-nums">
              +{wallet.totalEarned} Credits
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400">Challenge Bonuses:</span>
            <div className="font-mono font-bold text-emerald-300 text-sm tabular-nums">
              +{wallet.challengeBonus} Credits
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400">Total Redeemed:</span>
            <div className="font-mono font-bold text-rose-300 text-sm tabular-nums">
              -{wallet.totalRedeemed} Credits
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400">Available Balance:</span>
            <div className="font-mono font-extrabold text-emerald-300 text-sm tabular-nums">
              {wallet.availableBalance} Credits
            </div>
          </div>
        </div>
      </div>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => onNavigate('tracker')}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer"
          >
            Start Walk →
          </button>
        </div>
      )}

      {/* Academic Disclaimer Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Academic Demonstration Disclaimer:</strong> All coupons, shopping discount codes, and certificates on this platform are simulated virtual rewards designed for educational evaluation. They carry no real-world monetary value.
        </span>
      </div>

      {/* Reward Cards Marketplace Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Virtual Rewards Marketplace</h2>
          <span className="text-xs text-slate-500">{rewards.length} rewards available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = wallet.availableBalance >= reward.creditCost;
            return (
              <div
                key={reward.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Reward Header / Image */}
                <div>
                  {reward.imageUrl ? (
                    <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                      <img
                        src={reward.imageUrl}
                        alt={reward.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white font-mono text-xs font-bold">
                        {reward.creditCost} Credits
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        {getRewardIcon(reward.type)}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-100">
                        {reward.creditCost} Credits
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-2">
                    <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                      {reward.partnerName}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {reward.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>
                </div>

                {/* Redeem Button Footer */}
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 border-t border-slate-100 pt-3">
                    <span>Valid for {reward.validityDays} days</span>
                    <span className="capitalize">{reward.type}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenConfirm(reward)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100'
                    }`}
                  >
                    <span>
                      {canAfford
                        ? `Redeem (${reward.creditCost} Credits)`
                        : `Need ${reward.creditCost - wallet.availableBalance} More Credits`}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeemed Rewards History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Redeemed Rewards History</h3>
            <p className="text-xs text-slate-500">
              Active simulation coupons, vouchers, and certificates claimed by your account
            </p>
          </div>
          <span className="font-mono text-xs font-semibold text-slate-500">
            {redemptions.length} {redemptions.length === 1 ? 'reward' : 'rewards'}
          </span>
        </div>

        {redemptions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No rewards redeemed yet. Earn credits by walking and unlock your first reward!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {redemptions.map((red) => (
              <div
                key={red.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{red.rewardName}</h4>
                    <div className="text-[10px] text-slate-400">
                      Redeemed on {new Date(red.redeemedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {red.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                  <div className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                    {red.redemptionCode}
                  </div>
                  <button
                    onClick={() => handleCopyCode(red.redemptionCode)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Copy demo code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog Modal */}
      {pendingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Reward Redemption</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to redeem <strong>{pendingReward.name}</strong> for{' '}
                <strong>{pendingReward.creditCost} Mobility Credits</strong>?
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Available Credits:</span>
                <span className="font-mono font-bold text-slate-800">{wallet.availableBalance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reward Cost:</span>
                <span className="font-mono font-bold text-rose-600">-{pendingReward.creditCost}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
                <span className="text-slate-700">Remaining Balance:</span>
                <span className="font-mono text-emerald-700">
                  {wallet.availableBalance - pendingReward.creditCost} Credits
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPendingReward(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all active:scale-95"
              >
                Confirm & Deduct Credits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redemption Success Modal */}
      {activeRedemption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="text-center space-y-3 mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Reward Redeemed Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                You redeemed <strong>{activeRedemption.rewardName}</strong> using{' '}
                <strong>{activeRedemption.creditsSpent} credits</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mb-6 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Demonstration Voucher Code
              </span>
              <div className="p-3 bg-white rounded-xl border border-dashed border-emerald-300 flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-emerald-800 tracking-wider">
                  {activeRedemption.redemptionCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(activeRedemption.redemptionCode)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                This voucher code is saved to your wallet history.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveRedemption(null)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done & Return to Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
