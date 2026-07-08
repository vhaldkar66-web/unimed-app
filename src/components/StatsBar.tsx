/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, FileText, RotateCcw, BarChart3 } from 'lucide-react';

interface StatsBarProps {
  totalCount: number;
  highYieldCount: number;
  subjectName: string;
  onClearResponses?: () => void;
  showClearResponses?: boolean;
  onOpenAnalytics?: () => void;
}

export default function StatsBar({
  totalCount,
  highYieldCount,
  subjectName,
  onClearResponses,
  showClearResponses,
  onOpenAnalytics,
}: StatsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3.5 shadow-xs transition-colors">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
          <span className="font-bold text-slate-800 dark:text-slate-100 text-base">{totalCount}</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">Questions Found</span>
        </div>
        
        <div className="hidden h-4 w-[1px] bg-slate-200 dark:bg-slate-700 sm:block" />

        <div className="flex items-center gap-2">
          <Star className="h-4.5 w-4.5 fill-amber-500 stroke-amber-600" />
          <span className="font-bold text-amber-600 dark:text-amber-500 text-base">{highYieldCount}</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">High-Yield Questions</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {onOpenAnalytics && (
          <button
            onClick={onOpenAnalytics}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Topic Analytics
          </button>
        )}
        {showClearResponses && onClearResponses && (
          <button
            onClick={onClearResponses}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear Responses
          </button>
        )}
        <div className="rounded-lg bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 text-xs font-bold text-teal-800 dark:text-teal-300 border border-teal-100/50 dark:border-teal-800/50">
          {subjectName}
        </div>
      </div>
    </div>
  );
}
