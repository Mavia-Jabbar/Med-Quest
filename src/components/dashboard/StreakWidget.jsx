import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import HoverTiltCard from '@/components/ui/HoverTiltCard';

const QUOTES = [
  "Every day is a step closer to the white coat. 🩺",
  "Push yourself, because no one else will. ⚡",
  "Discipline bridges the gap between goals and results. 🎯",
  "Pain is temporary, a medical degree is forever. 🧠",
  "The secret to getting ahead is getting started. 🚀",
  "Small daily improvements build massive success. 📈",
  "Fall in love with the process, not just the result. 📖"
];

export default function StreakWidget({ currentStreak }) {
  // Select a deterministic "Quote of the Day" based on the day of the year
  const quote = React.useMemo(() => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  // Limit cells to 7 for visual loop. If streak > 7, it stays maximum filled to reward the user!
  const activeCells = Math.min(currentStreak, 7);

  return (
    <HoverTiltCard>
      <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden group h-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-500/20 transition-all duration-700"></div>
        <CardHeader className="pb-2 border-b border-black/5 dark:border-white/5 relative z-10">
          <CardTitle className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 relative z-10 flex flex-col items-center justify-center">
          <div className="flex items-end gap-3 w-full justify-center">
            <h3 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">{currentStreak}</h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-semibold mb-1">Days</p>
          </div>
          <div className="flex gap-2 w-full mt-5">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-2 rounded-full transition-all duration-700 ${
                  i < activeCells 
                    ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" 
                    : "bg-black/10 dark:bg-white/10"
                }`}
              ></div>
            ))}
          </div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mt-4 text-center px-4 w-full">
            "{quote}"
          </p>
        </CardContent>
      </Card>
    </HoverTiltCard>
  );
}
