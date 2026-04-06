import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from '@/Context/firebase';
import { Bell, Menu, User, Settings, CreditCard, LogOut, SunMoon, HelpCircle } from 'lucide-react';

export default function DashboardHeader({ toggleMenu }) {
  const { userData, user, signOutUser } = useFirebase();
  const userName = userData?.name || "Student";
  const userInitial = userName.charAt(0).toUpperCase();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  const handleSupportClick = () => {
    window.location.href = "mailto:support@medquest.com";
  };

  return (
    <header className="h-16 border-b border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 z-40 flex-shrink-0 w-full gap-2 relative">
      <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-500 hover:text-primary transition-colors hover:bg-black/5 dark:hover:bg-white/10 rounded-xl flex-shrink-0"
        >
          <Menu size={24} />
        </button>

        {/* Global Search safely removed. Contextual search moved to StudyMaterials. */}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 relative">
        <button className="relative text-gray-500 hover:text-primary transition-colors hover:-translate-y-0.5 duration-200 p-2">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <div 
             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             className="flex items-center gap-3 border-l border-gray-300 dark:border-gray-700 pl-3 sm:pl-4 ml-1 sm:ml-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
             <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md ring-2 ring-white dark:ring-black hover:scale-105 transition-transform duration-200">
               {userInitial}
             </div>
             <div className="hidden sm:flex flex-col items-start leading-tight">
               <span className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{userName}</span>
               <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest text-primary">Pre-Med</span>
             </div>
          </div>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
             <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="px-4 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/50">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userName}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{user?.email || "Student Account"}</p>
                </div>
                
                <div className="p-2 flex flex-col gap-1">
                  <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary transition-colors text-left w-full">
                     <SunMoon size={16} /> Toggle Theme
                  </button>
                  <button onClick={handleSupportClick} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary transition-colors text-left w-full">
                     <HelpCircle size={16} /> Help & FAQ
                  </button>
                  <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-400 dark:text-gray-500 cursor-not-allowed text-left w-full relative group">
                     <CreditCard size={16} /> Billing
                     <span className="absolute right-3 bg-gray-200 dark:bg-gray-800 text-[10px] uppercase font-black px-2 py-0.5 rounded-md">SOON</span>
                  </button>
                </div>
                
                <div className="p-2 border-t border-gray-100 dark:border-white/5">
                  <button onClick={signOutUser} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left">
                     <LogOut size={16} /> Sign Out
                  </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </header>
  );
}
