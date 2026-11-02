import React from 'react';
import { ShieldCheck, Sparkles, Globe, Cpu, Lock, Loader2 } from 'lucide-react';

interface AuthLandingPageProps {
  onSignIn: () => void;
  isSigningIn: boolean;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({ onSignIn, isSigningIn }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Top Header Wordmark */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Quant<span className="text-indigo-600 dark:text-indigo-400">Match</span>
          </span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>QuantMatch · Rigorous Quantitative Screening</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.15]">
              Targeted Job Applications, Driven by Mathematical ATS Precision.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              QuantMatch evokes rigorous, quantitative screening and the exactness of weighted 40/30/-30 scoring. Scrape JDs directly from LinkedIn, Naukri, and Indeed, tailor resume bullets line-by-line, and apply with unbreakable confirmation gates.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>40/30/-30 ATS Formula</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  40% Keyword Match, 30% Seniority Scope, -30% Gap Penalties.
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Job URL Scraper</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Scrape any posting from LinkedIn, Naukri, or Indeed in seconds.
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Line-by-Line Tailoring</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Truthful bullet rephrasing with interactive toggles and live diffs.
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Strict Confirmation Gate</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Zero automated submissions without unprompted candidate consent.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Google OAuth Sign-In Card */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-2xs border border-indigo-100 dark:border-indigo-900">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Candidate Sign In
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sign in with your Google account to access your Base Resume, Job Queue, and ATS Evaluation Studio.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={onSignIn}
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                      <span>Signing in with Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-[11px] text-slate-400">
                  <span>Secured via Google Identity Services & OAuth 2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <span>QuantMatch Quantitative ATS Optimization Agent</span>
        </div>
      </footer>
    </div>
  );
};
