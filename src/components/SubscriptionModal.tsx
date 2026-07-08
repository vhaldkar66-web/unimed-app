import React from 'react';
import { X, Lock, Sparkles } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export default function SubscriptionModal({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Premium Feature
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Detailed PDF Explanations are locked. Start your 1-week free trial to unlock all premium features and ace your exams.
          </p>

          <button
            onClick={onSubscribe}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5" />
            Start 1-Week Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
