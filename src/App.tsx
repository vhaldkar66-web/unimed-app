/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SidebarFilters from './components/SidebarFilters';
import QuestionCard from './components/QuestionCard';
import StatsBar from './components/StatsBar';
import SkeletonLoader from './components/SkeletonLoader';
import EmptyState from './components/EmptyState';
import Hero from './components/Hero';
import BookmarksView from './components/BookmarksView';
import AnalyticsModal from './components/AnalyticsModal';
import Footer from './components/Footer';
import InfoModal, { InfoPageType } from './components/InfoModal';
import CookieConsent from './components/CookieConsent';
import PdfViewerModal from './components/PdfViewerModal';
import SubscriptionModal from './components/SubscriptionModal';
import ProfileModal from './components/ProfileModal';
import { Subject, Topic, Question, FilterState, ConfidenceLevel } from './types';
import { fetchSubjects, fetchTopics, fetchQuestions, searchGlobalQuestions } from './services/api';
import AuthContainer from './components/AuthContainer';
import { supabase } from './services/supabase';
import type { User } from '@supabase/supabase-js';
import { AlertCircle } from 'lucide-react';

const HIGH_YIELD_THRESHOLD = 2;

const initialFilterState: FilterState = {
  subject: '',
  topics: [],
  type: '',
  yearFrom: '',
  yearTo: '',
  highYield: false,
  searchQuery: '',
  confidenceFilter: 'all',
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Default to false

  const [subjects, setSubjects] = useState<Subject[]>([]);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // Here you would check premium status from your db
      // setIsPremium(true/false) based on user profile
      setIsPremium(false); 
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN') {
        if (window.opener) {
          // If we are in the popup, notify the parent and close
          window.close();
        }
      }
    });

    console.log('Render App:', { subject: filters.subject, searchQuery: filters.searchQuery, qLen: questions.length, fqLen: filteredQuestions.length });
  return () => subscription.unsubscribe();
  }, []);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({ ...initialFilterState, confidenceFilter: 'all' });
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [confidenceRatings, setConfidenceRatings] = useState<Record<number, ConfidenceLevel>>({});
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  });
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [infoPage, setInfoPage] = useState<InfoPageType>(null);
  const [activeTab, setActiveTab] = useState<'subjective' | 'objective'>('subjective');
  const [pdfModalData, setPdfModalData] = useState<{ isOpen: boolean; url: string | null; questionText: string }>({
    isOpen: false,
    url: null,
    questionText: '',
  });
  
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('med_pyq_dark') === 'true';
  });
  
  const [mcqResetCounter, setMcqResetCounter] = useState(0);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load subjects, bookmarks, and settings on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('med_pyq_dark', isDark.toString());
  }, [isDark]);

  useEffect(() => {
    let active = true;
    async function loadInitial() {
      try {
        setLoadingSubjects(true);
        const fetchedSubjects = await fetchSubjects();
        if (active) {
          setSubjects(fetchedSubjects);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to connect to the medical question database.');
        }
      } finally {
        if (active) {
          setLoadingSubjects(false);
        }
      }
    }
    loadInitial();

    // Load bookmarks and confidence ratings
    try {
      const saved = localStorage.getItem('med_pyq_bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
      const savedConfidence = localStorage.getItem('med_pyq_confidence');
      if (savedConfidence) {
        setConfidenceRatings(JSON.parse(savedConfidence));
      }
    } catch (e) {
      console.error('Failed to parse local storage', e);
    }

    return () => {
      active = false;
    };
  }, []);

    const handleConfidenceChange = (questionId: number, level: ConfidenceLevel) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setConfidenceRatings(prev => {
      const next = { ...prev, [questionId]: level };
      if (!level) {
        delete next[questionId];
      }
      localStorage.setItem('med_pyq_confidence', JSON.stringify(next));
      return next;
    });
  };

  
  
  
  const handleSubscribe = () => {
    setIsSubscriptionModalOpen(false);
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      var options = {
        "key": "rzp_test_placeholder", 
        "amount": "99900", 
        "currency": "INR",
        "name": "Medical PYQ Portal",
        "description": "1-Week Free Trial + Premium",
        "handler": function (response: any){
            alert("Subscription successful! You are now premium.");
            setIsPremium(true);
        }
      };
      var rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    }
  };

    const handleViewPdf = async (url: string | null, text: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!url) return;

    if (!isPremium) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    
    try {
      // Extract the file path from the full URL or use it directly if it's a path
      let filePath = url;
      if (url.includes('supabase.co')) {
        const parts = url.split('/');
        filePath = parts[parts.length - 1]; // Just taking the filename for the example
      }
      
      const { data, error } = await supabase
        .storage
        .from('answer-pdfs')
        .createSignedUrl(filePath, 60);
        
      if (error) {
        console.error('Error creating signed URL:', error);
        // Fallback to original url if signed URL generation fails 
        setPdfModalData({ isOpen: true, url: url, questionText: text });
      } else {
        // Open the signed URL in a new tab as requested by user
        window.open(data.signedUrl, '_blank');
      }
    } catch (err) {
      console.error(err);
      setPdfModalData({ isOpen: true, url: url, questionText: text });
    }
  };



  // Set up subject select actions
  
  // Global search effect
  useEffect(() => {
    if (!filters.subject && filters.searchQuery) {

      
      const delay = setTimeout(async () => {
        try {
          setLoadingQuestions(true);
          const res = await searchGlobalQuestions(filters.searchQuery);
          console.log('Global search returned:', res.length, 'questions');
          setQuestions(res);
        } catch (err: any) {
          setError(err.message || 'Failed to search questions globally.');
        } finally {
          setLoadingQuestions(false);
        }
      }, 500);
      
      return () => clearTimeout(delay);
    }
  }, [filters.searchQuery, filters.subject]);

  const handleSubjectSelect = async (subjectName: string) => {
    if (!subjectName) {
      setFilters({ ...initialFilterState, confidenceFilter: 'all' });
      setTopics([]);
      setQuestions([]);
      setError(null);
      return;
    }

    setFilters({
      ...initialFilterState,
      subject: subjectName,
      confidenceFilter: 'all',
    });
    setTopics([]);
    setQuestions([]);
    setError(null);

    const targetSubject = subjects.find((s) => s.name === subjectName);
    if (!targetSubject) {
      setError('Selected subject is not available in the list.');
      return;
    }

    try {
      setLoadingQuestions(true);
      
      // 1. Fetch topics
      const fetchedTopics = await fetchTopics(targetSubject.id);
      setTopics(fetchedTopics);

      // 2. Fetch all questions for these topics
      const topicIds = fetchedTopics.map((t) => t.id);
      if (topicIds.length > 0) {
        const fetchedQuestions = await fetchQuestions(topicIds);
        setQuestions(fetchedQuestions);
      } else {
        setQuestions([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch medical exam questions.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Safe handler to update other filters
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    if (key === 'subject') {
      handleSubjectSelect(value as string);
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  // Reset all filters (return to hero state)
  const handleReset = () => {
    setFilters(initialFilterState);
    setTopics([]);
    setQuestions([]);
    setError(null);
  };

  const handleGoHome = () => {
    handleReset();
    setIsBookmarksOpen(false);
    setIsSidebarOpen(false); // Optionally close sidebar on mobile when going home
  };

  // Toggle bookmark logic
  const handleBookmarkToggle = (id: number) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id];
      localStorage.setItem('med_pyq_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearBookmarks = () => {
    if (window.confirm('Are you sure you want to remove all saved questions?')) {
      setBookmarks([]);
      localStorage.setItem('med_pyq_bookmarks', JSON.stringify([]));
    }
  };

  // Map bookmarked question IDs to real objects
  const bookmarkedQuestionObjects = useMemo(() => {
    // If we have questions loaded, we can map directly
    return questions.filter((q) => bookmarks.includes(q.id));
  }, [questions, bookmarks]);

  // Main client-side filtering logic inside useMemo (highly performant)
  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    // Filter by Tab (Subjective vs Objective)
    // Only apply this filter if we are within a subject. For global search, show everything.
    if (filters.subject) {
      if (activeTab === 'objective') {
        result = result.filter(q => q.question_type === 'Objective' || q.option_a || q.option_b || q.option_c || q.option_d);
      } else {
        result = result.filter(q => q.question_type !== 'Objective' && !q.option_a && !q.option_b && !q.option_c && !q.option_d);
      }
    }

    // Filter by topic IDs
    if (filters.topics.length > 0) {
      result = result.filter((q) => filters.topics.includes(q.topic_id));
    }

    // Filter by type
    if (filters.type) {
      result = result.filter((q) => q.question_type === filters.type);
    }

    // Filter by year range (checks if any appearance is within yearFrom - yearTo range)
    if (filters.yearFrom || filters.yearTo) {
      result = result.filter((q) => {
        if (!q.appearances || q.appearances.length === 0) return false;
        return q.appearances.some((app) => {
          const yearNum = app.year;
          const fromNum = filters.yearFrom ? parseInt(filters.yearFrom, 10) : 0;
          const toNum = filters.yearTo ? parseInt(filters.yearTo, 10) : 9999;
          return yearNum >= fromNum && yearNum <= toNum;
        });
      });
    }

    // Filter high yield
    if (filters.highYield) {
      result = result.filter((q) => (q.appearances?.length || 0) >= HIGH_YIELD_THRESHOLD);
    }

    // Filter by confidence rating
    if (filters.confidenceFilter && filters.confidenceFilter !== 'all') {
      result = result.filter((q) => confidenceRatings[q.id] === filters.confidenceFilter);
    }

    // Filter by keyword search
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((q) => {
        const textMatch = q.question_text?.toLowerCase().includes(query);
        const optionMatch = [q.option_a, q.option_b, q.option_c, q.option_d]
          .filter(Boolean)
          .some(opt => opt?.toLowerCase().includes(query));
        const topicMatch = q.topics?.name?.toLowerCase().includes(query);
        return textMatch || optionMatch || topicMatch;
      });
    }

    // Sort: high-yield first, then by frequency of appearances descending
    return result.sort((a, b) => {
      const aHY = (a.appearances?.length || 0) >= HIGH_YIELD_THRESHOLD ? 1 : 0;
      const bHY = (b.appearances?.length || 0) >= HIGH_YIELD_THRESHOLD ? 1 : 0;
      if (bHY !== aHY) return bHY - aHY;
      return (b.appearances?.length || 0) - (a.appearances?.length || 0);
    });
  }, [questions, filters, confidenceRatings, activeTab]);

  // High-yield total stats
  const highYieldCount = useMemo(() => {
    return filteredQuestions.filter((q) => (q.appearances?.length || 0) >= HIGH_YIELD_THRESHOLD).length;
  }, [filteredQuestions]);

  
  if (authLoading) {
    return <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <>
      <AuthContainer isOpen={!user && isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <div id="main-website-content" className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex flex-col font-sans select-none antialiased transition-colors">


      <Header
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onBookmarksToggle={() => setIsBookmarksOpen(true)}
        bookmarkCount={bookmarks.length}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onGoHome={handleGoHome}
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileModalOpen(true)}
        searchQuery={filters.searchQuery || ''}
        onSearchChange={(q) => handleFilterChange('searchQuery', q)}
      />

      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Sidebar Panel */}
        <SidebarFilters
          subjects={subjects}
          topics={topics}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          totalQuestions={filteredQuestions.length}
          highYieldQuestions={highYieldCount}
        />

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-3xs animate-fadeIn">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="font-semibold">{error}</div>
            </div>
          )}

          {/* Core Content Switching */}
          {loadingQuestions ? (
            <div className="space-y-4">
              <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
              <SkeletonLoader />
            </div>
          ) : (!filters.subject && !filters.searchQuery) ? (
            <Hero subjects={subjects} onSelectSubject={handleSubjectSelect} />
          ) : (
            <>
              {/* Main Subject Header / Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {filters.subject && (
                <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl w-full sm:w-80 shrink-0">
                  <button
                    onClick={() => setActiveTab('subjective')}
                    className={`flex-1 text-[13px] font-semibold py-2 px-3 rounded-lg transition-all ${
                      activeTab === 'subjective'
                        ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Subjective (LAQ/SAQ/VSAQ)
                  </button>
                  <button
                    onClick={() => setActiveTab('objective')}
                    className={`flex-1 text-[13px] font-semibold py-2 px-3 rounded-lg transition-all ${
                      activeTab === 'objective'
                        ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Objective (MCQ)
                  </button>
                </div>
                )}
              </div>

              {/* Stats Bar */}
              <StatsBar
                totalCount={filteredQuestions.length}
                highYieldCount={highYieldCount}
                subjectName={filters.subject || 'Global Search'}
                onClearResponses={() => setMcqResetCounter((prev) => prev + 1)}
                showClearResponses={filteredQuestions.some(
                  (q) =>
                    q.question_type === 'Objective' ||
                    [q.option_a, q.option_b, q.option_c, q.option_d].some(Boolean)
                )}
                onOpenAnalytics={() => setIsAnalyticsOpen(true)}
              />

              {/* Questions Grid */}
              {filteredQuestions.length === 0 ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 animate-fadeIn">
                  {filteredQuestions.map((q, index) => (
                    <React.Fragment key={q.id}>
                      <QuestionCard
                        question={q}
                        isBookmarked={bookmarks.includes(q.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                        highYieldThreshold={HIGH_YIELD_THRESHOLD}
                        mcqResetCounter={mcqResetCounter}
                        confidenceLevel={confidenceRatings[q.id] || null}
                        onConfidenceChange={(level) => handleConfidenceChange(q.id, level)}
                        onViewPdf={handleViewPdf}
                        isPremium={isPremium}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer onOpenPage={setInfoPage} />

      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user} 
      />

      {/* Bookmarks Overlay Modal */}
      <BookmarksView
        bookmarkedQuestions={bookmarkedQuestionObjects}
        onBookmarkToggle={handleBookmarkToggle}
        onClearAll={handleClearBookmarks}
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onViewPdf={handleViewPdf}
        isPremium={isPremium}
      />

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        questions={questions}
        topics={topics}
        subjectName={filters.subject}
      />
      
      {/* Info Pages Modal */}
      <InfoModal 
        pageType={infoPage} 
        onClose={() => setInfoPage(null)} 
      />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)} 
        onSubscribe={handleSubscribe} 
      />

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModalData.isOpen}
        onClose={() => setPdfModalData((prev) => ({ ...prev, isOpen: false }))}
        pdfUrl={pdfModalData.url}
        questionText={pdfModalData.questionText}
      />
    </div>
    </>
  );
}
