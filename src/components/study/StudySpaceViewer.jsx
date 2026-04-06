import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Highlighter, Check, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Tutor from '@/pages/Tutor';

export default function StudySpaceViewer({ material, onClose, user }) {
  if (!material) return null;

  const contentRef = useRef(null);
  const [markdownText, setMarkdownText] = useState(material.content || "# No Content Available\n\nThis material was uploaded without an AI Transcription.");
  const [selectedText, setSelectedText] = useState("");
  const [menuPos, setMenuPos] = useState(null);
  
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiContextQuery, setAiContextQuery] = useState("");

  // Track selection dynamically
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.toString().trim() === "") {
        if (!selectedText) setMenuPos(null); // hide menu safely if no drag happening
        return;
      }
      
      const text = selection.toString().trim();
      setSelectedText(text);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setMenuPos({
        top: rect.top - 50, 
        left: rect.left + (rect.width / 2)
      });
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [selectedText]);

  // Safely close the menu if clicked outside
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (menuPos && !e.target.closest('#study-space-menu')) {
        setMenuPos(null);
        setSelectedText("");
        window.getSelection().removeAllRanges();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [menuPos]);

  // Handle Highlighting specific text permanently during this session by wrapping in bold + specific marker
  const handleHighlight = () => {
    if (!selectedText) return;
    
    // Very simple injection logic: Find exact match in Markdown and wrap it in a custom style string.
    // To make it safe without breaking markdown structures, we can wrap it in double asterisks ** for bold or a safe format.
    // For pure Markdown, we'll wrap it in `==text==` assuming a plugin, or simply `<mark>` if parsing HTML.
    
    // A robust simple method: wrap in `**[HIGHLIGHTED] text**` or similar. 
    // We will just do a standard string replace for demonstration purposes of saving text state dynamically!
    setMarkdownText(prev => prev.replace(selectedText, `**${selectedText}**`));
    
    setMenuPos(null);
    window.getSelection().removeAllRanges();
  };

  const handleAskAI = () => {
    if (!selectedText) return;
    setAiContextQuery(`Explain this concept from my notes to me clearly: "${selectedText}"`);
    setShowAiModal(true);
    setMenuPos(null);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] bg-white dark:bg-[#09090b] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500 overflow-hidden">
      
      {/* Top Reading Control Bar */}
      <div className="h-16 shrink-0 bg-gray-50 dark:bg-black/50 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3 w-3/4">
           <div className={`p-2 rounded-xl text-primary bg-primary/10 shrink-0`}>
              <Sparkles size={18} />
           </div>
           <div>
             <h2 className="font-black text-gray-900 dark:text-white truncate lg:text-lg">{material.title}</h2>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{material.subject}</p>
           </div>
        </div>
        
        <button onClick={onClose} className="p-2 bg-gray-200 dark:bg-white/10 hover:bg-red-500 hover:text-white rounded-full transition-all shrink-0">
          <X size={20} />
        </button>
      </div>

      {/* Main Markdown Surface */}
      <div className="flex-1 w-full overflow-y-auto px-6 py-12 md:px-20 lg:px-44">
        <div className="max-w-4xl mx-auto" ref={contentRef}>
          <div className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-emerald-600 dark:prose-strong:text-emerald-400 max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {markdownText}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Floating Selection Toolbar */}
      {menuPos && (
         <div 
           id="study-space-menu"
           className="fixed flex items-center gap-1.5 p-1.5 bg-gray-900 dark:bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl animate-in zoom-in-95 duration-200 border border-gray-800 dark:border-white/20 z-[99999]"
           style={{ top: menuPos.top, left: menuPos.left, transform: 'translateX(-50%)' }}
         >
           <button onClick={handleHighlight} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 dark:hover:bg-black/5 rounded-xl text-white dark:text-gray-900 font-bold text-sm transition-colors">
              <Highlighter size={16} /> Highlight
           </button>
           <div className="w-px h-6 bg-gray-700 dark:bg-gray-200" />
           <button onClick={handleAskAI} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 dark:hover:bg-black/5 rounded-xl text-primary font-black text-sm transition-colors">
              <MessageSquare size={16} /> Ask AI
           </button>
         </div>
      )}

      {/* Local AI Tutor Overlay triggered by Context Action */}
      {showAiModal && (
        <div className="absolute inset-y-0 right-0 w-full sm:w-[450px] md:w-[500px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-[100000] border-l border-gray-200 dark:border-white/10 animate-in slide-in-from-right duration-300">
           <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/50">
             <div className="flex items-center gap-2">
                <Sparkles className="text-primary w-5 h-5" />
                <h3 className="font-bold text-gray-900 dark:text-white">AI Context Tutor</h3>
             </div>
             <button onClick={() => setShowAiModal(false)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 transition-colors">
                <X size={18} />
             </button>
           </div>
           <div className="flex-1 w-full overflow-hidden relative">
              {/* Reuse Tutor page natively but override padding/backgrounds implicitly using standard wrapper */}
              <Tutor contextualPrompt={aiContextQuery} hideHeader={true} />
           </div>
        </div>
      )}

    </div>
  );

  return createPortal(modalContent, document.body);
}
