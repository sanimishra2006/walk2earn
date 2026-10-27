# Walk2Earn: Smart Walking Reward System Backend & Setup Guide

**Tagline:** "Every Step Counts. Walk More, Earn More, Live Greener."  
**Domain:** Sustainable Urban Mobility & Pedestrian Transit Incentivization  
**Architecture:** React 19 Frontend + Python Flask REST API + SQLite Relational Database  

---

## 1. Project Directory Structure

```
walk2earn/
├── backend/
│   ├── app.py              # Flask REST API endpoints and business logic
│   ├── init_db.py          # SQLite database initializer and seed script
│   ├── schema.sql          # 7 normalized SQLite relational tables
│   ├── requirements.txt    # Python dependencies (Flask, Flask-Cors, Werkzeug)
│   └── README.md           # Setup and project documentation
├── src/
│   ├── components/         # LeafletMap, WeeklyChart, TripReplacementModal, Navbar, Footer
│   ├── pages/              # LandingPage, AuthPage, Dashboard, Tracker, Challenges, Rewards, Profile
│   ├── lib/                # Geo algorithms, Haversine formula, storage
│   └── types/              # TypeScript schemas
└── package.json
```

---

## 2. Local Setup & Execution Instructions

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm

### Step 1: Set Up Python Flask Backend
1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Initialize the SQLite database and seed test data:
   ```bash
   python init_db.py
   ```
   *This creates `walk2earn.db` with all 7 relational tables and seeds default challenges, rewards, and the demo user Alex Morgan.*

5. Run the Flask API server:
   ```bash
   python app.py
   ```
   *The API will run at `http://127.0.0.1:5000`.*

### Step 2: Set Up and Run the Frontend
1. In a separate terminal tab, navigate to the project root:
   ```bash
   npm install
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000` (or `http://localhost:5173`).

---

## 3. How to Demonstrate for College Viva / Presentation

1. **Quick Login Demonstration:**
   - On the login screen, click **"Instant One-Click Demo Login"** to sign in as *Alex Morgan*.
   - Show the examiner the pre-populated dashboard with 5 verified walks, 125 credits, and 1.7 kg CO₂ offset.

2. **Demonstrating Zero State / Fresh Account:**
   - On the Dashboard, click **"Test Zero/Empty State"** under Presentation Controls.
   - Show how a new account gracefully handles 0 distance with helpful empty states.

3. **Demonstrating the GPS Walking Tracker:**
   - Go to **Start Walking**.
   - Click **"Demo Walking Simulation"** for indoor presentation.
   - Select the replaced transit mode (e.g., *Motorcycle* or *Car*).
   - Watch the interactive Leaflet map dynamically render the walking path step-by-step.
   - Explain how every **100 meters walked increments 1 Mobility Credit** ($1\text{ credit} = 100\text{m}$).
   - Click **"Stop Walking & Save Credits"** to display the celebration summary modal and carbon savings!

4. **Demonstrating Reward Redemption:**
   - Navigate to the **Rewards** marketplace.
   - Show available balance, then click **Redeem** on a virtual coupon or badge.
   - Demonstrate the generated unique demonstration voucher code and balance deduction.

---

## 4. Key Academic Formulas & Viva Q&A

### Q1: How is walking distance calculated between GPS points?
**Answer:** We implement the **Haversine Formula**, which computes great-circle distance between two latitude/longitude pairs on a spherical Earth ($R = 6,371,000\text{ meters}$):
$$a = \sin^2(\Delta\phi/2) + \cos(\phi_1)\cos(\phi_2)\sin^2(\Delta\lambda/2)$$
$$d = 2R \cdot \arctan2(\sqrt{a}, \sqrt{1-a})$$

### Q2: How does the system prevent cheating or vehicle riding?
**Answer:** 
1. **Speed Thresholding:** The average walking pace is $4\text{–}6\text{ km/h}$. Speeds exceeding $15\text{ km/h}$ indicate motorized transport or cycling and are excluded from credits.
2. **Sensor Accuracy Filter:** GPS pings with error radius $>40\text{ meters}$ are discarded.
3. **Leap Anomaly Filter:** Sudden distance jumps $>60\text{ meters}$ in under 4 seconds are flagged as GPS jitter.

### Q3: How is CO₂ emission avoidance calculated?
**Answer:** Before every walk, the user selects what motorized transport they are replacing (*Motorcycle*, *Car*, *Auto-rickshaw*). The avoided CO₂ is estimated as:
$$\text{CO}_2\text{ Avoided (kg)} = \text{Distance (km)} \times \text{Emission Factor (kg CO}_2\text{/km)}$$
*(Illustrative factors: Car = 0.15 kg/km, Motorcycle = 0.10 kg/km, Auto-rickshaw = 0.09 kg/km).*
