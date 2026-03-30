import React from 'react';
import { Link } from 'react-router';
import { Activity, Layers, BrainCircuit } from 'lucide-react';
import HoverTiltCard from '@/components/ui/HoverTiltCard';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <HoverTiltCard>
        <Link to="/MockTests" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Take Mock Test</span>
        </Link>
      </HoverTiltCard>
      <HoverTiltCard>
        <Link to="/Flashcards" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Review Flashcards</span>
        </Link>
      </HoverTiltCard>
      <HoverTiltCard>
        <Link to="/Tutor" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Ask AI Tutor</span>
        </Link>
      </HoverTiltCard>
    </div>
  );
}
