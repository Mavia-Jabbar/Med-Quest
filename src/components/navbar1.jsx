import React from "react";
import { Link, NavLink } from "react-router";
import { useFirebase } from "@/Context/firebase";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { navLinks } from "@/config/nav";
import appLogo from "@/assets/logo.jpeg";

export const Navbar1 = () => {
  const { isLoggedIn, user, signOutUser } = useFirebase();

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4 md:px-8 w-full transition-all">
      <header className="w-full max-w-6xl rounded-2xl border border-white/40 dark:border-white/10 bg-gray-400/20 dark:bg-gray-800/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="px-5 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform border border-black/5 dark:border-white/10 relative">
              <img src={appLogo} alt="MedQuest" className="w-full h-full object-cover scale-[1.1]" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">{siteConfig.abbreviation}</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.href} 
                to={link.href} 
                className={({isActive}) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary font-semibold" : "text-gray-600 dark:text-gray-300"}`}
              >
                {link.title}
              </NavLink>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
                     {user?.email?.charAt(0)?.toUpperCase()}
                   </div>
                   <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                     {user?.email?.split('@')[0]}
                   </span>
                </div>
                <Button onClick={signOutUser} variant="outline" className="rounded-xl bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/80 transition-all font-medium text-red-500 hover:text-red-600">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-black/50 transition-colors">
                  <Link to="/Login">Login</Link>
                </Button>
                <Button asChild className="rounded-xl bg-gray-900 dark:bg-white dark:text-gray-900 hover:scale-105 transition-transform shadow-md font-medium border-none">
                  <Link to="/Signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
