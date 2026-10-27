import React from 'react';
import { Footprints, Heart, Shield, Globe, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenProjectGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenProjectGuide }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Walk<span className="text-emerald-400">2</span>Earn
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every Step Counts. Walk More, Earn More, Live Greener. A smart walking reward system promoting sustainable urban mobility and active pedestrian transit.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Developed as a 2–3 Month Academic Mini-Project in Sustainable Mobility.
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  User Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracker')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  GPS Walking Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('challenges')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Walking Challenges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rewards')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Reward Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Methodology */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Research</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Haversine GPS Formula</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Speed & Jitter Validation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Trip Emission Factors</span>
              </li>
              {onOpenProjectGuide && (
                <li>
                  <button
                    onClick={onOpenProjectGuide}
                    className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                  >
                    College Viva & Architecture Notes →
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Disclaimer & Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Academic Project</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coupons and rewards featured on Walk2Earn are simulated academic demonstrations without real monetary value. No commercial or municipal partnership is implied.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>support@walk2earn-project.edu</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Walk2Earn Urban Mobility. Released for academic evaluation and sustainable transport promotion.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for sustainable cities</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 inline fill-emerald-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
