import React, { useMemo } from 'react';
import { X, BarChart3, TrendingUp } from 'lucide-react';
import { Question, Topic } from '../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  topics: Topic[];
  subjectName: string;
}

export default function AnalyticsModal({ isOpen, onClose, questions, topics, subjectName }: AnalyticsModalProps) {
  const topicStats = useMemo(() => {
    const stats: Record<number, { name: string; count: number; appearances: number }> = {};
    
    topics.forEach(t => {
      stats[t.id] = { name: t.name, count: 0, appearances: 0 };
    });

    questions.forEach(q => {
      if (stats[q.topic_id]) {
        stats[q.topic_id].count += 1;
        stats[q.topic_id].appearances += (q.appearances?.length || 0);
      }
    });

    return Object.values(stats)
      .filter(s => s.count > 0)
      .sort((a, b) => b.appearances - a.appearances);
  }, [questions, topics]);

  if (!isOpen) return null;

  const maxAppearances = Math.max(...topicStats.map(s => s.appearances), 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-teal-950/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
              <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Topic Weightage</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{subjectName} Analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            {topicStats.length === 0 ? (
              <div className="text-center text-slate-500 py-10">
                No data available to analyze.
              </div>
            ) : (
              topicStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end gap-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{stat.name}</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.appearances} {stat.appearances === 1 ? 'time' : 'times'} asked
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(stat.appearances / maxAppearances) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
