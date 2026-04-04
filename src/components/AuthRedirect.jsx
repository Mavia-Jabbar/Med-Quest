"use client";
import { Navigate, Outlet } from "react-router";
import { useFirebase } from "@/Context/firebase"; // ← adjust path to your context
import ScienceLoader from "@/components/ui/ScienceLoader";

export default function AuthRedirect() {
  const { isLoggedIn, loading } = useFirebase();

  // 1. Still checking auth state (Firebase needs ~200–800 ms on first load / refresh)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
        <ScienceLoader text="Initializing Core Data..." />
      </div>
    );
  }

  // 2. User is already logged in → redirect them away from login/signup
  if (isLoggedIn) {
    return <Navigate to="/Dashboard" replace />;
    // You can also redirect to "/" or "/home" or "/app" — whatever makes sense
  }

  // 3. User is NOT logged in → show the child route (LoginForm or SignupForm)
  return <Outlet />;
}
