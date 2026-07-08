/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, Bookmark, Copy, Check, RotateCcw, FileText, Flag, Lock } from 'lucide-react';
import { Question, ConfidenceLevel } from '../types';

interface QuestionCardProps {
  key?: number | string;
  question: Question;
  isBookmarked: boolean;
  onBookmarkToggle: (id: number) => void;
  highYieldThreshold: number;
  mcqResetCounter?: number;
  confidenceLevel?: ConfidenceLevel | null;
  onConfidenceChange?: (level: ConfidenceLevel) => void;
  onViewPdf?: (url: string | null, text: string) => void;
  isPremium?: boolean;
}

export default function QuestionCard({
  question,
  isBookmarked,
  onBookmarkToggle,
  highYieldThreshold,
  mcqResetCounter = 0,
  confidenceLevel = null,
  onConfidenceChange,
  onViewPdf,
  isPremium = false,
}: QuestionCardProps) {
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setShowExplanation(false);
  }, [mcqResetCounter]);

  const isHighYield = (question.appearances?.length || 0) >= highYieldThreshold;
  
  const options = [question.option_a, question.option_b, question.option_c, question.option_d].filter(Boolean) as string[];
  const isObjective = question.question_type === 'Objective' || options.length > 0;

  // Question type color coding
  const typeBadgeClasses = (() => {
    switch (question.question_type) {
      case 'LAQ':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'SAQ':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'VSAQ':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-100';
    }
  })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question.question_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Sort appearances descending by year
  const sortedAppearances = [...(question.appearances || [])].sort((a, b) => b.year - a.year);

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md ${
        isHighYield
          ? 'border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-50/15 dark:from-amber-900/10 via-white dark:via-slate-900 to-white dark:to-slate-900'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {question.question_type && (
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${typeBadgeClasses}`}>
                {question.question_type}
              </span>
            )}
            <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              ID: {question.id}
            </span>
            {question.marks !== null && (
              <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
                {question.marks} Marks
              </span>
            )}
            {isHighYield && (
              <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs">
                <Star className="h-3 w-3 fill-amber-500 stroke-amber-600" />
                High-Yield
              </span>
            )}
            {question.topics?.name && (
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 max-w-[150px] truncate" title={question.topics.name}>
                {question.topics.name}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition duration-150 ml-auto">
            
            {/* Confidence Rating */}
            {onConfidenceChange && (
              <div className="flex items-center gap-0.5 mr-2 bg-slate-50 dark:bg-slate-800 p-0.5 rounded border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => onConfidenceChange(confidenceLevel === 'high' ? null : 'high')}
                  className={`flex h-6 w-6 items-center justify-center rounded text-[13px] transition ${
                    confidenceLevel === 'high' ? 'bg-emerald-100 dark:bg-emerald-900/50 grayscale-0 opacity-100' : 'grayscale opacity-50 hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="High Confidence"
                >
                  🤩
                </button>
                <button
                  onClick={() => onConfidenceChange(confidenceLevel === 'medium' ? null : 'medium')}
                  className={`flex h-6 w-6 items-center justify-center rounded text-[13px] transition ${
                    confidenceLevel === 'medium' ? 'bg-amber-100 dark:bg-amber-900/50 grayscale-0 opacity-100' : 'grayscale opacity-50 hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Medium Confidence"
                >
                  😐
                </button>
                <button
                  onClick={() => onConfidenceChange(confidenceLevel === 'low' ? null : 'low')}
                  className={`flex h-6 w-6 items-center justify-center rounded text-[13px] transition ${
                    confidenceLevel === 'low' ? 'bg-red-100 dark:bg-red-900/50 grayscale-0 opacity-100' : 'grayscale opacity-50 hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Low Confidence"
                >
                  😩
                </button>
              </div>
            )}
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              title="Copy question text"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
            {/* Report Error Button */}
            <a
              href={`mailto:vipinhaldkar16@gmail.com?subject=Error Report: Question ID ${question.id}&body=Hello,%0D%0A%0D%0AI would like to report an error in Question ID ${question.id}.%0D%0A%0D%0AError details:%0D%0A`}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition"
              title="Suggest edits or report an error"
              aria-label="Suggest edits or report an error"
            >
              <Flag className="h-4 w-4" />
            </a>
            {/* Bookmark Button */}
            <button
              onClick={() => onBookmarkToggle(question.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 transition"
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-teal-600 stroke-teal-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <p className="text-slate-800 dark:text-slate-200 text-[14px] sm:text-[15px] font-medium leading-relaxed select-text whitespace-pre-line mb-4 transition-colors break-words">
          {question.question_text}
        </p>

        {/* Objective Options */}
        {isObjective && options.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const optionLetter = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'
              const isCorrect = question.correct_option?.toUpperCase() === optionLetter || question.correct_option === opt;
              const showResult = selectedOption !== null;
              
              let optionClasses = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300";
              if (showResult) {
                if (isCorrect) {
                  optionClasses = "border-emerald-500 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-medium shadow-xs";
                } else if (isSelected && !isCorrect) {
                  optionClasses = "border-red-300 dark:border-red-500/50 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300";
                } else {
                  optionClasses = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 opacity-60";
                }
              }
              return (
                <button
                  key={idx}
                  disabled={showResult}
                  onClick={() => {
                    setSelectedOption(opt);
                    setShowExplanation(true);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border transition-colors text-[14px] break-words flex items-start ${optionClasses}`}
                >
                  <span className="font-semibold mr-2 shrink-0">{String.fromCharCode(65 + idx)}.</span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <div className="mb-4 rounded-lg bg-blue-50/60 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-900/50">
            <h4 className="text-[11px] font-extrabold text-blue-800 dark:text-blue-400 uppercase tracking-wider mb-1.5">Explanation</h4>
            <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line break-words">
              {question.explanation}
            </p>
          </div>
        )}

        {/* View Answer PDF Button (Subjective Only) */}
        <div className="mb-3 mt-2 flex items-center justify-between">
          {!isObjective ? (
            <button
              onClick={() => {
                if (onViewPdf) {
                  onViewPdf(question.answer_pdf_url || null, question.question_text);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400"
            >
              {!isPremium ? (
                <Lock className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              {isPremium ? "View Answer" : "View Answer (Premium)"}
            </button>
          ) : (
            <div></div>
          )}
          
          {/* Clear Response Button */}
          {/* Clear Response Button */}
          {selectedOption !== null && (
            <button
              onClick={() => {
                setSelectedOption(null);
                setShowExplanation(false);
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Response
            </button>
          )}
        </div>
      </div>

      {/* Appearances Timeline */}
      {sortedAppearances.length > 0 && (
        <div className="mt-2 border-t border-slate-100/80 dark:border-slate-800 pt-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1.5">
              Appeared:
            </span>
            {sortedAppearances.map((app, index) => {
              const sessionLabel = app.session ? ` (${app.session})` : '';
              return (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300 shadow-3xs"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 dark:bg-teal-500" />
                  {app.year}
                  {sessionLabel && <span className="text-slate-400 dark:text-slate-500 font-normal">{sessionLabel}</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
