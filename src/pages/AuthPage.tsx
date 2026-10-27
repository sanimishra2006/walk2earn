import React, { useState } from 'react';
import { Footprints, Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { storage } from '../lib/storage';
import { User } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
  onNavigateHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onNavigateHome }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!isLoginMode) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        if (isLoginMode) {
          const res = storage.login(email);
          if (res.success && res.user) {
            onAuthSuccess(res.user);
          } else {
            setErrorMsg(res.error || 'Login failed. Please check your credentials.');
          }
        } else {
          const res = storage.register(fullName.trim(), email);
          if (res.success && res.user) {
            onAuthSuccess(res.user);
          } else {
            setErrorMsg(res.error || 'Registration failed.');
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

  const handleDemoLogin = () => {
    const demoUser = storage.loginAsDemoUser();
    onAuthSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Eco Visual & Pitch (Desktop 5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl" />
          
          <div className="space-y-6 relative z-10">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-white hover:text-emerald-300 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Footprints className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-lg">
                Walk<span className="text-emerald-400">2</span>Earn
              </span>
            </button>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Walk More, Earn More, Live Greener.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your daily steps to verified urban mobility credits, track carbon savings, and unlock sustainable rewards.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100 meters walked = 1 Mobility Credit</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time GPS tracking & anti-cheating</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Trip replacement carbon emission accounting</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700/60 mt-8 relative z-10">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Instant One-Click Demo Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Alex Morgan (preloaded with 5 walks & 125 credits for presentation)
            </p>
          </div>
        </div>

        {/* Right Column: Auth Form (Desktop 7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          {/* Form Header */}
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isLoginMode ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-xs text-slate-500">
              {isLoginMode
                ? 'Sign in to access your mobility wallet and active challenges.'
                : 'Join Walk2Earn and start turning your steps into sustainable credits.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Actual Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Registration only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Registration only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLoginMode ? 'Sign In to Dashboard' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode Toggle */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              {isLoginMode ? "Don't have an account yet?" : 'Already registered?'}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setErrorMsg('');
                }}
                className="ml-1.5 font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                {isLoginMode ? 'Create an account' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Academic Security note */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SQLite bcrypt PBKDF2 hash compatible storage</span>
          </div>

        </div>

      </div>
    </div>
  );
};
