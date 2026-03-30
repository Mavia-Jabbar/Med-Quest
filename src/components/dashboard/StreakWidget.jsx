import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import HoverTiltCard from '@/components/ui/HoverTiltCard';

export default function StreakWidget({ currentStreak }) {
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
              <div key={i} className={`flex-1 h-2 rounded-full ${i < 5 ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-black/10 dark:bg-white/10"}`}></div>
            ))}
          </div>
          <p className="text-xs font-medium text-gray-500 mt-3 text-center">You're in the top 10% of active students!</p>
        </CardContent>
      </Card>
    </HoverTiltCard>
  );
}
