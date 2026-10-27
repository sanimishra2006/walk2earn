import React, { useState } from 'react';
import { Menu, X, Footprints, User as UserIcon, LogOut, Compass } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenProjectGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  onOpenProjectGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar 3-Zone Contract: [Brand wordmark] - [4-5 nav links] - [1 primary action] */}
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand wordmark (single text element) */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 text-left text-slate-900 group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Footprints className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight whitespace-nowrap">
              Walk<span className="text-emerald-600">2</span>Earn
            </span>
          </button>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('landing')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer ${
                currentPage === 'landing' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                if (currentPage !== 'landing') onNavigate('landing');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                if (currentPage !== 'landing') onNavigate('landing');
                setTimeout(() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => handleNav(currentUser ? 'rewards' : 'auth')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer ${
                currentPage === 'rewards' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Rewards
            </button>
            {onOpenProjectGuide && (
              <button
                onClick={onOpenProjectGuide}
                className="hover:text-emerald-700 transition-colors whitespace-nowrap text-slate-500 cursor-pointer flex items-center gap-1.5"
                title="View College Mini-Project Architecture & Viva Notes"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>Project Docs</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action / User Account */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  <span className="truncate max-w-[130px]">{currentUser.fullName}</span>
                </button>
                <button
                  onClick={() => handleNav('tracker')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  Start Walking
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNav('auth')}
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('auth')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => handleNav('landing')}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-emerald-600"
          >
            Home
          </button>
          <button
            onClick={() => {
              if (currentPage !== 'landing') onNavigate('landing');
              setMobileMenuOpen(false);
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-emerald-600"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              if (currentPage !== 'landing') onNavigate('landing');
              setMobileMenuOpen(false);
              setTimeout(() => {
                const el = document.getElementById('features');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-emerald-600"
          >
            Features
          </button>
          <button
            onClick={() => handleNav(currentUser ? 'rewards' : 'auth')}
            className="block w-full text-left py-2 text-base font-medium text-slate-800 hover:text-emerald-600"
          >
            Rewards
          </button>
          {onOpenProjectGuide && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProjectGuide();
              }}
              className="block w-full text-left py-2 text-base font-medium text-emerald-700"
            >
              Project Docs & Viva Notes
            </button>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-slate-100 text-slate-800 font-semibold text-sm"
                >
                  Go to Dashboard ({currentUser.fullName})
                </button>
                <button
                  onClick={() => handleNav('tracker')}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-emerald-600 text-white font-semibold text-sm shadow-sm"
                >
                  Start Walking Tracker
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-rose-600 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('auth')}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-slate-100 text-slate-800 font-semibold text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('auth')}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-emerald-600 text-white font-semibold text-sm shadow-sm"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
