/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Star, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { Subject } from '../types';

interface HeroProps {
  subjects: Subject[];
  onSelectSubject: (name: string) => void;
}

export default function Hero({ subjects, onSelectSubject }: HeroProps) {
  // Map subject names to beautiful icon tags
  const getSubjectIcon = (name: string) => {
    if (name.includes('Surgery') || name.includes('Ortho')) return '🔬';
    if (name.includes('Medicine')) return '💊';
    if (name.includes('Obstetrics') || name.includes('Gynaec')) return '🤱';
    if (name.includes('Paediatric')) return '👶';
    return '🩺';
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-12 text-center sm:py-16">
      {/* Live Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/50 bg-teal-50 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-teal-800 shadow-3xs animate-fadeIn">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
        </span>
        Medical PYQ Portal • MPMSU Live
      </div>

      {/* Main Headline */}
      <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl lg:text-5xl lg:leading-[1.1]">
        You didn't come this far to{' '}
        <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
          guess.
        </span>
      </h2>

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base max-w-lg">
        Not NEET PG prep. Not MCQs for ranks. Just the{' '}
        <span className="font-semibold text-slate-800 dark:text-slate-200">real final MBBS questions</span> asked by
        MPMSU University — organized by topic and filtered by frequency.
      </p>

      {/* Senior quote */}
      <p className="mt-3 text-xs italic font-medium text-slate-400">
        "The exam doesn't change as much as you think." — Every Senior, Ever
      </p>

      {/* Stats Cards */}
      <div className="mt-8 flex w-full max-w-md items-center justify-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md divide-x divide-slate-100 dark:divide-slate-800 overflow-hidden">
        <div className="flex-1 py-4.5 px-3">
          <div className="text-xl font-black text-teal-700 dark:text-teal-500">1,200+</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">Questions</div>
        </div>
        <div className="flex-1 py-4.5 px-3">
          <div className="text-xl font-black text-teal-700 dark:text-teal-500">10 Years</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">2015 – 2024</div>
        </div>
        <div className="flex-1 py-4.5 px-3">
          <div className="text-xl font-black text-teal-700 dark:text-teal-500">4 Subjects</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">Final MBBS</div>
        </div>
      </div>

      {/* Subject selectors */}
      <div className="mt-10 w-full max-w-lg">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Start Exploring
        </span>
        <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {subjects.map((subj) => (
            <button
              key={subj.id}
              onClick={() => onSelectSubject(subj.name)}
              className="flex flex-col items-center gap-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-center transition-all duration-250 hover:-translate-y-1 hover:border-teal-500 hover:bg-teal-50/10 dark:hover:bg-teal-900/20 hover:shadow-md active:scale-95 cursor-pointer shadow-xs"
            >
              <span className="text-3xl select-none">{getSubjectIcon(subj.name)}</span>
              <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-400 line-clamp-2">
                {subj.name.split(' & ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="mt-10 flex items-center gap-2 rounded-full border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-slate-400 dark:text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          More subjects & medical universities on the way
        </span>
      </div>
    </div>
  );
}
