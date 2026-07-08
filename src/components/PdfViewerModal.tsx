import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, FileText, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  questionText: string;
}

export default function PdfViewerModal({ isOpen, onClose, pdfUrl, questionText }: PdfViewerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>();

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      setContainerWidth(wrapperRef.current.getBoundingClientRect().width);
    }
    const handleResize = () => {
      if (wrapperRef.current) {
        setContainerWidth(wrapperRef.current.getBoundingClientRect().width);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Reset state when opening a new PDF
      setScale(1.0);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:pt-[5vh]">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-5xl h-[85vh] sm:h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 gap-3">
          <div className="flex-1 min-w-0 pr-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {questionText}
            </h3>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
            {/* Controls */}
            {pdfUrl && numPages && (
              <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-700 pr-4">
                {/* Zoom */}
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                    className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium px-2 min-w-[3.5rem] text-center text-slate-700 dark:text-slate-300">
                    {Math.round(scale * 100)}%
                  </span>
                  <button 
                    onClick={() => setScale(s => Math.min(3, s + 0.25))}
                    className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1">
              {pdfUrl && (
                <a 
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div 
          ref={wrapperRef}
          className="flex-1 bg-slate-300 dark:bg-slate-950 relative overflow-auto custom-scrollbar py-6"
        >
          {pdfUrl ? (
            <div className="w-fit min-w-full text-center p-4">
              <div className="inline-block text-left shadow-xl">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-4 text-teal-500" />
                      <p className="text-sm font-medium">Loading PDF...</p>
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center p-12 text-red-500">
                      <FileText className="w-8 h-8 mb-4 opacity-50" />
                      <p className="text-sm font-medium">Failed to load PDF</p>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-6">
                    {numPages && Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                      <div key={`page_${page}`} className="flex justify-center"><Page 
                        
                        pageNumber={page} 
                        scale={scale}
                        width={containerWidth ? Math.min(containerWidth - 32, 800) : undefined}
                        className="bg-white"
                        loading={
                          <div className="w-full h-96 flex items-center justify-center bg-white shadow-xl">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                          </div>
                        }
                        renderAnnotationLayer={false}
                      /></div>
                    ))}
                  </div>
                </Document>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 mb-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                No Answer PDF Available
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                An official answer PDF has not been uploaded for this question yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
