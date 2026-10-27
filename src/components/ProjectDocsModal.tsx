import React, { useState } from 'react';
import { X, BookOpen, Database, Server, Compass, CheckCircle2, Copy, Check } from 'lucide-react';

interface ProjectDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'flask' | 'algorithms'>('architecture');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Walk2Earn – College Mini-Project & Architecture Guide
              </h2>
              <p className="text-xs text-slate-500">
                Academic specifications, SQLite schema, Python Flask backend & viva notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 gap-2 bg-white">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Architecture & Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQLite Database Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('flask')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'flask'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Python Flask Backend</span>
          </button>
          <button
            onClick={() => setActiveTab('algorithms')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'algorithms'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Formulas & Anti-Cheat</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-1">Project Abstract</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Walk2Earn investigates how behavioral gamification and tokenized mobility credits can motivate urban citizens to replace short-distance motorized commutes (motorcycles, cars, auto-rickshaws) with zero-emission walking. Every 100 meters walked awards 1 mobility credit, verified via GPS sensor filtering and converted into estimated carbon offset metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Frontend Stack</h4>
                  <ul className="text-xs space-y-1 text-slate-600 list-disc list-inside">
                    <li>React 19 + TypeScript for type-safe user interfaces</li>
                    <li>Tailwind CSS v4 with custom Plus Jakarta Sans styling</li>
                    <li>Leaflet + OpenStreetMap for live GPS route visualization</li>
                    <li>HTML5 Geolocation API with real-time coordinate streaming</li>
                    <li>Canvas Confetti for gamified milestone celebrations</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Backend Architecture (Python Flask)</h4>
                  <ul className="text-xs space-y-1 text-slate-600 list-disc list-inside">
                    <li>Python 3.10+ Flask lightweight microservices REST API</li>
                    <li>SQLite relational database with foreign key enforcement</li>
                    <li>Bcrypt / PBKDF2 password hashing security</li>
                    <li>Server-side distance verification & credit auditing</li>
                    <li>ACID transactions for credit deductions and redemptions</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">College Viva Presentation Advice</h4>
                <p className="text-xs text-slate-600">
                  During your presentation, use the built-in <strong>"Demo Walking Simulation"</strong> button in the Walking Tracker. It simulates realistic GPS steps at 5.0 km/h, draws the polyline dynamically, increments credits every 100m, and opens the carbon offset summary without needing to walk outside the examination hall!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">SQLite Database Schema (7 Relational Tables)</h3>
                  <p className="text-xs text-slate-500">File located at <code>backend/schema.sql</code></p>
                </div>
                <button
                  onClick={() =>
                    handleCopy(`-- SQLite Database Schema for Walk2Earn Mini-Project
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS walking_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    distance_km REAL NOT NULL,
    duration_minutes INTEGER NOT NULL,
    credits_earned INTEGER NOT NULL,
    transport_replaced TEXT NOT NULL,
    estimated_co2_avoided REAL NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_status TEXT DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS credit_transactions (
    transaction_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL, -- 'EARN_WALK', 'EARN_CHALLENGE', 'REDEEM_REWARD'
    credits INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS challenges (
    challenge_id TEXT PRIMARY KEY,
    challenge_name TEXT NOT NULL,
    target_distance REAL NOT NULL,
    bonus_credits INTEGER NOT NULL,
    challenge_type TEXT NOT NULL -- 'daily', 'consecutive'
);

CREATE TABLE IF NOT EXISTS user_challenges (
    user_challenge_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    progress REAL DEFAULT 0.0,
    completion_date TIMESTAMP,
    reward_claimed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id)
);

CREATE TABLE IF NOT EXISTS rewards (
    reward_id TEXT PRIMARY KEY,
    reward_name TEXT NOT NULL,
    credit_cost INTEGER NOT NULL,
    reward_description TEXT
);

CREATE TABLE IF NOT EXISTS redemptions (
    redemption_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    reward_id TEXT NOT NULL,
    credits_spent INTEGER NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (reward_id) REFERENCES rewards(reward_id)
);`)
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied SQL' : 'Copy Schema SQL'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`-- SQLite Database Schema for Walk2Earn Mini-Project
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS walking_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    distance_km REAL NOT NULL,
    duration_minutes INTEGER NOT NULL,
    credits_earned INTEGER NOT NULL,
    transport_replaced TEXT NOT NULL, -- 'motorcycle', 'car', 'auto_rickshaw', 'walking'
    estimated_co2_avoided REAL NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_status TEXT DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS credit_transactions (
    transaction_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL, -- 'EARN_WALK', 'EARN_CHALLENGE', 'REDEEM_REWARD'
    credits INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS challenges (
    challenge_id TEXT PRIMARY KEY,
    challenge_name TEXT NOT NULL,
    target_distance REAL NOT NULL,
    bonus_credits INTEGER NOT NULL,
    challenge_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_challenges (
    user_challenge_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    progress REAL DEFAULT 0.0,
    completion_date TIMESTAMP,
    reward_claimed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id)
);

CREATE TABLE IF NOT EXISTS rewards (
    reward_id TEXT PRIMARY KEY,
    reward_name TEXT NOT NULL,
    credit_cost INTEGER NOT NULL,
    reward_description TEXT
);

CREATE TABLE IF NOT EXISTS redemptions (
    redemption_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    reward_id TEXT NOT NULL,
    credits_spent INTEGER NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (reward_id) REFERENCES rewards(reward_id)
);`}
              </pre>
            </div>
          )}

          {activeTab === 'flask' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">How to Run the Flask + SQLite Backend Locally</h4>
                <ol className="text-xs space-y-1.5 text-slate-600 list-decimal list-inside">
                  <li>Navigate to the <code>backend/</code> folder in terminal: <code>cd backend</code></li>
                  <li>Create a Python virtual environment: <code>python -m venv venv</code></li>
                  <li>Activate virtualenv: <code>source venv/bin/activate</code> (or <code>venv\Scripts\activate</code> on Windows)</li>
                  <li>Install dependencies: <code>pip install -r requirements.txt</code></li>
                  <li>Initialize SQLite database: <code>python init_db.py</code></li>
                  <li>Start the Flask server: <code>python app.py</code> (runs at <code>http://127.0.0.1:5000</code>)</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Core REST API Endpoints Implemented</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <span className="text-emerald-700 font-bold">POST</span> /api/auth/register
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <span className="text-emerald-700 font-bold">POST</span> /api/auth/login
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <span className="text-blue-700 font-bold">GET</span> /api/dashboard/stats
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <span className="text-emerald-700 font-bold">POST</span> /api/sessions/complete
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <span className="text-blue-700 font-bold">GET</span> /api/challenges
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <span className="text-emerald-700 font-bold">POST</span> /api/challenges/claim
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <span className="text-blue-700 font-bold">GET</span> /api/rewards
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <span className="text-emerald-700 font-bold">POST</span> /api/rewards/redeem
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'algorithms' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">1. Haversine Distance Formula</h4>
                <p className="text-xs text-slate-600">
                  Computes the great-circle distance between two GPS latitude/longitude points on a spherical Earth (radius $R = 6,371,000$ m):
                </p>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                  d = 2 · R · asin( sqrt( sin²(Δlat/2) + cos(lat1) · cos(lat2) · sin²(Δlng/2) ) )
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">2. Mobility Credit Reward Rule</h4>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                  Credits = Math.floor( TotalEligibleMeters / 100 )
                </div>
                <p className="text-xs text-slate-500">
                  Example: 1,840 meters walked = 18 full units = 18 Mobility Credits awarded.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">3. Anti-Cheating & Sensor Noise Filtration</h4>
                <ul className="text-xs space-y-1 text-slate-600 list-disc list-inside">
                  <li><strong>Speed Ceiling:</strong> Max walking/jogging speed is 15.0 km/h (4.16 m/s). Segments exceeding this are rejected as motorized travel.</li>
                  <li><strong>Accuracy Filter:</strong> GPS pings with error radius &gt; 40 meters are dropped.</li>
                  <li><strong>Standing Jitter Filter:</strong> Distances &lt; 1.5 meters are ignored to prevent indoor drift accumulation.</li>
                  <li><strong>Teleportation Leap Filter:</strong> Distance jumps &gt; 60 meters within 4 seconds are flagged as GPS anomalies.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Full Python source code generated in <code>/backend</code> directory
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
