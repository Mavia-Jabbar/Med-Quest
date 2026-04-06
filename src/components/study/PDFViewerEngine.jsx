import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/Context/firebase';
import NativePDFViewer from './NativePDFViewer';

// Fallback to Iframe if native load fails or if the URL can't be parsed
function IframeFallback({ url, title, onClose }) {
  const embedUrl = url ? url.replace(/\/view.*/, '/preview') : '';
  return (
    <div className="flex-1 w-full bg-gray-200 dark:bg-black/80">
      <iframe src={embedUrl} title={title} className="w-full h-full border-none" type="application/pdf" allow="autoplay" />
    </div>
  );
}

export default function PDFViewerEngine({ url, title, materialId, onClose }) {
  if (!url) return null;
  const { userData } = useFirebase();

  // Try parsing to direct URL for Native Highlighting. If it utterly fails CORS, we revert to legacy iframe.
  const [useLegacy, setUseLegacy] = useState(false);
  const handleIframeError = () => {
     setUseLegacy(true);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Top Control Bar */}
        <div className="h-14 bg-gray-100 dark:bg-black/50 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 flex-shrink-0 z-50">
          <div className="flex items-center gap-3">
             <h2 className="font-bold text-gray-900 dark:text-white truncate max-w-sm">{title}</h2>
             {!useLegacy && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase rounded">AI Canvas Active</span>}
             {useLegacy && <span className="px-2 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase rounded">Legacy Iframe Mode</span>}
          </div>
          <div className="flex items-center gap-3">
            {!useLegacy && (
               <Button variant="outline" size="sm" onClick={() => setUseLegacy(true)} className="hidden sm:flex rounded-lg border-red-200 text-red-500 hover:bg-red-50">
                 Exit AI Canvas
               </Button>
            )}
            {!useLegacy && (
              <span className="hidden sm:inline-flex items-center text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-white/10 px-3 py-1.5 rounded-lg mr-2">
                Drag cursor to highlight & interact
              </span>
            )}
            <Button variant="destructive" size="icon" onClick={onClose} className="rounded-full w-8 h-8 opacity-80 hover:opacity-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {useLegacy ? (
           <IframeFallback url={url} title={title} onClose={onClose} />
        ) : (
           <NativePDFViewer 
             url={url} 
             title={title} 
             materialId={materialId} 
             userId={userData?.uid} 
             onClose={onClose} 
             onFallback={handleIframeError} 
           />
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
