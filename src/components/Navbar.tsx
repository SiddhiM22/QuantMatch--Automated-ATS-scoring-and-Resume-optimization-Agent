import React from 'react';
import { Sun, Moon, Plus, LogOut, Loader2 } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentTab: 'resume' | 'jobs' | 'evaluate' | 'tailor' | 'tracker';
  onSelectTab: (tab: 'resume' | 'jobs' | 'evaluate' | 'tailor' | 'tracker') => void;
  onOpenAddJob: () => void;
  jobCount: number;
  appliedCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSigningIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddJob,
  jobCount,
  appliedCount,
  darkMode,
  onToggleDarkMode,
  user,
  onSignIn,
  onSignOut,
  isSigningIn,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('resume')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap">
              Quant<span className="text-indigo-600 dark:text-indigo-400">Match</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, 4-5 links) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onSelectTab('resume')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-lg ${
              currentTab === 'resume'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            Base Resume
          </button>

          <button
            onClick={() => onSelectTab('jobs')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-lg flex items-center gap-1.5 ${
              currentTab === 'jobs'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>Job Queue</span>
            {jobCount > 0 && (
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                ({jobCount})
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('evaluate')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-lg ${
              currentTab === 'evaluate' || currentTab === 'tailor'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            ATS Evaluation
          </button>

          <button
            onClick={() => onSelectTab('tracker')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 rounded-lg flex items-center gap-1.5 ${
              currentTab === 'tracker'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>Applications</span>
            {appliedCount > 0 && (
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                ({appliedCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Google Auth Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Google OAuth Profile or Sign In Button */}
          {user ? (
            <div className="flex items-center gap-2 p-1 pl-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate hidden sm:inline-block">
                {user.displayName || user.email}
              </span>
              <button
                onClick={onSignOut}
                title="Sign out from Google"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSigningIn ? (
                <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Sign in with Google</span>
            </button>
          )}

          <button
            onClick={onOpenAddJob}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Job</span>
          </button>
        </div>
      </div>
    </header>
  );
};
