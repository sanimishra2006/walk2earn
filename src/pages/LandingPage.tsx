import React from 'react';
import {
  Footprints,
  Award,
  Navigation,
  Leaf,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Bike,
  Sparkles,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { User } from '../types';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onOpenProjectGuide?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  currentUser,
  onOpenProjectGuide,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle geometric background accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-lime-100/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Sustainable Urban Mobility Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sustainable Urban Mobility Platform</span>
                <span className="text-emerald-400">·</span>
                <span>Active Transit Incentive</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
                Turn Your Daily Walks Into <span className="text-emerald-600">Rewards</span>.
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Choose walking for short trips, earn mobility credits, unlock exciting rewards, and contribute to a greener, cleaner city. Every step counts toward zero-emission urban transport.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(currentUser ? 'tracker' : 'auth')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Footprints className="w-5 h-5" />
                  <span>Start Walking</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-200 shadow-xs transition-all cursor-pointer"
                >
                  Explore Features
                </button>

                {onOpenProjectGuide && (
                  <button
                    type="button"
                    onClick={onOpenProjectGuide}
                    className="px-4 py-3.5 rounded-xl text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    View Project Viva Docs →
                  </button>
                )}
              </div>

              {/* Quick Trust / Methodology Row */}
              <div className="pt-4 border-t border-slate-200/60 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Real-time GPS validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>100m = 1 Mobility Credit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Estimated CO₂ avoided metrics</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Dashboard Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                <img
                  src="/src/assets/images/walk_hero_city_1793113334179.jpg"
                  alt="Modern urban greenway with pedestrians"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-72 object-cover"
                />

                {/* Floating Metric Card Overlay */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        W2E
                      </div>
                      <span className="font-bold text-sm text-slate-900">Pedestrian Commute</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Live Simulation
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Distance</div>
                      <div className="text-base font-bold text-slate-900 font-mono tabular-nums">2.4 km</div>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl">
                      <div className="text-[10px] text-emerald-700 uppercase font-semibold">Credits</div>
                      <div className="text-base font-bold text-emerald-700 font-mono tabular-nums">+24</div>
                    </div>
                    <div className="p-2.5 bg-lime-50 rounded-xl">
                      <div className="text-[10px] text-slate-700 uppercase font-semibold">CO₂ Offset</div>
                      <div className="text-base font-bold text-slate-900 font-mono tabular-nums">0.36 kg</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-emerald-600" />
                      <span>Replaced: Motorcycle trip</span>
                    </div>
                    <span className="font-semibold text-emerald-700">Verified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section (4 Steps) */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Simple 4-Step Journey
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              How Walk2Earn Works
            </h3>
            <p className="text-base text-slate-600">
              Transforming your everyday neighborhood errands and campus walks into tangible eco-rewards in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-600 font-extrabold text-lg mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Create Your Account</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sign up and join the Walk2Earn urban community. Set your daily walking target and initialize your personal mobility wallet.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-600 font-extrabold text-lg mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Start Walking</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enable GPS on your phone or laptop. Choose which motor vehicle trip you are replacing and track your walk live on the interactive map.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-600 font-extrabold text-lg mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Earn Mobility Credits</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive 1 credit for every 100 meters walked. Automated anti-cheating algorithms verify your human pedestrian pace.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-600 font-extrabold text-lg mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                4
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Redeem Rewards</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Spend credits to unlock demo café discount coupons, shopping vouchers, eco-walker badges, and academic certificates.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Section (3 Benefits) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Impact & Value
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              Why Walking Matters
            </h3>
            <p className="text-base text-slate-600">
              Addressing urban congestion and health through structured behavioral nudges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Benefit 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bike className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">1. Reduce Dependence on Vehicles</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Over 40% of urban car and motorcycle trips are under 2 kilometers. Replacing these with walking cuts city emissions, reduces traffic gridlock, and saves fossil fuels.
              </p>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Cuts ~0.15 kg CO₂ per km replaced</span>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-lime-50 text-lime-700 flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">2. Encourage Healthy Walking Habits</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Walking 30 minutes a day boosts cardiovascular fitness, mental clarity, and stamina while combating the sedentary lifestyles common among students and office workers.
              </p>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Daily active streak challenges</span>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Leaf className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">3. Promote Sustainable Urban Mobility</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Creates more livable, walkable city neighborhoods. When walking is rewarded, citizens become active stakeholders in municipal decarbonization goals.
              </p>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Aligns with UN SDG 11 (Sustainable Cities)</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section (6 Cards) */}
      <section id="features" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              Engineered for Real Walkers
            </h3>
            <p className="text-base text-slate-600">
              Six dedicated modules designed specifically for walking tracking, validation, gamification, and carbon accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Navigation className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">GPS Walking Tracker</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time HTML5 Geolocation tracking with live Leaflet map routes, OpenStreetMap tiles, pace monitors, and anti-cheating speed filters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Mobility Credit Wallet</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transparent tokenized wallet crediting 1 Mobility Credit per 100 meters walked, complete with full audit transaction logs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Walking Challenges</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tiered milestones including Beginner Walker (1 km), Daily Explorer (3 km), Green Champion (5 km), and Consistency Hero streaks with bonus credits.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Environmental Impact Dashboard</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select your replaced vehicle before each walk and calculate real-time CO₂ emissions avoided using configurable emission factors.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Reward Redemption</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Redeem earned credits for virtual sustainability badges, café discount vouchers, shopping coupons, and digital certificates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Walking History & Analytics</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comprehensive activity log with session dates, duration, speed, distance, credits, and historical carbon savings.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-emerald-800 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Footprints className="w-3.5 h-3.5" />
            <span>Join the Green Urban Movement</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Ready to Make Every Step Count?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start logging your walking commutes today. Replace motorized vehicle trips, cut carbon pollution, earn mobility credits, and unlock exclusive eco rewards.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate(currentUser ? 'tracker' : 'auth')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Join Walk2Earn Today</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-xs transition-all cursor-pointer"
            >
              View Live Dashboard Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
