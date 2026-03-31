import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 font-sans">
      {/* Sidebar: on mobile it's a fixed overlay (width=0 impact), on md+ it's a static column */}
      <div className="hidden md:flex md:w-64 shrink-0 h-full">
        <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      </div>
      {/* Mobile Sidebar as full overlay */}
      <div className="md:hidden">
        <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      </div>

      {/* Main Content - always takes 100% remaining width */}
      <main className="flex-1 flex flex-col w-0 min-w-0 h-full overflow-hidden">
        <DashboardHeader toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <div className="flex-1 overflow-hidden relative w-full h-full">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
