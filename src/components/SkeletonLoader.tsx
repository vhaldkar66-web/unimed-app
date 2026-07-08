/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
        >
          <div>
            <div className="flex gap-2 mb-4">
              <div className="h-5 w-14 animate-pulse rounded-full bg-slate-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-[85%] animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-[50%] animate-pulse rounded bg-slate-200" />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3.5 flex gap-1.5 items-center">
            <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
