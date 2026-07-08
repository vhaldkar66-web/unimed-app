import React from 'react';

interface FooterProps {
  onOpenPage: (page: 'about' | 'privacy' | 'terms' | 'contact') => void;
}

export default function Footer({ onOpenPage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-sm text-slate-500 dark:text-slate-400 transition-colors">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
        <a href="#about" onClick={(e) => { e.preventDefault(); onOpenPage('about'); }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">About Us</a>
        <a href="#privacy" onClick={(e) => { e.preventDefault(); onOpenPage('privacy'); }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Privacy Policy</a>
        <a href="#terms" onClick={(e) => { e.preventDefault(); onOpenPage('terms'); }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Terms & Conditions</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); onOpenPage('contact'); }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Contact Us</a>
      </div>
      <p>© {currentYear} MPMSU Final Year MBBS PYQs. All rights reserved.</p>
    </footer>
  );
}
