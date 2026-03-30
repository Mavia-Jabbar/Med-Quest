import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layers, RotateCw, CheckCircle2, XCircle } from 'lucide-react';

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cards = [
    { 
      subject: "Biology", 
      front: "What is the powerhouse of the cell?", 
      back: "Mitochondria - site of ATP production via cellular respiration."
    },
    { 
      subject: "Physics", 
      front: "What is Newton's Second Law of Motion?", 
      back: "F = ma (Force equals mass times acceleration)."
    },
    { 
      subject: "Chemistry", 
      front: "What dictates the chemical properties of an atom?", 
      back: "The number and arrangement of valence electrons."
    }
  ];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 250);
  };

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

      <div className="mb-6 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <Layers className="text-emerald-500" /> Active Recall
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
          Card {currentIndex + 1} of {cards.length} • {currentCard.subject}
        </p>
      </div>

      {/* 3D Card Container */}
      <div className="w-full max-w-xl perspective-1000 mb-8 animate-in zoom-in-95 duration-700">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full h-[400px] cursor-pointer transition-transform duration-500 preserve-3d group"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden w-full h-full bg-white/70 dark:bg-black/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-10 text-center hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-shadow">
            <span className="absolute top-6 right-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Question</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-snug">
              {currentCard.front}
            </h2>
            <div className="absolute bottom-6 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <RotateCw size={16} /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-emerald-50 to-indigo-50 dark:from-emerald-950/30 dark:to-indigo-950/30 backdrop-blur-2xl border border-emerald-500/20 dark:border-emerald-500/10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-10 text-center"
               style={{ transform: 'rotateY(180deg)' }}>
            <span className="absolute top-6 right-8 text-xs font-bold text-emerald-500 uppercase tracking-widest">Answer</span>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
              {currentCard.back}
            </h2>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 animate-in slide-in-from-bottom-8 duration-700">
        <Button onClick={() => handleNext()} variant="outline" className="h-14 w-14 rounded-full border border-red-200 dark:border-red-900 bg-white/50 dark:bg-black/50 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-500 transition-all shadow-md">
          <XCircle className="w-6 h-6" />
        </Button>
        <Button onClick={() => setIsFlipped(!isFlipped)} className="h-14 px-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:scale-105 transition-transform shadow-xl">
          <RotateCw className="w-5 h-5 mr-2" /> Flip Card
        </Button>
        <Button onClick={() => handleNext()} variant="outline" className="h-14 w-14 rounded-full border border-emerald-200 dark:border-emerald-900 bg-white/50 dark:bg-black/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-emerald-500 transition-all shadow-md">
          <CheckCircle2 className="w-6 h-6" />
        </Button>
      </div>

    </div>
  );
}
