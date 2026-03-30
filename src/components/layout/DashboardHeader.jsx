import React from 'react';
import { useFirebase } from '@/Context/firebase';
import { Search, Bell, Menu } from 'lucide-react';

export default function DashboardHeader({ toggleMenu }) {
  const { userData } = useFirebase();
  const userName = userData?.name || "Student";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="h-16 border-b border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 z-20 flex-shrink-0 w-full">
      <div className="flex items-center gap-3 w-full max-w-sm">
        {/* Mobile Hamburger Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-primary transition-colors hover:bg-black/5 dark:hover:bg-white/10 rounded-xl"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center relative w-full sm:w-64 group">
          <Search className="absolute left-3 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search MDCAT..." 
            className="w-full bg-black/5 dark:bg-white/10 border border-transparent rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white dark:focus:bg-black focus:border-black/10 dark:focus:border-white/10 focus:ring-4 focus:ring-primary/10 text-gray-900 dark:text-white transition-all duration-300 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <button className="relative text-gray-500 hover:text-primary transition-colors hover:-translate-y-0.5 duration-200 p-2">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-gray-300 dark:border-gray-700 pl-3 sm:pl-4 ml-1 sm:ml-2 cursor-pointer hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md ring-2 ring-white dark:ring-black">
             {userInitial}
           </div>
           <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
             {userName}
           </span>
        </div>
      </div>
    </header>
  );
}
