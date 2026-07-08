/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SearchSlash, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-3xs max-w-lg mx-auto mt-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
        <SearchSlash className="h-6 w-6 stroke-[1.8]" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1.5">No Questions Found</h3>
      <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mb-6">
        No questions match the current combination of filters. Try clearing some filters, widening the year range, or disabling High-Yield mode.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 active:scale-95 px-4 py-2 text-xs font-bold text-white shadow-xs transition duration-150"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Reset Current Filters
      </button>
    </div>
  );
}
