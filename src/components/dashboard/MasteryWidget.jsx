import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function MasteryWidget({ analytics }) {
  return (
    <Card className="md:col-span-2 bg-white/60 dark:bg-black/50 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
      <CardHeader className="pb-4 border-b border-black/5 dark:border-white/5 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" /> Subject Mastery
        </CardTitle>
        <div className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">Mock Tests Ave</div>
      </CardHeader>
      <CardContent className="pt-6 grid gap-5">
        {analytics.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-24 text-sm font-bold text-gray-700 dark:text-gray-300">{item.subject}</div>
            <div className="flex-1 bg-black/5 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div className={`h-2.5 rounded-full ${item.color} ${item.glow}`} style={{ width: `${item.score}%` }}></div>
            </div>
            <div className={`w-12 text-right text-sm font-black ${item.score < 60 ? "text-red-500" : item.score > 85 ? "text-emerald-500" : "text-blue-500"}`}>
              {item.score}%
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
