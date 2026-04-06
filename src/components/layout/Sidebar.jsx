import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';
import { useFirebase } from '@/Context/firebase';
import { siteConfig } from '@/config/site';
import { LayoutDashboard, BookOpen, Activity, Layers, BrainCircuit, LogOut, X } from 'lucide-react';
import appLogo from "@/assets/logo.jpeg";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { signOutUser } = useFirebase();
  const location = useLocation();

  // Close Mobile Menu automatically when a link is clicked
  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside 
        className={`fixed md:relative top-0 left-0 h-full w-64 border-r border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-3xl md:backdrop-blur-xl flex flex-col justify-between shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center gap-3 w-full pl-2">
              <div className="w-9 h-9 shrink-0 rounded-xl overflow-hidden shadow-md shadow-green-500/20 border border-black/5 dark:border-white/10 relative">
                <img src={appLogo} alt="MedQuest" className="w-full h-full object-cover scale-[1.1]" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white truncate">{siteConfig.abbreviation}</span>
            </div>
            
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-black/5 dark:bg-white/10 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
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

      </aside>
    </>
  );
}
