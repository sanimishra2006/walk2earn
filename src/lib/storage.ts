import {
  User,
  WalkingSession,
  CreditTransaction,
  Challenge,
  UserChallenge,
  Reward,
  Redemption,
  AchievementBadge,
  WalkingStreak,
  LeaderboardEntry,
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'walk2earn_current_user',
  USERS: 'walk2earn_users',
  SESSIONS: 'walk2earn_sessions',
  DEMO_SESSIONS: 'walk2earn_demo_sessions',
  TRANSACTIONS: 'walk2earn_transactions',
  CHALLENGES: 'walk2earn_challenges',
  USER_CHALLENGES: 'walk2earn_user_challenges',
  REWARDS: 'walk2earn_rewards',
  REDEMPTIONS: 'walk2earn_redemptions',
  BADGES: 'walk2earn_badges',
};

// Standard initial challenges per college mini-project specs
export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    name: 'Beginner Walker',
    targetDistanceKm: 1.0,
    bonusCredits: 5,
    challengeType: 'daily',
    description: 'Walk 1 km in one day. Build your daily green commute habit.',
    badgeIcon: 'Footprints',
  },
  {
    id: 'ch-2',
    name: 'Daily Explorer',
    targetDistanceKm: 3.0,
    bonusCredits: 15,
    challengeType: 'daily',
    description: 'Walk 3 km in one day. Replace moderate short vehicle trips.',
    badgeIcon: 'Compass',
  },
  {
    id: 'ch-3',
    name: 'Green Champion',
    targetDistanceKm: 5.0,
    bonusCredits: 25,
    challengeType: 'daily',
    description: 'Walk 5 km in one day and drastically cut city carbon footprint.',
    badgeIcon: 'Award',
  },
  {
    id: 'ch-4',
    name: 'Consistency Hero',
    targetDistanceKm: 5.0, // 5 qualifying days (each at least 1 km)
    bonusCredits: 50,
    challengeType: 'consecutive',
    description: 'Complete qualifying walks (>= 1 km) on 5 consecutive days.',
    badgeIcon: 'Flame',
  },
  {
    id: 'ch-5',
    name: 'Green Week Challenge',
    targetDistanceKm: 15.0,
    bonusCredits: 30,
    challengeType: 'weekly',
    description: 'Walk 15 km within one calendar week (Mon - Sun).',
    badgeIcon: 'Sparkles',
  },
];

// Initial rewards catalog
export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew-1',
    name: 'Eco Beginner Digital Badge',
    creditCost: 50,
    description: 'Official digital bronze badge commemorating your first 5 km of sustainable pedestrian transit.',
    type: 'badge',
    partnerName: 'Walk2Earn Foundation',
    validityDays: 365,
    imageUrl: '/src/assets/images/walk_reward_badge_1793113334132.jpg',
  },
  {
    id: 'rew-2',
    name: 'Green Walker Silver Badge',
    creditCost: 100,
    description: 'Silver verified mobility badge for achieving 10+ km of motor vehicle displacement.',
    type: 'badge',
    partnerName: 'Urban Clean Air Initiative',
    validityDays: 365,
    imageUrl: '/src/assets/images/walk_reward_badge_1793113334132.jpg',
  },
  {
    id: 'rew-3',
    name: 'EcoGear 15% Discount Voucher',
    creditCost: 150,
    description: '15% off voucher code on sustainable apparel & walking accessories. Demo educational voucher.',
    type: 'coupon',
    partnerName: 'EcoGear Mobility Store',
    validityDays: 60,
  },
  {
    id: 'rew-4',
    name: 'GreenLeaf Café Beverage Coupon',
    creditCost: 200,
    description: 'Free organic beverage or 20% discount coupon at participating neighborhood green cafés.',
    type: 'coupon',
    partnerName: 'GreenLeaf Café Partner',
    validityDays: 30,
  },
  {
    id: 'rew-5',
    name: 'Urban Sustainability Certificate',
    creditCost: 300,
    description: 'Personalized verified digital certificate signed by the Urban Mobility Academic Panel.',
    type: 'certificate',
    partnerName: 'Center for Sustainable Transport',
    validityDays: 365,
  },
];

// Initial Achievement Badges per Section 9
export const INITIAL_BADGES_DEF = [
  {
    id: 'badge-1',
    name: 'First Step',
    description: 'Complete your first eligible walking session.',
    icon: 'Footprints',
    category: 'first_walk' as const,
    requirement: 1, // 1 session
  },
  {
    id: 'badge-2',
    name: 'Green Beginner',
    description: 'Walk a total of 5 km.',
    icon: 'Leaf',
    category: 'distance' as const,
    requirement: 5, // 5 km
  },
  {
    id: 'badge-3',
    name: 'Eco Explorer',
    description: 'Walk a total of 20 km.',
    icon: 'Compass',
    category: 'distance' as const,
    requirement: 20, // 20 km
  },
  {
    id: 'badge-4',
    name: 'Walking Champion',
    description: 'Walk a total of 50 km.',
    icon: 'Award',
    category: 'distance' as const,
    requirement: 50, // 50 km
  },
  {
    id: 'badge-5',
    name: 'Consistency Star',
    description: 'Maintain a 7-day walking streak (>= 1 km/day).',
    icon: 'Flame',
    category: 'streak' as const,
    requirement: 7, // 7 days
  },
  {
    id: 'badge-6',
    name: 'Reward Collector',
    description: 'Successfully redeem your first reward.',
    icon: 'Gift',
    category: 'reward' as const,
    requirement: 1, // 1 redemption
  },
];

// Demo user Alex Morgan for Viva showcase
const DEMO_USER: User = {
  id: 'usr-demo-01',
  fullName: 'Alex Morgan',
  email: 'alex.morgan@citywalk.org',
  createdAt: '2026-10-15T09:00:00.000Z',
  city: 'Metro Urban Zone',
  dailyGoalKm: 3.0,
  optInLeaderboard: true,
};

const DEMO_SESSIONS: WalkingSession[] = [
  {
    id: 'sess-101',
    userId: 'usr-demo-01',
    distanceKm: 2.4,
    durationMinutes: 28,
    creditsEarned: 24,
    transportReplaced: 'motorcycle',
    estimatedCo2Avoided: 0.24,
    sessionDate: '2026-10-22T08:30:00.000Z',
    sessionStatus: 'completed',
    avgSpeedKmh: 5.1,
  },
  {
    id: 'sess-102',
    userId: 'usr-demo-01',
    distanceKm: 3.1,
    durationMinutes: 37,
    creditsEarned: 31,
    transportReplaced: 'car',
    estimatedCo2Avoided: 0.465,
    sessionDate: '2026-10-23T17:45:00.000Z',
    sessionStatus: 'completed',
    avgSpeedKmh: 5.0,
  },
  {
    id: 'sess-103',
    userId: 'usr-demo-01',
    distanceKm: 1.8,
    durationMinutes: 21,
    creditsEarned: 18,
    transportReplaced: 'auto_rickshaw',
    estimatedCo2Avoided: 0.162,
    sessionDate: '2026-10-24T12:15:00.000Z',
    sessionStatus: 'completed',
    avgSpeedKmh: 5.2,
  },
  {
    id: 'sess-104',
    userId: 'usr-demo-01',
    distanceKm: 4.2,
    durationMinutes: 51,
    creditsEarned: 42,
    transportReplaced: 'motorcycle',
    estimatedCo2Avoided: 0.42,
    sessionDate: '2026-10-25T07:40:00.000Z',
    sessionStatus: 'completed',
    avgSpeedKmh: 4.9,
  },
  {
    id: 'sess-105',
    userId: 'usr-demo-01',
    distanceKm: 2.8,
    durationMinutes: 34,
    creditsEarned: 28,
    transportReplaced: 'car',
    estimatedCo2Avoided: 0.42,
    sessionDate: '2026-10-26T18:10:00.000Z',
    sessionStatus: 'completed',
    avgSpeedKmh: 4.9,
  },
];

const DEMO_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'tx-001',
    userId: 'usr-demo-01',
    type: 'EARN_WALK',
    credits: 24,
    description: 'Walked 2.40 km replacing motorcycle (Morning commute)',
    createdAt: '2026-10-22T08:58:00.000Z',
  },
  {
    id: 'tx-002',
    userId: 'usr-demo-01',
    type: 'EARN_WALK',
    credits: 31,
    description: 'Walked 3.10 km replacing car (Evening market trip)',
    createdAt: '2026-10-23T18:22:00.000Z',
  },
  {
    id: 'tx-003',
    userId: 'usr-demo-01',
    type: 'EARN_CHALLENGE',
    credits: 15,
    description: 'Completed "Daily Explorer" 3 km challenge bonus',
    createdAt: '2026-10-23T18:25:00.000Z',
  },
  {
    id: 'tx-004',
    userId: 'usr-demo-01',
    type: 'EARN_WALK',
    credits: 18,
    description: 'Walked 1.80 km replacing auto_rickshaw',
    createdAt: '2026-10-24T12:36:00.000Z',
  },
  {
    id: 'tx-005',
    userId: 'usr-demo-01',
    type: 'EARN_WALK',
    credits: 42,
    description: 'Walked 4.20 km replacing motorcycle (Greenway route)',
    createdAt: '2026-10-25T08:31:00.000Z',
  },
  {
    id: 'tx-006',
    userId: 'usr-demo-01',
    type: 'EARN_WALK',
    credits: 28,
    description: 'Walked 2.80 km replacing car',
    createdAt: '2026-10-26T18:44:00.000Z',
  },
  {
    id: 'tx-007',
    userId: 'usr-demo-01',
    type: 'REDEEM_REWARD',
    credits: 50,
    description: 'Redeemed Eco Beginner Digital Badge',
    createdAt: '2026-10-26T19:00:00.000Z',
  },
];

const DEMO_REDEMPTIONS: Redemption[] = [
  {
    id: 'red-001',
    userId: 'usr-demo-01',
    rewardId: 'rew-1',
    rewardName: 'Eco Beginner Digital Badge',
    creditsSpent: 50,
    redeemedAt: '2026-10-26T19:00:00.000Z',
    redemptionCode: 'ECO-BEG-7829-GRN',
    status: 'active',
  },
];

type StorageListener = () => void;

class StorageService {
  private listeners: Set<StorageListener> = new Set();

  constructor() {
    this.init();
  }

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in storage subscriber:', err);
      }
    });
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEMO_USER]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHALLENGES)) {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REWARDS)) {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(INITIAL_REWARDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(DEMO_SESSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEMO_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REDEMPTIONS)) {
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(DEMO_REDEMPTIONS));
    }
  }

  // Helper to format local date string YYYY-MM-DD
  public getLocalDateString(dateInput: Date | string = new Date()): string {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- Auth & Users ---
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    this.notify();
  }

  register(fullName: string, email: string): { success: boolean; user?: User; error?: string } {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      city: 'Urban Citizen Zone',
      dailyGoalKm: 3.0,
      optInLeaderboard: true,
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);

    // Initialize user challenge state for the new user
    this.ensureUserChallenges(newUser.id);
    this.notify();
    return { success: true, user: newUser };
  }

  login(email: string): { success: boolean; user?: User; error?: string } {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      // Auto-register convenience for college evaluation if not found
      return this.register(email.split('@')[0], email);
    }
    this.setCurrentUser(found);
    this.notify();
    return { success: true, user: found };
  }

  loginAsDemoUser(): User {
    this.setCurrentUser(DEMO_USER);
    this.notify();
    return DEMO_USER;
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  updateProfile(userId: string, updates: Partial<User>): User | null {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const current = this.getCurrentUser();
    let updatedUser = users[idx];
    if (current && current.id === userId) {
      updatedUser = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    }
    this.notify();
    return updatedUser;
  }

  // --- Walking Sessions ---
  getSessions(userId: string): WalkingSession[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    try {
      const all: WalkingSession[] = JSON.parse(raw);
      return all
        .filter((s) => s.userId === userId)
        .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
    } catch {
      return [];
    }
  }

  getDemoSessions(userId?: string): WalkingSession[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DEMO_SESSIONS);
    if (!raw) return [];
    try {
      const all: WalkingSession[] = JSON.parse(raw);
      return userId ? all.filter((s) => s.userId === userId) : all;
    } catch {
      return [];
    }
  }

  /**
   * Save a completed walking session and atomically credit the user's wallet.
   * Every 100 meters walked = 1 Mobility Credit awarded to the user wallet.
   */
  saveSession(sessionData: Omit<WalkingSession, 'id'>): { success: boolean; session: WalkingSession; error?: string } {
    try {
      // Validation: Calculate exact base credits: floor(meters / 100)
      const validMeters = Math.round(sessionData.distanceKm * 1000);
      const calculatedCredits = Math.floor(validMeters / 100);
      const creditsEarned = sessionData.creditsEarned !== undefined ? sessionData.creditsEarned : calculatedCredits;

      const newSession: WalkingSession = {
        ...sessionData,
        id: `sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        creditsEarned,
      };

      // Save to primary user sessions storage
      const sessions: WalkingSession[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]'
      );
      sessions.unshift(newSession);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

      // Also keep a copy in demo storage if flagged
      if (sessionData.isSimulatedDemo) {
        const demoSessions: WalkingSession[] = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.DEMO_SESSIONS) || '[]'
        );
        demoSessions.unshift(newSession);
        localStorage.setItem(STORAGE_KEYS.DEMO_SESSIONS, JSON.stringify(demoSessions));
      }

      // Record credit transaction to wallet whenever credits > 0
      if (creditsEarned > 0) {
        this.recordTransaction({
          userId: newSession.userId,
          type: 'EARN_WALK',
          credits: creditsEarned,
          description: `Walked ${newSession.distanceKm.toFixed(2)} km replacing ${newSession.transportReplaced.replace('_', ' ')}${sessionData.isSimulatedDemo ? ' (Auto-track walk)' : ''}`,
        });
      }

      // Update challenge progress and badges synchronously
      this.recalculateChallengesForUser(newSession.userId);
      this.recalculateBadgesForUser(newSession.userId);

      this.notify();
      return { success: true, session: newSession };
    } catch (err: any) {
      console.error('Failed to save walking session:', err);
      return {
        success: false,
        session: null as any,
        error: err.message || 'Storage error: Failed to save walking session.',
      };
    }
  }

  // --- Transactions & Ledger ---
  getTransactions(userId: string): CreditTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return [];
    try {
      const all: CreditTransaction[] = JSON.parse(raw);
      return all
        .filter((t) => t.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  recordTransaction(tx: Omit<CreditTransaction, 'id' | 'createdAt'>): CreditTransaction {
    const all: CreditTransaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    const newTx: CreditTransaction = {
      ...tx,
      id: `tx-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    return newTx;
  }

  getWalletBalance(userId: string): {
    totalEarned: number;
    challengeBonus: number;
    totalRedeemed: number;
    availableBalance: number;
  } {
    const txs = this.getTransactions(userId);
    let totalEarned = 0;
    let challengeBonus = 0;
    let totalRedeemed = 0;

    for (const t of txs) {
      if (t.type === 'EARN_WALK') {
        totalEarned += t.credits;
      } else if (t.type === 'EARN_CHALLENGE') {
        challengeBonus += t.credits;
      } else if (t.type === 'REDEEM_REWARD') {
        totalRedeemed += t.credits;
      }
    }

    const availableBalance = Math.max(0, totalEarned + challengeBonus - totalRedeemed);

    return {
      totalEarned,
      challengeBonus,
      totalRedeemed,
      availableBalance,
    };
  }

  // --- Walking Streaks ---
  getWalkingStreak(userId: string): WalkingStreak {
    const sessions = this.getSessions(userId);
    if (sessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastQualifyingDate: null,
        qualifyingDates: [],
      };
    }

    // Group distance by local date (YYYY-MM-DD)
    const dailyDistanceMap = new Map<string, number>();
    for (const s of sessions) {
      const dateStr = this.getLocalDateString(s.sessionDate);
      dailyDistanceMap.set(dateStr, (dailyDistanceMap.get(dateStr) || 0) + s.distanceKm);
    }

    // Qualifying day = at least 1.0 km walked
    const qualifyingDates = Array.from(dailyDistanceMap.entries())
      .filter(([_, km]) => km >= 1.0)
      .map(([d, _]) => d)
      .sort(); // ascending chronologically

    if (qualifyingDates.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastQualifyingDate: null,
        qualifyingDates: [],
      };
    }

    const dateSet = new Set(qualifyingDates);
    const lastQualifyingDate = qualifyingDates[qualifyingDates.length - 1];

    // Compute longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    for (const dStr of qualifyingDates) {
      const currDate = new Date(`${dStr}T00:00:00`);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      prevDate = currDate;
    }

    // Compute current streak: check backwards starting from today (or yesterday if today not walked yet)
    const today = new Date();
    const todayStr = this.getLocalDateString(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = this.getLocalDateString(yesterday);

    let currentStreak = 0;
    let checkDate: Date;

    if (dateSet.has(todayStr)) {
      checkDate = new Date(today);
    } else if (dateSet.has(yesterdayStr)) {
      checkDate = new Date(yesterday);
    } else {
      return {
        currentStreak: 0,
        longestStreak,
        lastQualifyingDate,
        qualifyingDates,
      };
    }

    while (true) {
      const dStr = this.getLocalDateString(checkDate);
      if (dateSet.has(dStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      currentStreak,
      longestStreak,
      lastQualifyingDate,
      qualifyingDates,
    };
  }

  // --- Today, Week, Month Metrics ---
  getTodayDistance(userId: string): number {
    const todayStr = this.getLocalDateString(new Date());
    const sessions = this.getSessions(userId);
    const todaySessions = sessions.filter((s) => this.getLocalDateString(s.sessionDate) === todayStr);
    const total = todaySessions.reduce((sum, s) => sum + s.distanceKm, 0);
    return Number(total.toFixed(2));
  }

  getWeeklyDistance(userId: string): number {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 for Mon, 6 for Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const sessions = this.getSessions(userId);
    const thisWeek = sessions.filter((s) => new Date(s.sessionDate) >= monday);
    const total = thisWeek.reduce((sum, s) => sum + s.distanceKm, 0);
    return Number(total.toFixed(2));
  }

  getTodayCo2Avoided(userId: string): number {
    const todayStr = this.getLocalDateString(new Date());
    const sessions = this.getSessions(userId);
    const todaySessions = sessions.filter((s) => this.getLocalDateString(s.sessionDate) === todayStr);
    const total = todaySessions.reduce((sum, s) => sum + s.estimatedCo2Avoided, 0);
    return Number(total.toFixed(3));
  }

  getWeeklyCo2Avoided(userId: string): number {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const sessions = this.getSessions(userId);
    const thisWeek = sessions.filter((s) => new Date(s.sessionDate) >= monday);
    const total = thisWeek.reduce((sum, s) => sum + s.estimatedCo2Avoided, 0);
    return Number(total.toFixed(3));
  }

  // Breakdown of CO2 avoided by transport mode
  getCo2BreakdownByTransport(userId: string) {
    const sessions = this.getSessions(userId);
    const breakdown = {
      motorcycle: 0,
      car: 0,
      auto_rickshaw: 0,
      walking: 0,
    };
    for (const s of sessions) {
      if (s.transportReplaced in breakdown) {
        breakdown[s.transportReplaced as keyof typeof breakdown] += s.estimatedCo2Avoided;
      }
    }
    return {
      motorcycle: Number(breakdown.motorcycle.toFixed(2)),
      car: Number(breakdown.car.toFixed(2)),
      auto_rickshaw: Number(breakdown.auto_rickshaw.toFixed(2)),
      walking: 0,
    };
  }

  // --- Aggregate Stats ---
  getUserStats(userId: string) {
    const sessions = this.getSessions(userId);
    const balance = this.getWalletBalance(userId);
    const streak = this.getWalkingStreak(userId);
    const todayDistance = this.getTodayDistance(userId);
    const todayCo2 = this.getTodayCo2Avoided(userId);
    const userChallenges = this.getUserChallenges(userId);
    const completedChallenges = userChallenges.filter((c) => c.isCompleted).length;

    const totalDistanceKm = sessions.reduce((sum, s) => sum + s.distanceKm, 0);
    const totalCo2AvoidedKg = sessions.reduce((sum, s) => sum + s.estimatedCo2Avoided, 0);
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    const current = this.getCurrentUser();
    const dailyGoalKm = (current && current.id === userId && current.dailyGoalKm) || 3.0;

    return {
      totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
      totalCredits: balance.availableBalance,
      lifetimeCredits: balance.totalEarned + balance.challengeBonus,
      totalEarnedCredits: balance.totalEarned,
      challengeBonusCredits: balance.challengeBonus,
      totalRedeemedCredits: balance.totalRedeemed,
      totalCo2AvoidedKg: Number(totalCo2AvoidedKg.toFixed(2)),
      todayDistanceKm: todayDistance,
      todayCo2AvoidedKg: todayCo2,
      dailyGoalKm,
      dailyGoalAchieved: todayDistance >= dailyGoalKm,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      completedChallenges,
      totalWalks: sessions.length,
      totalMinutes,
    };
  }

  // --- Challenges ---
  getChallenges(): Challenge[] {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CHALLENGES) || JSON.stringify(INITIAL_CHALLENGES)
    );
  }

  private ensureUserChallenges(userId: string): UserChallenge[] {
    const all: UserChallenge[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USER_CHALLENGES) || '[]'
    );
    let userList = all.filter((c) => c.userId === userId);
    const challenges = this.getChallenges();
    let updated = false;

    for (const ch of challenges) {
      if (!userList.some((uc) => uc.challengeId === ch.id)) {
        const newUc: UserChallenge = {
          id: `uch-${Date.now().toString(36)}-${ch.id}`,
          userId,
          challengeId: ch.id,
          progressKm: 0,
          isCompleted: false,
          rewardClaimed: false,
        };
        all.push(newUc);
        userList.push(newUc);
        updated = true;
      }
    }

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.USER_CHALLENGES, JSON.stringify(all));
    }
    return userList;
  }

  getUserChallenges(userId: string): UserChallenge[] {
    return this.ensureUserChallenges(userId);
  }

  /**
   * Recalculates challenge progress for the user dynamically from actual eligible walking sessions.
   * - Daily challenges: based on today's distance (resets daily).
   * - Consecutive challenge: based on current qualifying day streak.
   * - Weekly challenge: based on current week's distance (Mon - Sun).
   */
  recalculateChallengesForUser(userId: string) {
    const all: UserChallenge[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USER_CHALLENGES) || '[]'
    );
    this.ensureUserChallenges(userId);

    const todayKm = this.getTodayDistance(userId);
    const weeklyKm = this.getWeeklyDistance(userId);
    const streak = this.getWalkingStreak(userId);

    const challenges = this.getChallenges();

    all.forEach((uc) => {
      if (uc.userId === userId) {
        const def = challenges.find((c) => c.id === uc.challengeId);
        if (!def) return;

        if (def.challengeType === 'daily') {
          // Progress is today's distance
          uc.progressKm = Math.min(def.targetDistanceKm, todayKm);
          if (todayKm >= def.targetDistanceKm) {
            uc.isCompleted = true;
            if (!uc.completionDate) uc.completionDate = new Date().toISOString();
          }
        } else if (def.challengeType === 'consecutive') {
          // Progress is current streak count (target 5 days)
          uc.progressKm = Math.min(def.targetDistanceKm, streak.currentStreak);
          if (streak.currentStreak >= def.targetDistanceKm) {
            uc.isCompleted = true;
            if (!uc.completionDate) uc.completionDate = new Date().toISOString();
          }
        } else if (def.challengeType === 'weekly') {
          // Progress is weekly distance (target 15 km)
          uc.progressKm = Math.min(def.targetDistanceKm, weeklyKm);
          if (weeklyKm >= def.targetDistanceKm) {
            uc.isCompleted = true;
            if (!uc.completionDate) uc.completionDate = new Date().toISOString();
          }
        }
      }
    });

    localStorage.setItem(STORAGE_KEYS.USER_CHALLENGES, JSON.stringify(all));
  }

  claimChallengeReward(
    userId: string,
    challengeId: string
  ): { success: boolean; credits?: number; error?: string } {
    const all: UserChallenge[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USER_CHALLENGES) || '[]'
    );
    const chIdx = all.findIndex((c) => c.userId === userId && c.challengeId === challengeId);
    if (chIdx === -1) return { success: false, error: 'Challenge not found.' };

    const uc = all[chIdx];
    if (!uc.isCompleted) return { success: false, error: 'Challenge target is not yet completed.' };
    if (uc.rewardClaimed) {
      return { success: false, error: 'Bonus credits for this challenge have already been claimed.' };
    }

    const challenges = this.getChallenges();
    const challengeDef = challenges.find((c) => c.id === challengeId);
    if (!challengeDef) return { success: false, error: 'Challenge definition missing.' };

    uc.rewardClaimed = true;
    all[chIdx] = uc;
    localStorage.setItem(STORAGE_KEYS.USER_CHALLENGES, JSON.stringify(all));

    // Award bonus credits to wallet
    this.recordTransaction({
      userId,
      type: 'EARN_CHALLENGE',
      credits: challengeDef.bonusCredits,
      description: `Claimed bonus for "${challengeDef.name}" challenge`,
    });

    this.notify();
    return { success: true, credits: challengeDef.bonusCredits };
  }

  // --- Achievement Badges ---
  getBadges(userId: string): AchievementBadge[] {
    const stats = this.getUserStats(userId);
    const redemptions = this.getRedemptions(userId);

    return INITIAL_BADGES_DEF.map((b) => {
      let progress = 0;
      let unlocked = false;

      switch (b.id) {
        case 'badge-1': // First Step: 1 session
          progress = stats.totalWalks >= 1 ? 1 : 0;
          unlocked = stats.totalWalks >= 1;
          break;
        case 'badge-2': // Green Beginner: 5 km
          progress = Math.min(5, stats.totalDistanceKm);
          unlocked = stats.totalDistanceKm >= 5;
          break;
        case 'badge-3': // Eco Explorer: 20 km
          progress = Math.min(20, stats.totalDistanceKm);
          unlocked = stats.totalDistanceKm >= 20;
          break;
        case 'badge-4': // Walking Champion: 50 km
          progress = Math.min(50, stats.totalDistanceKm);
          unlocked = stats.totalDistanceKm >= 50;
          break;
        case 'badge-5': // Consistency Star: 7-day streak
          progress = Math.min(7, stats.longestStreak);
          unlocked = stats.longestStreak >= 7;
          break;
        case 'badge-6': // Reward Collector: 1 redemption
          progress = redemptions.length >= 1 ? 1 : 0;
          unlocked = redemptions.length >= 1;
          break;
      }

      return {
        ...b,
        unlocked,
        progress: Number(progress.toFixed(1)),
        maxProgress: b.requirement,
      };
    });
  }

  recalculateBadgesForUser(userId: string) {
    // Badges are dynamically computed in getBadges; this hook triggers notifications
    this.notify();
  }

  // --- Rewards & Redemptions ---
  getRewards(): Reward[] {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.REWARDS) || JSON.stringify(INITIAL_REWARDS)
    );
  }

  getRedemptions(userId: string): Redemption[] {
    const all: Redemption[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.REDEMPTIONS) || '[]'
    );
    return all
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());
  }

  redeemReward(
    userId: string,
    rewardId: string
  ): { success: boolean; redemption?: Redemption; error?: string } {
    const rewards = this.getRewards();
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, error: 'Reward not found.' };

    const wallet = this.getWalletBalance(userId);
    if (wallet.availableBalance < reward.creditCost) {
      return {
        success: false,
        error: `You need more Mobility Credits to unlock this reward. Keep walking! (Required: ${reward.creditCost}, Available: ${wallet.availableBalance})`,
      };
    }

    // Deduct credits via transaction ledger
    this.recordTransaction({
      userId,
      type: 'REDEEM_REWARD',
      credits: reward.creditCost,
      description: `Redeemed "${reward.name}"`,
    });

    // Generate unique verifiable simulation redemption voucher
    const code = `W2E-${reward.type.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newRedemption: Redemption = {
      id: `red-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      rewardId: reward.id,
      rewardName: reward.name,
      creditsSpent: reward.creditCost,
      redeemedAt: new Date().toISOString(),
      redemptionCode: code,
      status: 'active',
    };

    const allRedemptions: Redemption[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.REDEMPTIONS) || '[]'
    );
    allRedemptions.unshift(newRedemption);
    localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(allRedemptions));

    this.recalculateBadgesForUser(userId);
    this.notify();
    return { success: true, redemption: newRedemption };
  }

  // --- Leaderboard ---
  getLeaderboard(currentUserId: string): LeaderboardEntry[] {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const entries: LeaderboardEntry[] = [];

    for (const u of users) {
      if (u.optInLeaderboard === false) continue; // respected opt-out

      const weeklyKm = this.getWeeklyDistance(u.id);
      const stats = this.getUserStats(u.id);
      const badges = this.getBadges(u.id);
      const unlockedBadges = badges.filter((b) => b.unlocked);
      const topBadge = unlockedBadges.length > 0 ? unlockedBadges[unlockedBadges.length - 1].name : 'Pedestrian Novice';

      entries.push({
        rank: 0,
        userId: u.id,
        displayName: u.fullName || u.email.split('@')[0],
        weeklyDistanceKm: weeklyKm,
        weeklyCredits: Math.floor(weeklyKm * 10),
        totalDistanceKm: stats.totalDistanceKm,
        badgeCount: unlockedBadges.length,
        topBadgeName: topBadge,
        isCurrentUser: u.id === currentUserId,
      });
    }

    // Sort by weekly walking distance descending, then lifetime distance
    entries.sort((a, b) => {
      if (b.weeklyDistanceKm !== a.weeklyDistanceKm) {
        return b.weeklyDistanceKm - a.weeklyDistanceKm;
      }
      return b.totalDistanceKm - a.totalDistanceKm;
    });

    // Assign rank numbers
    entries.forEach((e, i) => {
      e.rank = i + 1;
    });

    return entries;
  }

  // --- Reset & Testing Helpers ---
  resetToFreshAccount(userId: string) {
    const sessions: WalkingSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    localStorage.setItem(
      STORAGE_KEYS.SESSIONS,
      JSON.stringify(sessions.filter((s) => s.userId !== userId))
    );

    const txs: CreditTransaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(txs.filter((t) => t.userId !== userId))
    );

    const redemptions: Redemption[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.REDEMPTIONS) || '[]'
    );
    localStorage.setItem(
      STORAGE_KEYS.REDEMPTIONS,
      JSON.stringify(redemptions.filter((r) => r.userId !== userId))
    );

    const ucs: UserChallenge[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USER_CHALLENGES) || '[]'
    );
    localStorage.setItem(
      STORAGE_KEYS.USER_CHALLENGES,
      JSON.stringify(ucs.filter((u) => u.userId !== userId))
    );

    this.notify();
  }

  resetDemoSimulationData() {
    localStorage.removeItem(STORAGE_KEYS.DEMO_SESSIONS);
    this.notify();
  }
}

export const storage = new StorageService();
