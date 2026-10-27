-- Walk2Earn SQLite Database Schema
-- Designed for Academic Mini-Project in Sustainable Urban Mobility

PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    city TEXT DEFAULT 'Metro Urban Zone',
    daily_goal_km REAL DEFAULT 3.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Walking Sessions Table
CREATE TABLE IF NOT EXISTS walking_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    distance_km REAL NOT NULL,
    duration_minutes INTEGER NOT NULL,
    credits_earned INTEGER NOT NULL,
    transport_replaced TEXT NOT NULL, -- 'motorcycle', 'car', 'auto_rickshaw', 'walking'
    estimated_co2_avoided REAL NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_status TEXT DEFAULT 'completed', -- 'completed', 'discarded'
    avg_speed_kmh REAL DEFAULT 4.8,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Credit Transactions Ledger
CREATE TABLE IF NOT EXISTS credit_transactions (
    transaction_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL, -- 'EARN_WALK', 'EARN_CHALLENGE', 'REDEEM_REWARD'
    credits INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Challenges Catalog
CREATE TABLE IF NOT EXISTS challenges (
    challenge_id TEXT PRIMARY KEY,
    challenge_name TEXT NOT NULL,
    target_distance REAL NOT NULL,
    bonus_credits INTEGER NOT NULL,
    challenge_type TEXT NOT NULL, -- 'daily', 'consecutive'
    description TEXT,
    badge_icon TEXT
);

-- 5. User Challenge Progress
CREATE TABLE IF NOT EXISTS user_challenges (
    user_challenge_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    progress REAL DEFAULT 0.0,
    completion_date TIMESTAMP,
    reward_claimed INTEGER DEFAULT 0, -- 0 for false, 1 for true
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    UNIQUE(user_id, challenge_id)
);

-- 6. Rewards Catalog
CREATE TABLE IF NOT EXISTS rewards (
    reward_id TEXT PRIMARY KEY,
    reward_name TEXT NOT NULL,
    credit_cost INTEGER NOT NULL,
    reward_description TEXT,
    reward_type TEXT DEFAULT 'coupon', -- 'badge', 'coupon', 'certificate'
    partner_name TEXT,
    validity_days INTEGER DEFAULT 30
);

-- 7. Redemptions Table
CREATE TABLE IF NOT EXISTS redemptions (
    redemption_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    reward_id TEXT NOT NULL,
    credits_spent INTEGER NOT NULL,
    redemption_code TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reward_id) REFERENCES rewards(reward_id) ON DELETE CASCADE
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON walking_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON credit_transactions(user_id);
