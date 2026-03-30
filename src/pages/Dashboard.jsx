import React from 'react';
import { useFirebase } from '@/Context/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutDashboard, Settings, CreditCard, LogOut, Search, Bell, Flame, BookOpen, BrainCircuit, Activity } from 'lucide-react';
import { siteConfig } from '@/config/site';

const Dashboard = () => {
  const { userData, signOutUser } = useFirebase();
  const userName = userData?.name || "Student";
  const userPlan = userData?.plan || "Free";

  // Mock data for Phase 1
  const currentStreak = 14;
  const analytics = [
    { subject: "Biology", score: 92, color: "bg-emerald-500", glow: "shadow-[0_0_10px_rgba(16,185,129,0.5)]" },
    { subject: "Chemistry", score: 78, color: "bg-blue-500", glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
    { subject: "Physics", score: 45, color: "bg-red-500", glow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 overflow-hidden font-sans">
      
      {/* Sidebar - Apple Glassy UI */}
      <aside className="w-64 border-r border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl hidden md:flex flex-col justify-between shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)] z-20">
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b border-white/20 dark:border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-blue-500/30">
              {siteConfig.abbreviation.charAt(0)}
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{siteConfig.abbreviation}</span>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-background shadow-sm border border-black/5 dark:border-white/5 rounded-xl text-primary font-medium transition-all duration-300">
              <LayoutDashboard size={18} />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all duration-300">
              <BookOpen size={18} />
              Study Materials
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all duration-300">
              <Activity size={18} />
              Mock Tests
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all duration-300">
              <BrainCircuit size={18} />
              AI Tutor
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-white/20 dark:border-white/10 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all duration-300">
            <Settings size={18} />
            Settings
          </a>
          <button onClick={signOutUser} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 font-medium">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Top Navbar - Glassy */}
        <header className="h-16 border-b border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 z-20">
          <div className="flex items-center relative w-64 group">
            <Search className="absolute left-3 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search chapters..." 
              className="w-full bg-black/5 dark:bg-white/10 border border-transparent rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white dark:focus:bg-black focus:border-black/10 dark:focus:border-white/10 focus:ring-4 focus:ring-primary/10 text-gray-900 dark:text-white transition-all duration-300 font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-primary transition-colors hover:-translate-y-0.5 duration-200 p-2">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-300 dark:border-gray-700 pl-4 ml-2 cursor-pointer hover:opacity-80 transition-opacity">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md ring-2 ring-white dark:ring-black">
                 {userName.charAt(0).toUpperCase()}
               </div>
               <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                 {userName}
               </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
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
            <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Take Mock Test</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Review Flashcards</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Ask AI Tutor</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
