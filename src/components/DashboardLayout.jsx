import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import PageTransition from '@/components/layout/PageTransition';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 overflow-hidden font-sans">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <main className="flex-1 flex flex-col relative z-0 w-full overflow-hidden">
        <DashboardHeader toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <div className="flex-1 w-full overflow-hidden relative">
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
