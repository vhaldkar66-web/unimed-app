import React from 'react';
import { X } from 'lucide-react';

export type InfoPageType = 'about' | 'privacy' | 'terms' | 'contact' | null;

interface InfoModalProps {
  pageType: InfoPageType;
  onClose: () => void;
}

export default function InfoModal({ pageType, onClose }: InfoModalProps) {
  if (!pageType) return null;

  const content = {
    about: {
      title: 'About Us',
      body: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Welcome to the MPMSU Final Year MBBS PYQs portal. Our mission is to help medical students effectively prepare for their final year examinations by providing easy access to Previous Year Questions (PYQs).
          </p>
          <p>
            We organize questions by topic and track their frequency, helping you identify high-yield areas and optimize your study time. 
          </p>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      body: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            We take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information.
          </p>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">1. Information Collection</h3>
          <p>
            We may use local storage to save your preferences, such as theme choice (light/dark mode) and bookmarked questions. This data remains on your device.
          </p>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">2. Third-Party Services</h3>
          <p>
            We use Google AdSense to serve ads. AdSense may use cookies to serve personalized ads based on your visit to our site and other sites on the internet.
          </p>
        </div>
      )
    },
    terms: {
      title: 'Terms and Conditions',
      body: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">1. Use of Content</h3>
          <p>
            The educational content provided on this platform is for study and preparation purposes only. We do not guarantee the accuracy or completeness of the past year questions.
          </p>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">2. Disclaimer</h3>
          <p>
            This website is not officially affiliated with MPMSU. It is a tool created by and for medical students.
          </p>
        </div>
      )
    },
    contact: {
      title: 'Contact Us',
      body: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Have questions, suggestions, or found an error in our database? We'd love to hear from you!
          </p>
          <p>
            You can reach out to us via email at: <strong>vipinhaldkar16@gmail.com</strong>
          </p>
          <p>
            We aim to respond to all inquiries within 48 hours.
          </p>
        </div>
      )
    }
  };

  const { title, body } = content[pageType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {body}
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
