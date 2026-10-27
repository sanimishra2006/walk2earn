#!/usr/bin/env python3
"""
Walk2Earn – Smart Walking Reward System Backend
Flask REST API with SQLite Persistent Database
Designed for 2-3 Month College Mini-Project in Sustainable Urban Mobility
"""

import os
import sqlite3
import math
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend

DB_PATH = os.path.join(os.path.dirname(__file__), "walk2earn.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

# Emission factors (kg CO2 / km)
EMISSION_FACTORS = {
    "motorcycle": 0.10,
    "car": 0.15,
    "auto_rickshaw": 0.09,
    "walking": 0.00
}

# --- 1. Authentication Routes ---

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    full_name = data.get("fullName", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not full_name or not email or not password:
        return jsonify({"success": False, "error": "All fields are required."}), 400

    if len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters."}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check existing user
    cursor.execute("SELECT user_id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"success": False, "error": "Email is already registered."}), 400

    user_id = f"usr-{uuid.uuid4().hex[:10]}"
    password_hash = generate_password_hash(password)

    try:
        cursor.execute("""
            INSERT INTO users (user_id, full_name, email, password_hash)
            VALUES (?, ?, ?, ?)
        """, (user_id, full_name, email, password_hash))

        # Initialize challenges progress for this user
        cursor.execute("SELECT challenge_id FROM challenges")
        challenges = cursor.fetchall()
        for ch in challenges:
            cursor.execute("""
                INSERT INTO user_challenges (user_challenge_id, user_id, challenge_id, progress)
                VALUES (?, ?, ?, 0.0)
            """, (f"uch-{uuid.uuid4().hex[:10]}", user_id, ch["challenge_id"]))

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"success": False, "error": str(e)}), 500

    conn.close()
    return jsonify({
        "success": True,
        "user": {
            "id": user_id,
            "fullName": full_name,
            "email": email,
            "city": "Metro Urban Zone",
            "dailyGoalKm": 3.0,
            "createdAt": datetime.utcnow().isoformat()
        }
    }), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required."}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"success": False, "error": "Invalid email or password."}), 401

    return jsonify({
        "success": True,
        "user": {
            "id": user["user_id"],
            "fullName": user["full_name"],
            "email": user["email"],
            "city": user["city"],
            "dailyGoalKm": user["daily_goal_km"],
            "createdAt": user["created_at"]
        }
    })

# --- 2. Dashboard & Statistics Routes ---

@app.route("/api/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "userId query parameter is required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Total distance & count
    cursor.execute("""
        SELECT 
            COALESCE(SUM(distance_km), 0) as total_dist,
            COALESCE(SUM(estimated_co2_avoided), 0) as total_co2,
            COALESCE(SUM(duration_minutes), 0) as total_mins,
            COUNT(session_id) as total_walks
        FROM walking_sessions
        WHERE user_id = ? AND session_status = 'completed'
    """, (user_id,))
    walk_stats = cursor.fetchone()

    # Calculate wallet balance
    cursor.execute("""
        SELECT 
            COALESCE(SUM(CASE WHEN transaction_type IN ('EARN_WALK', 'EARN_CHALLENGE') THEN credits ELSE 0 END), 0) as total_earned,
            COALESCE(SUM(CASE WHEN transaction_type = 'REDEEM_REWARD' THEN credits ELSE 0 END), 0) as total_redeemed
        FROM credit_transactions
        WHERE user_id = ?
    """, (user_id,))
    tx_stats = cursor.fetchone()
    available_credits = max(0, tx_stats["total_earned"] - tx_stats["total_redeemed"])

    # Completed challenges
    cursor.execute("""
        SELECT COUNT(*) as completed_count
        FROM user_challenges
        WHERE user_id = ? AND reward_claimed = 1
    """, (user_id,))
    ch_stats = cursor.fetchone()

    conn.close()

    return jsonify({
        "totalDistanceKm": round(walk_stats["total_dist"], 2),
        "totalCo2AvoidedKg": round(walk_stats["total_co2"], 2),
        "totalMinutes": walk_stats["total_mins"],
        "totalWalks": walk_stats["total_walks"],
        "totalCredits": available_credits,
        "lifetimeCredits": tx_stats["total_earned"],
        "completedChallenges": ch_stats["completed_count"]
    })

# --- 3. Walking Sessions & Anti-Cheat Validation ---

@app.route("/api/sessions/complete", methods=["POST"])
def complete_session():
    """
    Validates completed walk on backend and prevents client-submitted credit tampering.
    """
    data = request.get_json() or {}
    user_id = data.get("userId")
    distance_km = float(data.get("distanceKm", 0.0))
    duration_minutes = int(data.get("durationMinutes", 1))
    transport_replaced = data.get("transportReplaced", "motorcycle")
    avg_speed_kmh = float(data.get("avgSpeedKmh", 4.8))
    is_demo = bool(data.get("isSimulatedDemo", False))

    if not user_id or distance_km <= 0:
        return jsonify({"success": False, "error": "Invalid session parameters."}), 400

    # Backend Anti-Cheat Speed Validation: Human walking/jogging cannot exceed 15 km/h
    if avg_speed_kmh > 15.0:
        return jsonify({
            "success": False,
            "error": f"Session rejected: Speed {avg_speed_kmh:.1f} km/h exceeds human walking threshold (15 km/h)."
        }), 400

    # Server-Authoritative Credit Calculation: 1 credit per 100 meters (0.1 km)
    distance_meters = distance_km * 1000
    credits_earned = math.floor(distance_meters / 100)

    # Server-side CO2 offset calculation
    emission_factor = EMISSION_FACTORS.get(transport_replaced, 0.10)
    co2_avoided = round(distance_km * emission_factor, 3)

    session_id = f"sess-{uuid.uuid4().hex[:10]}"

    conn = get_db()
    cursor = conn.cursor()

    try:
        # 1. Insert session
        cursor.execute("""
            INSERT INTO walking_sessions (
                session_id, user_id, distance_km, duration_minutes,
                credits_earned, transport_replaced, estimated_co2_avoided,
                avg_speed_kmh, session_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed')
        """, (session_id, user_id, distance_km, duration_minutes, credits_earned, transport_replaced, co2_avoided, avg_speed_kmh))

        # 2. Credit transaction if non-demo and credits > 0
        if credits_earned > 0 and not is_demo:
            tx_id = f"tx-{uuid.uuid4().hex[:10]}"
            cursor.execute("""
                INSERT INTO credit_transactions (transaction_id, user_id, transaction_type, credits, description)
                VALUES (?, ?, 'EARN_WALK', ?, ?)
            """, (tx_id, user_id, credits_earned, f"Walked {distance_km:.2f} km replacing {transport_replaced}"))

            # 3. Update Challenge progress
            cursor.execute("""
                UPDATE user_challenges
                SET progress = MIN(progress + ?, (SELECT target_distance FROM challenges WHERE challenge_id = user_challenges.challenge_id)),
                    completion_date = CASE 
                        WHEN progress + ? >= (SELECT target_distance FROM challenges WHERE challenge_id = user_challenges.challenge_id) 
                        THEN CURRENT_TIMESTAMP ELSE completion_date END
                WHERE user_id = ?
            """, (distance_km, distance_km, user_id))

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"success": False, "error": str(e)}), 500

    conn.close()

    return jsonify({
        "success": True,
        "session": {
            "id": session_id,
            "userId": user_id,
            "distanceKm": distance_km,
            "durationMinutes": duration_minutes,
            "creditsEarned": credits_earned,
            "transportReplaced": transport_replaced,
            "estimatedCo2Avoided": co2_avoided,
            "avgSpeedKmh": avg_speed_kmh,
            "sessionDate": datetime.utcnow().isoformat()
        }
    }), 201

# --- 4. Challenges & Claims ---

@app.route("/api/challenges", methods=["GET"])
def get_challenges():
    user_id = request.args.get("userId")
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT c.*, uc.progress, uc.reward_claimed, uc.completion_date
        FROM challenges c
        LEFT JOIN user_challenges uc ON c.challenge_id = uc.challenge_id AND uc.user_id = ?
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["challenge_id"],
            "name": r["challenge_name"],
            "targetDistanceKm": r["target_distance"],
            "bonusCredits": r["bonus_credits"],
            "challengeType": r["challenge_type"],
            "description": r["description"],
            "badgeIcon": r["badge_icon"],
            "progressKm": r["progress"] or 0.0,
            "rewardClaimed": bool(r["reward_claimed"]),
            "isCompleted": (r["progress"] or 0.0) >= r["target_distance"]
        })

    return jsonify(result)

@app.route("/api/challenges/claim", methods=["POST"])
def claim_challenge():
    data = request.get_json() or {}
    user_id = data.get("userId")
    challenge_id = data.get("challengeId")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT c.bonus_credits, c.challenge_name, c.target_distance, uc.progress, uc.reward_claimed
        FROM challenges c
        JOIN user_challenges uc ON c.challenge_id = uc.challenge_id AND uc.user_id = ?
        WHERE c.challenge_id = ?
    """, (user_id, challenge_id))
    record = cursor.fetchone()

    if not record:
        conn.close()
        return jsonify({"success": False, "error": "Challenge record not found."}), 404

    if record["progress"] < record["target_distance"]:
        conn.close()
        return jsonify({"success": False, "error": "Challenge goal has not been reached."}), 400

    if record["reward_claimed"]:
        conn.close()
        return jsonify({"success": False, "error": "Reward already claimed."}), 400

    try:
        # Mark claimed
        cursor.execute("""
            UPDATE user_challenges
            SET reward_claimed = 1
            WHERE user_id = ? AND challenge_id = ?
        """, (user_id, challenge_id))

        # Award transaction
        tx_id = f"tx-{uuid.uuid4().hex[:10]}"
        cursor.execute("""
            INSERT INTO credit_transactions (transaction_id, user_id, transaction_type, credits, description)
            VALUES (?, ?, 'EARN_CHALLENGE', ?, ?)
        """, (tx_id, user_id, record["bonus_credits"], f"Challenge bonus for {record['challenge_name']}"))

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"success": False, "error": str(e)}), 500

    conn.close()
    return jsonify({"success": True, "credits": record["bonus_credits"]})

# --- 5. Rewards & Redemptions ---

@app.route("/api/rewards", methods=["GET"])
def get_rewards():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rewards ORDER BY credit_cost ASC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["reward_id"],
            "name": r["reward_name"],
            "creditCost": r["credit_cost"],
            "description": r["reward_description"],
            "type": r["reward_type"],
            "partnerName": r["partner_name"],
            "validityDays": r["validity_days"]
        })
    return jsonify(result)

@app.route("/api/rewards/redeem", methods=["POST"])
def redeem_reward():
    data = request.get_json() or {}
    user_id = data.get("userId")
    reward_id = data.get("rewardId")

    conn = get_db()
    cursor = conn.cursor()

    # 1. Fetch reward cost
    cursor.execute("SELECT * FROM rewards WHERE reward_id = ?", (reward_id,))
    reward = cursor.fetchone()
    if not reward:
        conn.close()
        return jsonify({"success": False, "error": "Reward not found."}), 404

    # 2. Check balance
    cursor.execute("""
        SELECT 
            COALESCE(SUM(CASE WHEN transaction_type IN ('EARN_WALK', 'EARN_CHALLENGE') THEN credits ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN transaction_type = 'REDEEM_REWARD' THEN credits ELSE 0 END), 0) as balance
        FROM credit_transactions
        WHERE user_id = ?
    """, (user_id,))
    balance_row = cursor.fetchone()
    current_balance = balance_row["balance"] if balance_row else 0

    if current_balance < reward["credit_cost"]:
        conn.close()
        return jsonify({
            "success": False,
            "error": f"Insufficient balance. You need {reward['credit_cost']} credits, have {current_balance}."
        }), 400

    # 3. Deduct via transaction & create redemption code
    code = f"W2E-{reward['reward_type'].upper()}-{uuid.uuid4().hex[:6].upper()}"
    redemption_id = f"red-{uuid.uuid4().hex[:10]}"
    tx_id = f"tx-{uuid.uuid4().hex[:10]}"

    try:
        cursor.execute("""
            INSERT INTO credit_transactions (transaction_id, user_id, transaction_type, credits, description)
            VALUES (?, ?, 'REDEEM_REWARD', ?, ?)
        """, (tx_id, user_id, reward["credit_cost"], f"Redeemed {reward['reward_name']}"))

        cursor.execute("""
            INSERT INTO redemptions (redemption_id, user_id, reward_id, credits_spent, redemption_code)
            VALUES (?, ?, ?, ?, ?)
        """, (redemption_id, user_id, reward_id, reward["credit_cost"], code))

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"success": False, "error": str(e)}), 500

    conn.close()

    return jsonify({
        "success": True,
        "redemption": {
            "id": redemption_id,
            "userId": user_id,
            "rewardId": reward_id,
            "rewardName": reward["reward_name"],
            "creditsSpent": reward["credit_cost"],
            "redemptionCode": code,
            "redeemedAt": datetime.utcnow().isoformat()
        }
    })

# --- 6. Session History ---

@app.route("/api/sessions/history", methods=["GET"])
def get_session_history():
    user_id = request.args.get("userId")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM walking_sessions 
        WHERE user_id = ? 
        ORDER BY session_date DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["session_id"],
            "distanceKm": r["distance_km"],
            "durationMinutes": r["duration_minutes"],
            "creditsEarned": r["credits_earned"],
            "transportReplaced": r["transport_replaced"],
            "estimatedCo2Avoided": r["estimated_co2_avoided"],
            "sessionDate": r["session_date"],
            "avgSpeedKmh": r["avg_speed_kmh"],
            "sessionStatus": r["session_status"]
        })
    return jsonify(result)

if __name__ == "__main__":
    # Local dev server runs on port 5000
    print("[*] Starting Walk2Earn Python Flask API on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
