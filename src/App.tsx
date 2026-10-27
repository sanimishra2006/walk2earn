/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Footprints,
  LayoutDashboard,
  Award,
  Sparkles,
  History,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Compass,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Trophy,
} from 'lucide-react';

import { User } from './types';
import { storage } from './lib/storage';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProjectDocsModal } from './components/ProjectDocsModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TrackerPage } from './pages/TrackerPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { RewardsPage } from './pages/RewardsPage';
import { HistoryProfilePage } from './pages/HistoryProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isProjectGuideOpen, setIsProjectGuideOpen] = useState(false);

  // Sync state if user changes or storage updates
  useEffect(() => {
    const user = storage.getCurrentUser();
    if (user && currentPage === 'auth') {
      setCurrentPage('dashboard');
    }
  }, [currentUser, currentPage]);

  useEffect(() => {
    const handleStorageChange = () => {
      const u = storage.getCurrentUser();
      if (u) setCurrentUser(u);
    };
    const unsubscribe = storage.subscribe(handleStorageChange);
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardView =
    currentUser &&
    ['dashboard', 'tracker', 'challenges', 'rewards', 'analytics', 'leaderboard', 'badges', 'history'].includes(
      currentPage
    );

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker', label: 'Start Walking', icon: Footprints },
    { id: 'challenges', label: 'Challenges', icon: Sparkles },
    { id: 'rewards', label: 'Rewards & Wallet', icon: Award },
    { id: 'analytics', label: 'My Analytics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard & Badges', icon: Trophy },
    { id: 'history', label: 'Walking History', icon: History },
  ];


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Public Layout (Landing Page) */}
      {currentPage === 'landing' && (
        <>
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
          />
          <main className="flex-1">
            <LandingPage
              onNavigate={handleNavigate}
              currentUser={currentUser}
              onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
            />
          </main>
          <Footer
            onNavigate={handleNavigate}
            onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
          />
        </>
      )}

      {/* 2. Authentication Page */}
      {currentPage === 'auth' && (
        <main className="flex-1">
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            onNavigateHome={() => handleNavigate('landing')}
          />
        </main>
      )}

      {/* 3. Authenticated Dashboard Layout with Sidebar */}
      {isDashboardView && (
        <div className="flex-1 flex flex-col min-h-screen">
          
          {/* Top Bar for Dashboard */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                {/* Mobile Sidebar Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  aria-label="Toggle navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Brand Logo link */}
                <button
                  onClick={() => handleNavigate('landing')}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-bold tracking-tight hidden sm:inline">
                    Walk<span className="text-emerald-600">2</span>Earn
                  </span>
                </button>

                {/* Breadcrumb Kicker */}
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
                  <span className="capitalize">{currentPage.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Right Zone: Project Docs, Profile, Walk CTA */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsProjectGuideOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="College Project Notes & SQLite Schema"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>College Project Docs</span>
                </button>

                {currentPage !== 'tracker' && (
                  <button
                    onClick={() => handleNavigate('tracker')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>Start Walk</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavigate('history')}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <span className="hidden md:inline truncate max-w-[120px]">
                    {currentUser.fullName}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            
            {/* Desktop Collapsible Sidebar */}
            <aside
              className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out shrink-0 ${
                sidebarCollapsed ? 'w-20' : 'w-64'
              }`}
            >
              <div className="p-4 flex-1 space-y-1">
                {sidebarLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Footer & Collapse Toggle */}
              <div className="p-4 border-t border-slate-100 space-y-2">
                {!sidebarCollapsed && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                    <div className="font-bold text-slate-800">100m = 1 Credit</div>
                    <div className="text-[10px] text-slate-400">Zero vehicle emissions</div>
                  </div>
                )}
                
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <ChevronLeft className="w-4 h-4" />
                      <span>Collapse Sidebar</span>
                    </div>
                  )}
                </button>
              </div>
            </aside>

            {/* Mobile Drawer Sidebar */}
            {mobileSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <div
                  className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
                  onClick={() => setMobileSidebarOpen(false)}
                />
                <div className="relative w-64 max-w-[80vw] bg-white h-full p-4 flex flex-col justify-between shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Footprints className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-slate-900">Walk2Earn Menu</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {sidebarLinks.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-emerald-600" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => {
                        setMobileSidebarOpen(false);
                        setIsProjectGuideOpen(true);
                      }}
                      className="w-full py-2.5 text-xs text-center font-semibold text-emerald-700 bg-emerald-50 rounded-xl"
                    >
                      Project Docs & Viva Notes
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 text-xs text-center text-rose-600 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Viewport */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {currentPage === 'dashboard' && (
                <DashboardPage
                  currentUser={currentUser}
                  onNavigate={handleNavigate}
                  onStartWalk={() => handleNavigate('tracker')}
                />
              )}

              {currentPage === 'tracker' && (
                <TrackerPage
                  currentUser={currentUser}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'challenges' && (
                <ChallengesPage
                  currentUser={currentUser}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'rewards' && (
                <RewardsPage
                  currentUser={currentUser}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'analytics' && (
                <AnalyticsPage
                  currentUser={currentUser}
                  onNavigate={handleNavigate}
                />
              )}

              {(currentPage === 'leaderboard' || currentPage === 'badges') && (
                <LeaderboardPage
                  currentUser={currentUser}
                  onNavigate={handleNavigate}
                  onUpdateUser={(updated) => setCurrentUser(updated)}
                />
              )}

              {currentPage === 'history' && (
                <HistoryProfilePage
                  currentUser={currentUser}
                  onUpdateUser={(updated) => setCurrentUser(updated)}
                  onNavigate={handleNavigate}
                />
              )}
            </main>

          </div>
        </div>
      )}

      {/* College Mini-Project & Architecture Guide Modal */}
      <ProjectDocsModal
        isOpen={isProjectGuideOpen}
        onClose={() => setIsProjectGuideOpen(false)}
      />

    </div>
  );
}
