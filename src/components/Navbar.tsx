import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { FileText, Sparkles, User, LogOut, CheckCircle2, Cloud, Download, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  isSaving: boolean;
  lastSavedText: string;
  onOpenATS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  isSaving,
  lastSavedText,
  onOpenATS,
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs sticky top-0 z-40 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Dashboard Nav Link */}
        <div className="flex items-center gap-4">
          <Link to={user && !user.isGuest ? "/dashboard" : "/"} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
              R
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100">
                ResumeAI
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500 dark:text-slate-400 font-medium border border-slate-200 dark:border-slate-700">
                Professional Builder
              </span>
            </div>
          </Link>

          {user && !user.isGuest && (
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded transition-all border border-slate-200 dark:border-slate-700"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Center: Save Status & AI ATS Trigger */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center text-emerald-700 dark:text-emerald-400 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            {isSaving ? 'Saving to Firebase...' : lastSavedText || 'Saved to Firebase'}
          </div>

          <button
            onClick={onOpenATS}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            AI ATS Scanner
          </button>
        </div>

        {/* Right: Theme Toggle & Auth Profile */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-xs">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-[10px]">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
                {user.isGuest && (
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded font-mono border border-amber-200 dark:border-amber-800">
                    Guest
                  </span>
                )}
              </div>
              <button
                onClick={onLogout}
                className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded shadow-xs flex items-center gap-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              Sign In / Sync
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

