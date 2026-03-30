import React from 'react';
import { useFirebase } from '@/Context/firebase';
import { LayoutDashboard, Settings, LogOut, Search, Bell, BookOpen, BrainCircuit, Activity, Layers } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Outlet, NavLink } from 'react-router';

export default function DashboardLayout() {
  const { userData, signOutUser } = useFirebase();
  const userName = userData?.name || "Student";

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
            <NavLink to="/Dashboard" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-background shadow-sm border border-black/5 dark:border-white/5 text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink to="/Materials" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-background shadow-sm border border-black/5 dark:border-white/5 text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <BookOpen size={18} />
              Study Materials
            </NavLink>
            <NavLink to="/MockTests" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-background shadow-sm border border-black/5 dark:border-white/5 text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <Activity size={18} />
              Mock Tests
            </NavLink>
            <NavLink to="/Flashcards" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-background shadow-sm border border-black/5 dark:border-white/5 text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <Layers size={18} />
              Flashcards
            </NavLink>
            <NavLink to="/Tutor" className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-background shadow-sm border border-black/5 dark:border-white/5 text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <BrainCircuit size={18} />
              AI Tutor
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-white/20 dark:border-white/10 space-y-2">
          <button onClick={signOutUser} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 font-medium">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Top Navbar - Glassy */}
        <header className="h-16 border-b border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 z-20 flex-shrink-0">
          <div className="flex items-center relative w-64 group">
            <Search className="absolute left-3 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search MDCAT..." 
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

        {/* Dynamic Outlet for all Sub-pages! */}
        <Outlet />

      </main>
    </div>
  );
}
