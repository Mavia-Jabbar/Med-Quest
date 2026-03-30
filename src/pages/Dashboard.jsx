import React from 'react';
import { useFirebase } from '@/Context/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, BookOpen, BrainCircuit, Activity, Layers } from 'lucide-react';
import { Link } from 'react-router';

const Dashboard = () => {
  const { userData } = useFirebase();
  const userName = userData?.name || "Student";
  
  // Mock data for Phase 1
  const currentStreak = 14;
  const analytics = [
    { subject: "Biology", score: 92, color: "bg-emerald-500", glow: "shadow-[0_0_10px_rgba(16,185,129,0.5)]" },
    { subject: "Chemistry", score: 78, color: "bg-blue-500", glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
    { subject: "Physics", score: 45, color: "bg-red-500", glow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      
      {/* Animated Greeting Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Ready to study, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{userName}</span>? 🩺
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
            Here's a breakdown of your current MDCAT preparation.
          </p>
        </div>
        {/* Mobile-only streak badge */}
        <div className="md:hidden flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-500/20">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{currentStreak}</span>
        </div>
      </div>

      {/* Core Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Gamification Streak Widget */}
        <Card className="bg-white/60 dark:bg-black/50 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-500/20 transition-all duration-700"></div>
          <CardHeader className="pb-2 border-b border-black/5 dark:border-white/5 relative z-10">
            <CardTitle className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" /> Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 relative z-10">
            <div className="flex items-end gap-3">
              <h3 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">{currentStreak}</h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-semibold mb-1">Days</p>
            </div>
            {/* Visual Mini Gamification Calendar */}
            <div className="flex gap-2 mt-5">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i < 5 ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-black/10 dark:bg-white/10"}`}></div>
              ))}
            </div>
            <p className="text-xs font-medium text-gray-500 mt-3 text-center">You're in the top 10% of active students!</p>
          </CardContent>
        </Card>

        {/* Weakness Analytics Widget */}
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
      </div>

      {/* Quick Actions Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
      </div>

      {/* Quick Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/MockTests" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Take Mock Test</span>
        </Link>
        <Link to="/Flashcards" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Review Flashcards</span>
        </Link>
        <Link to="/Tutor" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">Ask AI Tutor</span>
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;
