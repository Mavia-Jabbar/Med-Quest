import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <DashboardHeader />
        <Outlet />
      </main>
    </div>
  );
}
