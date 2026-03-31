import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useFirebase } from "@/Context/firebase";
import { siteConfig } from "@/config/site";
import { navLinks } from "@/config/nav";
import appLogo from "@/assets/logo.jpeg";
import { useVideoTheme } from "@/Context/VideoThemeContext";
import { Menu, X } from "lucide-react";

export const Navbar1 = () => {
  const { isLoggedIn, user, signOutUser } = useFirebase();
  const { videoIndex } = useVideoTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = location.pathname === "/";
  const isLightBg = videoIndex === 0;

  // On home page, adapt text for video background. Elsewhere always use default.
  const textClass = isHome && !isLightBg ? "text-white" : "text-gray-900 dark:text-white";
  const subTextClass = isHome && !isLightBg ? "text-gray-200 hover:text-white" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white";

  // Glass bg adapts to video on home, solid on other pages
  const headerBg = isHome && !isLightBg
    ? "bg-black/30 border-white/10"
    : "bg-white/70 dark:bg-gray-900/70 border-white/40 dark:border-white/10";

  // Close mobile menu on route change
  React.useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className={`w-full backdrop-blur-2xl border-b shadow-sm transition-colors duration-700 ${headerBg}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform border border-black/10 dark:border-white/10">
              <img src={appLogo} alt="MedQuest" className="w-full h-full object-cover" />
            </div>
            <span className={`text-base font-black tracking-tight transition-colors duration-700 ${textClass}`}>
              {siteConfig.abbreviation}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-primary font-semibold" : subTextClass}`
                }
              >
                {link.title}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium ${textClass}`}>{user?.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={signOutUser}
                  className="ml-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className={`text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${textClass}`}
                >
                  Login
                </Link>
                <Link
                  to="/Signup"
                  className="text-sm font-bold px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-105 transition-transform shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden p-2 rounded-xl transition-colors ${isHome && !isLightBg ? "text-white hover:bg-white/10" : "text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"}`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className={`w-full backdrop-blur-2xl border-b px-4 py-4 flex flex-col gap-1 transition-colors duration-700 ${isHome && !isLightBg ? "bg-black/40 border-white/10" : "bg-white/90 dark:bg-gray-900/90 border-white/40 dark:border-white/10"}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `block w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? "bg-primary/10 text-primary" : `${subTextClass} hover:bg-black/5 dark:hover:bg-white/5`}`
              }
            >
              {link.title}
            </NavLink>
          ))}

          <div className="mt-2 pt-3 border-t border-black/5 dark:border-white/10 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium ${textClass}`}>{user?.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={signOutUser}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className={`block w-full px-4 py-3 rounded-xl text-sm font-semibold text-center transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${textClass}`}
                >
                  Login
                </Link>
                <Link
                  to="/Signup"
                  className="block w-full px-4 py-3 rounded-xl text-sm font-bold text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
