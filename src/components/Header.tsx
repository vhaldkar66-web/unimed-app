/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, GraduationCap, Bookmark, BookOpen, Moon, Sun, User as UserIcon, LogOut, Search, LogIn, Settings } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';


interface HeaderProps {
  onMenuToggle: () => void;
  onBookmarksToggle: () => void;
  bookmarkCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onGoHome?: () => void;
  user: User | null;
  onLoginClick: () => void;
  onProfileClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}


export default function Header({ onMenuToggle, onBookmarksToggle, bookmarkCount, isDark, onToggleTheme, onGoHome, user, onLoginClick, onProfileClick, searchQuery, onSearchChange }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <header className="sticky top-0 z-50 bg-teal-800 dark:bg-slate-900 px-4 py-2 sm:px-6 text-white shadow-md transition-colors">
      <div className="flex h-12 md:h-14 items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onMenuToggle}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition"
            aria-label="Toggle filters"
            id="hamburgerBtn"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 sm:gap-2.5 text-left hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/15 shadow-inner shrink-0">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-extrabold tracking-tight sm:text-lg truncate max-w-[120px] sm:max-w-none">Medical PYQ</h1>
              <p className="hidden text-xs text-teal-100/80 dark:text-slate-400 font-medium sm:block">
                MPMSU Final Year MBBS
              </p>
            </div>
          </button>
        </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-200" />
          <input
            type="text"
            placeholder="Search questions, topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-teal-900/50 dark:bg-slate-800 text-white placeholder-teal-200/70 border border-teal-700 dark:border-slate-700 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700/50 dark:bg-slate-800 hover:bg-teal-700 dark:hover:bg-slate-700 active:scale-95 transition border border-teal-600/30 dark:border-slate-700"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-4.5 w-4.5 text-yellow-300" /> : <Moon className="h-4.5 w-4.5 text-indigo-200" />}
        </button>

        
        <button
          onClick={onBookmarksToggle}
          className="relative flex items-center gap-2 rounded-lg bg-teal-700/50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold tracking-wide hover:bg-teal-700 dark:hover:bg-slate-700 active:scale-95 transition border border-teal-600/30 dark:border-slate-700 h-9"
          aria-label="View Saved Questions"
        >
          <Bookmark className={`h-4 w-4 ${bookmarkCount > 0 ? 'fill-yellow-400 stroke-yellow-400' : ''}`} />
          <span className="hidden sm:inline">Saved Questions</span>
          {bookmarkCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-yellow-400 px-1.5 text-[10px] font-black text-teal-950 animate-pulse">
              {bookmarkCount}
            </span>
          )}
        </button>

        
        {!user ? (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-600 dark:hover:bg-teal-500 px-3 py-1.5 text-xs font-bold tracking-wide transition shadow-sm h-9"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Log In</span>
          </button>
        ) : (

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-teal-700/50 dark:bg-slate-800 border border-teal-600/30 dark:border-slate-700 hover:bg-teal-700 dark:hover:bg-slate-700 active:scale-95 transition overflow-hidden"
              aria-label="User profile"
            >
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-4.5 w-4.5 text-teal-100" />
              )}
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden transform origin-top-right transition-all">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {user.user_metadata?.full_name || 'User Profile'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onProfileClick();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left font-medium mb-1"
                    >
                      <Settings className="h-4 w-4" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      </div>
      {/* Mobile Search Bar */}
      <div className="md:hidden mt-2 mb-1 w-full flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-200" />
          <input
            type="text"
            placeholder="Search questions, topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-teal-900/50 dark:bg-slate-800 text-white placeholder-teal-200/70 border border-teal-700 dark:border-slate-700 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
          />
        </div>
      </div>
    </header>

  );
}
