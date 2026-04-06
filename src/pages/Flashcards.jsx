import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Layers, RotateCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useFirebase } from '@/Context/firebase';
import { trackSubjectProgress } from '@/services/progressService';
import { getOrGenerateFlashcards } from '@/services/aiFlashcardService';
import ScienceLoader from '@/components/ui/ScienceLoader';

export default function Flashcards() {
  const { user } = useFirebase();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCards = await getOrGenerateFlashcards(user.uid);
        setCards(fetchedCards);
      } catch (err) {
        console.error("Error loading flashcards:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user?.uid]);

  const handleNext = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 250);
  };

  const handleFlip = () => {
    if (cards.length === 0) return;
    if (!isFlipped && user?.uid) {
      // Track 1 progress point when they view the answer!
      trackSubjectProgress(user.uid, cards[currentIndex].subject, 1);
    }
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 animate-in fade-in duration-700">
        <ScienceLoader text="Synthesizing New Study Deck..." />
        <p className="mt-8 text-gray-500 dark:text-gray-400 font-medium">Generating fresh MDCAT flashcards using Gemini AI. This process might take up to 15 seconds.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
        <div className="max-w-md p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-3xl text-center shadow-sm">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Generation Failed</h2>
           <p className="text-red-600 dark:text-red-400 font-medium mb-6">{error}</p>
           <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">No flashcards available.</div>
    )
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 overflow-y-auto">
      <style>
        {`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .perspective-1000 { perspective: 1000px; }
        `}
      </style>

      <div className="mb-6 text-center animate-in fade-in slide-in-from-top-4 duration-700 mt-auto pt-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <Layers className="text-emerald-500" /> Active Recall
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
          Card {currentIndex + 1} of {cards.length} • <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">{currentCard?.subject}</span>
        </p>
      </div>

      {/* 3D Card Container */}
      <div className="w-full max-w-xl perspective-1000 mb-8 animate-in zoom-in-95 duration-700">
        <div 
          onClick={handleFlip}
          className="relative w-full h-[400px] cursor-pointer transition-transform duration-500 preserve-3d group"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden w-full h-full bg-white/70 dark:bg-black/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-6 sm:p-10 text-center hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-shadow">
            <span className="absolute top-6 right-8 text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Question</span>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-snug break-words">
              {currentCard?.front}
            </h2>
            <div className="absolute bottom-6 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <RotateCw size={16} /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-emerald-50 to-indigo-50 dark:from-emerald-950/30 dark:to-indigo-950/30 backdrop-blur-2xl border border-emerald-500/20 dark:border-emerald-500/10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-6 sm:p-10 text-center"
               style={{ transform: 'rotateY(180deg)' }}>
            <span className="absolute top-6 right-8 text-xs font-bold text-emerald-500 uppercase tracking-widest hidden sm:block">Answer</span>
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed overflow-y-auto max-h-full scrollbar-hide py-2">
              {currentCard?.back}
            </h2>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 animate-in slide-in-from-bottom-8 duration-700 mb-auto pb-6">
        <Button onClick={() => handleNext()} variant="outline" className="h-14 w-14 rounded-full border border-red-200 dark:border-red-900 bg-white/50 dark:bg-black/50 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-500 transition-all shadow-md">
          <XCircle className="w-6 h-6" />
        </Button>
        <Button onClick={handleFlip} className="h-14 px-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:scale-105 transition-transform shadow-xl">
          <RotateCw className="w-5 h-5 mr-2" /> Flip Card
        </Button>
        <Button onClick={() => handleNext()} variant="outline" className="h-14 w-14 rounded-full border border-emerald-200 dark:border-emerald-900 bg-white/50 dark:bg-black/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-emerald-500 transition-all shadow-md">
          <CheckCircle2 className="w-6 h-6" />
        </Button>
      </div>

    </div>
  );
}
