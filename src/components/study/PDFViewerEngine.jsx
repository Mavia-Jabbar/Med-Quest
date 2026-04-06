import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PDFViewerEngine({ url, title, onClose }) {
  if (!url) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Top Control Bar */}
        <div className="h-14 bg-gray-100 dark:bg-black/50 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="font-bold text-gray-900 dark:text-white truncate pr-4">{title}</h2>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
              </a>
            </Button>
            <Button variant="destructive" size="icon" onClick={onClose} className="rounded-full w-8 h-8 opacity-80 hover:opacity-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Native PDF iframe embed */}
        <div className="flex-1 w-full bg-gray-200 dark:bg-black/80">
          <iframe 
            src={`${url}#view=FitH`} 
            title={title}
            className="w-full h-full border-none"
            type="application/pdf"
            loading="lazy"
          >
            <p className="p-8 text-center text-gray-500">Your browser does not support native PDF embedding. <a href={url} className="text-blue-500 hover:underline">Download it here</a>.</p>
          </iframe>
        </div>
      </div>
    </div>
  );

  // Use Portal so the Viewer escapes ALL z-index and overflow contexts from DashboardLayout
  return createPortal(modalContent, document.body);
}
