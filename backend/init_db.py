#!/usr/bin/env python3
"""
Walk2Earn SQLite Database Initialization Script
Initializes tables and seeds default challenges, rewards, and demo user data.
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), "walk2earn.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")

def init_database():
    print(f"[*] Initializing database at {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Execute Schema
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)

    # Seed Default Challenges
    challenges = [
        ("ch-1", "Beginner Walker", 1.0, 5, "daily", "Walk 1 km in one day to build your green commute habit.", "Footprints"),
        ("ch-2", "Daily Explorer", 3.0, 15, "daily", "Walk 3 km in one day to replace moderate short-distance trips.", "Compass"),
        ("ch-3", "Green Champion", 5.0, 25, "daily", "Walk 5 km in one day and drastically cut city carbon footprint.", "Award"),
        ("ch-4", "Consistency Hero", 10.0, 50, "consecutive", "Complete qualifying walks on 5 consecutive days (10 km total).", "Flame"),
    ]
    cursor.executemany("""
        INSERT OR IGNORE INTO challenges (challenge_id, challenge_name, target_distance, bonus_credits, challenge_type, description, badge_icon)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, challenges)

    # Seed Default Rewards
    rewards = [
        ("rew-1", "Eco Beginner Badge", 50, "Official digital bronze badge commemorating your first 5 km of sustainable pedestrian transit.", "badge", "Walk2Earn Foundation", 365),
        ("rew-2", "Green Walker Badge", 100, "Silver verified mobility badge for achieving 10+ km of motor vehicle displacement.", "badge", "Urban Clean Air Initiative", 365),
        ("rew-3", "Demo Shopping Discount Coupon", 150, "15% off voucher code on sustainable apparel & walking accessories.", "coupon", "EcoWear Demo Partner", 60),
        ("rew-4", "Demo Café Discount Coupon", 200, "Free organic beverage or 20% discount coupon at participating neighborhood green cafes.", "coupon", "GreenLeaf Café Demo", 30),
        ("rew-5", "Sustainability Champion Certificate", 300, "Personalized verified digital certificate signed by the Urban Mobility Academic Panel.", "certificate", "Center for Sustainable Transport", 365),
    ]
    cursor.executemany("""
        INSERT OR IGNORE INTO rewards (reward_id, reward_name, credit_cost, reward_description, reward_type, partner_name, validity_days)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, rewards)

    # Seed Demo User
    demo_user_id = "usr-demo-01"
    demo_email = "alex.morgan@citywalk.org"
    password_hash = generate_password_hash("password123")

    cursor.execute("""
        INSERT OR IGNORE INTO users (user_id, full_name, email, password_hash, city, daily_goal_km)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (demo_user_id, "Alex Morgan", demo_email, password_hash, "Metro Urban Zone", 3.5))

    # Seed Demo Sessions
    demo_sessions = [
        ("sess-101", demo_user_id, 2.4, 28, 24, "motorcycle", 0.24, "2026-10-22 08:30:00", 5.1),
        ("sess-102", demo_user_id, 3.1, 37, 31, "car", 0.465, "2026-10-23 17:45:00", 5.0),
        ("sess-103", demo_user_id, 1.8, 21, 18, "auto_rickshaw", 0.162, "2026-10-24 12:15:00", 5.2),
        ("sess-104", demo_user_id, 4.2, 51, 42, "motorcycle", 0.42, "2026-10-25 07:40:00", 4.9),
        ("sess-105", demo_user_id, 2.8, 34, 28, "car", 0.42, "2026-10-26 18:10:00", 4.9),
    ]
    cursor.executemany("""
        INSERT OR IGNORE INTO walking_sessions (session_id, user_id, distance_km, duration_minutes, credits_earned, transport_replaced, estimated_co2_avoided, session_date, avg_speed_kmh)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, demo_sessions)

    # Seed Demo Transactions
    demo_txs = [
        ("tx-001", demo_user_id, "EARN_WALK", 24, "Walked 2.4 km replacing Motorcycle"),
        ("tx-002", demo_user_id, "EARN_WALK", 31, "Walked 3.1 km replacing Car"),
        ("tx-003", demo_user_id, "EARN_CHALLENGE", 15, "Completed Daily Explorer challenge"),
        ("tx-004", demo_user_id, "EARN_WALK", 18, "Walked 1.8 km replacing Auto-rickshaw"),
        ("tx-005", demo_user_id, "EARN_WALK", 42, "Walked 4.2 km replacing Motorcycle"),
        ("tx-006", demo_user_id, "EARN_WALK", 28, "Walked 2.8 km replacing Car"),
        ("tx-007", demo_user_id, "REDEEM_REWARD", 50, "Redeemed Eco Beginner Badge"),
    ]
    cursor.executemany("""
        INSERT OR IGNORE INTO credit_transactions (transaction_id, user_id, transaction_type, credits, description)
        VALUES (?, ?, ?, ?, ?)
    """, demo_txs)

    conn.commit()
    conn.close()
    print("[+] Database successfully initialized with tables and demonstration data.")

if __name__ == "__main__":
    init_database()
