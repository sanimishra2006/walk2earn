export type VehicleType = 'car' | 'motorcycle' | 'auto_rickshaw' | 'walking';

export interface VehicleOption {
  type: VehicleType;
  label: string;
  iconName: string;
  emissionFactor: number; // kg CO2 / km
  description: string;
}

export const VEHICLE_EMISSION_FACTORS: Record<VehicleType, { label: string; factor: number; icon: string; desc: string }> = {
  motorcycle: {
    label: 'Motorcycle',
    factor: 0.10,
    icon: 'Bike',
    desc: 'Average 125-150cc two-wheeler'
  },
  car: {
    label: 'Car',
    factor: 0.15,
    icon: 'Car',
    desc: 'Typical compact petrol/diesel car'
  },
  auto_rickshaw: {
    label: 'Auto-rickshaw',
    factor: 0.09,
    icon: 'Navigation',
    desc: 'Urban 3-wheeler auto rickshaw'
  },
  walking: {
    label: 'Already Walking',
    factor: 0.0,
    icon: 'Footprints',
    desc: 'Natural pedestrian commute (baseline - 0 offset)'
  }
};

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  city?: string;
  dailyGoalKm?: number; // 1, 2, 3, or 5 km
  optInLeaderboard?: boolean;
}

export interface GPSCoordinate {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy: number; // meters
  speed?: number | null; // m/s
}

export interface WalkingSession {
  id: string;
  userId: string;
  distanceKm: number;
  durationMinutes: number;
  creditsEarned: number;
  transportReplaced: VehicleType;
  estimatedCo2Avoided: number; // kg
  sessionDate: string; // ISO string
  sessionStatus: 'completed' | 'discarded';
  isSimulatedDemo?: boolean;
  routeCoordinates?: { lat: number; lng: number }[];
  avgSpeedKmh?: number;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'EARN_WALK' | 'EARN_CHALLENGE' | 'REDEEM_REWARD';
  credits: number;
  description: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  name: string;
  targetDistanceKm: number;
  bonusCredits: number;
  challengeType: 'daily' | 'consecutive' | 'weekly';
  description: string;
  badgeIcon: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progressKm: number;
  isCompleted: boolean;
  completionDate?: string;
  rewardClaimed: boolean;
}

export interface Reward {
  id: string;
  name: string;
  creditCost: number;
  description: string;
  type: 'badge' | 'coupon' | 'certificate';
  partnerName: string;
  validityDays: number;
  imageUrl?: string;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  creditsSpent: number;
  redeemedAt: string;
  redemptionCode: string;
  status: 'active' | 'used';
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'first_walk' | 'distance' | 'streak' | 'reward';
  requirement: number; // target value
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface WalkingStreak {
  currentStreak: number;
  longestStreak: number;
  lastQualifyingDate: string | null;
  qualifyingDates: string[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  weeklyDistanceKm: number;
  weeklyCredits: number;
  totalDistanceKm: number;
  badgeCount: number;
  topBadgeName?: string;
  isCurrentUser: boolean;
}

