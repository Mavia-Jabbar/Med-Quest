import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PdfLoader, PdfHighlighter, Highlight, Popup, AreaHighlight } from 'react-pdf-highlighter';
import { X, ExternalLink, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/Context/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { askAITutor } from '@/services/aiTutorService';

// Proxy wrapper strictly for Google Drive bytes bypass
const PROXY_URL = "https://api.allorigins.win/raw?url=";

const getProxiedPdfUrl = (gDriveViewUrl) => {
  const match = gDriveViewUrl.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    const directLink = `https://drive.google.com/uc?export=download&id=${match[1]}`;
    return PROXY_URL + encodeURIComponent(directLink);
  }
  return PROXY_URL + encodeURIComponent(gDriveViewUrl);
};

export default function NativePDFViewer({ url, title, materialId, userId, onClose, onFallback }) {
  const [highlights, setHighlights] = useState([]);
  const [aiExplanation, setAiExplanation] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const pdfUrl = getProxiedPdfUrl(url);

  // Sync Highlights from Firebase
  useEffect(() => {
    if (!userId || !materialId) return;
    const docRef = doc(db, 'users', userId, 'material_highlights', materialId);
    
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setHighlights(snap.data().highlights || []);
      }
    });
    return () => unsubscribe();
  }, [userId, materialId]);

  // Persist Highlights
  const saveHighlights = async (newHighlights) => {
    if (!userId || !materialId) return;
    await setDoc(doc(db, 'users', userId, 'material_highlights', materialId), {
      highlights: newHighlights
    }, { merge: true });
  };

  const addHighlight = (highlight) => {
    const newHighlights = [{ ...highlight, id: String(Math.random()).slice(2) }, ...highlights];
    setHighlights(newHighlights);
    saveHighlights(newHighlights);
  };

  const handleAskAI = async (text) => {
    if (!text) return;
    setIsAiLoading(true);
    setAiExplanation("AI is analyzing this passage...");
    try {
      const response = await askAITutor(userId, `Please clearly explain this passage from a textbook: "${text}"`, [
        { role: "user", parts: [{ text: "Explain this selection." }] }
      ]);
      setAiExplanation(response);
    } catch {
      setAiExplanation("Failed to connect to AI server. Please try again.");
    }
    setIsAiLoading(false);
  };

  return (
    <div className="flex-1 w-full relative bg-gray-100 dark:bg-[#111113]">
      <PdfLoader url={pdfUrl} beforeLoad={<div className="p-8 text-center"><Bot size={48} className="mx-auto animate-pulse text-primary mb-4" />Loading Native AI Canvas over Google Drive Proxy...</div>} onError={() => onFallback()}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event) => event.altKey}
            onScrollChange={() => {}}
            onSelectionFinished={(position, content, hideTipAndSelection, transformSelection) => (
              <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-xl flex gap-2 border border-gray-200 dark:border-white/10 animate-in fade-in zoom-in">
                <Button size="sm" onClick={() => { addHighlight({ content, position, comment: '' }); hideTipAndSelection(); }}>
                   Highlight
                </Button>
                <Button size="sm" variant="default" className="bg-primary hover:bg-primary/90 text-white" onClick={() => { 
                   addHighlight({ content, position, comment: '' }); 
                   handleAskAI(content.text);
                   hideTipAndSelection(); 
                }}>
                   <Bot size={14} className="mr-2" /> Ask AI
                </Button>
              </div>
            )}
            highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => {
              const showPopover = () => setTip(
                <div className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2">
                   <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-2"><Bot size={18} className="text-primary"/> AI Assistant</h4>
                   {aiExplanation ? (
                     <div className="text-sm font-medium text-gray-600 dark:text-gray-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">{aiExplanation}</div>
                   ) : (
                     <Button className="w-full" onClick={() => handleAskAI(highlight.content.text)}>
                       Explain with AI
                     </Button>
                   )}
                </div>
              );

              return (
                <div className="group relative cursor-pointer" onMouseEnter={showPopover} onMouseLeave={hideTip}>
                   <Highlight isScrolledTo={isScrolledTo} position={highlight.position} comment={highlight.comment} />
                </div>
              );
            }}
            highlights={highlights}
          />
        )}
      </PdfLoader>
    </div>
  );
}
