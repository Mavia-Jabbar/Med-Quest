import React from 'react';
import { NavLink } from 'react-router';
import { useFirebase } from '@/Context/firebase';
import { siteConfig } from '@/config/site';
import { LayoutDashboard, BookOpen, Activity, Layers, BrainCircuit, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { signOutUser } = useFirebase();

  return (
    <aside className="w-64 border-r border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl hidden md:flex flex-col justify-between shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)] z-20">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/20 dark:border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-blue-500/30">
            {siteConfig.abbreviation.charAt(0)}
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{siteConfig.abbreviation}</span>
        </div>
        
        {/* Menu Navigation */}
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
  );
}
