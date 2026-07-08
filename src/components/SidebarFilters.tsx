import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, RefreshCw, Star, HelpCircle, Check, ChevronDown, BookOpen, Filter, Calendar, Tag, BarChart2 } from 'lucide-react';
import { Subject, Topic, FilterState } from '../types';

interface SidebarFiltersProps {
  subjects: Subject[];
  topics: Topic[];
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  totalQuestions: number;
  highYieldQuestions: number;
}

export default function SidebarFilters({
  subjects,
  topics,
  filters,
  onFilterChange,
  onReset,
  isMobileOpen,
  isOpen,
  onClose,
  totalQuestions,
  highYieldQuestions,
}: SidebarFiltersProps) {
  const [topicSearch, setTopicSearch] = useState('');
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const topicDropdownRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const result: number[] = [];
    for (let y = 2010; y <= currentYear; y++) {
      result.push(y);
    }
    return result;
  }, []);

  const filteredTopics = useMemo(() => {
    if (!topicSearch.trim()) return topics;
    return topics.filter((t) =>
      t.name.toLowerCase().includes(topicSearch.toLowerCase())
    );
  }, [topics, topicSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        topicDropdownRef.current &&
        !topicDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTopicDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTopicToggle = (topicId: number) => {
    const current = [...filters.topics];
    if (current.includes(topicId)) {
      onFilterChange('topics', current.filter((id) => id !== topicId));
    } else {
      onFilterChange('topics', [...current, topicId]);
    }
  };

  const handleSelectAllTopics = () => {
    onFilterChange('topics', []);
  };

  const selectedTopicsLabel = useMemo(() => {
    if (filters.topics.length === 0) return '— All Topics —';
    if (filters.topics.length === 1) {
      const topic = topics.find((t) => t.id === filters.topics[0]);
      return topic ? topic.name : '1 Topic Selected';
    }
    return `${filters.topics.length} Topics Selected`;
  }, [filters.topics, topics]);

  const openState = isOpen !== undefined ? isOpen : isMobileOpen;

  return (
    <>
      {openState && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex overflow-hidden h-[100dvh] w-[280px] sm:w-[300px] shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ${
          openState ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between shrink-0 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-5 py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">
              FILTERS
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-6 space-y-8 custom-scrollbar">
          
          

          {/* CLASSIFICATION */}
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <BookOpen className="h-3.5 w-3.5" /> Classification
            </h3>
            <div className="space-y-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 p-4">
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="subjectSelect" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Subject
                </label>
                <select
                  id="subjectSelect"
                  value={filters.subject}
                  onChange={(e) => {
                    onFilterChange('subject', e.target.value);
                    onFilterChange('topics', []);
                  }}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-600 focus:border-teal-500 focus:outline-hidden focus:ring-3 focus:ring-teal-500/10"
                >
                  <option value="">— Select Subject —</option>
                  {subjects.map((subj) => (
                    <option key={subj.id} value={subj.name}>
                      {subj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5" ref={topicDropdownRef}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Topic
                </label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={!filters.subject}
                    onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition shadow-sm ${
                      !filters.subject
                        ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50'
                        : 'cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    } ${isTopicDropdownOpen ? 'border-teal-500 ring-3 ring-teal-500/10' : ''}`}
                  >
                    <span className="truncate pr-4">{selectedTopicsLabel}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isTopicDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isTopicDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 flex max-h-[250px] flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="bg-slate-50/80 dark:bg-slate-900/50 p-2 border-b border-slate-100 dark:border-slate-700 backdrop-blur-sm">
                        <div className="relative">
                          <Search className="absolute top-2 left-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Find topics..."
                            value={topicSearch}
                            onChange={(e) => setTopicSearch(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-1">
                        <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                          <input
                            type="checkbox"
                            checked={filters.topics.length === 0}
                            onChange={handleSelectAllTopics}
                            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span>All Topics</span>
                        </label>
                        {filteredTopics.map((topic) => (
                          <label
                            key={topic.id}
                            className="flex cursor-pointer items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          >
                            <input
                              type="checkbox"
                              checked={filters.topics.includes(topic.id)}
                              onChange={() => handleTopicToggle(topic.id)}
                              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="truncate">{topic.name}</span>
                          </label>
                        ))}
                        {filteredTopics.length === 0 && (
                          <div className="py-4 text-center text-xs text-slate-400">
                            No topics match search
                          </div>
                        )}
                      </div>
                      
                      {filters.topics.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 p-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onFilterChange('topics', []);
                              setIsTopicDropdownOpen(false);
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 hover:text-teal-800 px-2 py-1 bg-teal-50 dark:bg-teal-900/30 rounded-md"
                          >
                            Clear Selection
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* PROPERTIES */}
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <Tag className="h-3.5 w-3.5" /> Properties
            </h3>
            <div className="space-y-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 p-4">
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="typeSelect" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Question Type
                </label>
                <select
                  id="typeSelect"
                  value={filters.type}
                  onChange={(e) => onFilterChange('type', e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-600 focus:border-teal-500 focus:outline-hidden focus:ring-3 focus:ring-teal-500/10"
                >
                  <option value="">All Types</option>
                  <option value="LAQ">LAQ — Long Answer</option>
                  <option value="SAQ">SAQ — Short Answer</option>
                  <option value="VSAQ">VSAQ — Very Short Answer</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Year Range
                </label>
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Year From"
                    value={filters.yearFrom}
                    onChange={(e) => onFilterChange('yearFrom', e.target.value)}
                    className="flex-1 cursor-pointer appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-600 focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="">From</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <span className="text-slate-300 dark:text-slate-600">→</span>
                  <select
                    aria-label="Year To"
                    value={filters.yearTo}
                    onChange={(e) => onFilterChange('yearTo', e.target.value)}
                    className="flex-1 cursor-pointer appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-600 focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="">To</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confidenceSelect" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Confidence
                </label>
                <select
                  id="confidenceSelect"
                  value={filters.confidenceFilter || 'all'}
                  onChange={(e) => onFilterChange('confidenceFilter', e.target.value as any)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-600 focus:border-teal-500 focus:outline-hidden focus:ring-3 focus:ring-teal-500/10"
                >
                  <option value="all">All Ratings</option>
                  <option value="high">High 🤩</option>
                  <option value="medium">Medium 😐</option>
                  <option value="low">Low 😩</option>
                </select>
              </div>

            </div>
          </div>

          {/* HIGH YIELD TOGGLE */}
          <div
            onClick={() => onFilterChange('highYield', !filters.highYield)}
            className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
              filters.highYield
                ? 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 relative z-10">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${
                  filters.highYield ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-500'
                }`}
              >
                <Star className={`h-5 w-5 ${filters.highYield ? 'fill-amber-500 stroke-amber-500' : ''}`} />
              </div>
              <div>
                <div className={`text-sm font-bold transition-colors ${filters.highYield ? 'text-amber-900 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'}`}>High-Yield Only</div>
                <div className={`text-[11px] font-medium leading-none mt-1 transition-colors ${filters.highYield ? 'text-amber-700/70 dark:text-amber-400/70' : 'text-slate-400'}`}>
                  Repeated in exams
                </div>
              </div>
            </div>

            <div className="relative h-6 w-11 flex-shrink-0 z-10">
              <input
                type="checkbox"
                checked={filters.highYield}
                readOnly
                className="sr-only"
              />
              <div
                className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                  filters.highYield ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  filters.highYield ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            
            {/* Subtle background glow effect when active */}
            {filters.highYield && (
              <div className="absolute inset-0 rounded-2xl bg-amber-400/5 blur-xl pointer-events-none" />
            )}
          </div>

        </div>
        
        {/* FOOTER */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0">
          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Reset All Filters
          </button>
        </div>
      </aside>
    </>
  );
}
