/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Printer, Bookmark, FileText } from 'lucide-react';
import { Question } from '../types';

interface BookmarksViewProps {
  bookmarkedQuestions: Question[];
  onBookmarkToggle: (id: number) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  onViewPdf?: (url: string | null, text: string) => void;
  isPremium?: boolean;
}

export default function BookmarksView({
  bookmarkedQuestions,
  onBookmarkToggle,
  onClearAll,
  isOpen,
  onClose,
  onViewPdf,
  isPremium = false,
}: BookmarksViewProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    // Open a simple printable window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print.');
      return;
    }

    const questionsHtml = bookmarkedQuestions
      .map(
        (q, idx) => `
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <div style="display: flex; gap: 8px; margin-bottom: 8px; font-size: 11px; font-weight: bold; color: #475569; text-transform: uppercase;">
            <span>Q${idx + 1}</span>
            <span>•</span>
            <span>${q.question_type || 'Question'}</span>
            ${q.marks ? `<span>• ${q.marks} Marks</span>` : ''}
            ${q.topics?.name ? `<span>• ${q.topics.name}</span>` : ''}
          </div>
          <div style="font-size: 15px; color: #1e293b; line-height: 1.6; font-weight: 500; margin-bottom: 8px; white-space: pre-wrap;">
            ${q.question_text}
          </div>
          ${
            (() => {
              const opts = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean) as string[];
              if (opts.length > 0) {
                return `<div style="margin-bottom: 12px; font-size: 14px;">
                  ${opts.map((opt, i) => `<div style="margin-bottom: 4px;"><strong>${String.fromCharCode(65 + i)}.</strong> ${opt}</div>`).join('')}
                 </div>
                 ${q.correct_option ? `<div style="font-size: 13px; color: #0f766e; margin-bottom: 4px;"><strong>Correct Answer:</strong> ${q.correct_option}</div>` : ''}
                 ${q.explanation ? `<div style="font-size: 13px; color: #475569; margin-bottom: 12px;"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
                `;
              }
              return '';
            })()
          }
          ${
            q.appearances?.length
              ? `<div style="font-size: 11px; color: #64748b;">
                  <strong>Appeared:</strong> ${q.appearances
                    .map((a) => `${a.year}${a.session ? ` (${a.session})` : ''}`)
                    .join(', ')}
                 </div>`
              : ''
          }
        </div>
      `
      )
      .join('');

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Saved Exam Questions</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              padding: 40px;
              color: #1e293b;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #0f766e;
              padding-bottom: 16px;
            }
            h1 {
              color: #0f766e;
              font-size: 24px;
              margin: 0 0 6px 0;
            }
            p {
              margin: 0;
              font-size: 13px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>My Medical PYQs Revision Sheet</h1>
            <p>Generated via Medical PYQ Portal on ${new Date().toLocaleDateString()}</p>
          </div>
          ${questionsHtml}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-out drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-350">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 fill-teal-600 stroke-teal-600" />
            <span className="text-base font-black text-slate-800">Saved Questions ({bookmarkedQuestions.length})</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:scale-95 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action controls if items exist */}
        {bookmarkedQuestions.length > 0 && (
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition"
            >
              <Printer className="h-4 w-4" />
              Print Revision Sheet
            </button>
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 transition"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {bookmarkedQuestions.length === 0 ? (
            <div className="flex h-[60%] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300 mb-4">
                <Bookmark className="h-6 w-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">No Saved Questions Yet</h4>
              <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
                Click the bookmark icon on any question card while studying to save it here for offline printing or revision.
              </p>
            </div>
          ) : (
            bookmarkedQuestions.map((q) => (
              <div
                key={q.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/30 p-4 transition duration-150 hover:border-slate-300 hover:bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">
                      {q.question_type} • {q.marks} Marks
                    </span>
                    <button
                      onClick={() => onBookmarkToggle(q.id)}
                      className="text-slate-300 hover:text-red-500 transition"
                      title="Remove from bookmarks"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-700 text-xs font-medium leading-relaxed line-clamp-3 mb-3">
                    {q.question_text}
                  </p>
                  {!(q.question_type === 'Objective' || q.option_a || q.option_b || q.option_c || q.option_d) && (
                    <button
                      onClick={() => {
                        if (onViewPdf) {
                          onViewPdf(q.answer_pdf_url || null, q.question_text);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-teal-600 shadow-sm"
                    >
                      {!isPremium ? (
                        <Lock className="h-3 w-3 text-amber-500" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                      {isPremium ? "View Answer" : "View Answer (Premium)"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
