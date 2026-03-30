"use client";
import { Navigate, Outlet } from "react-router";
import { useFirebase } from "@/Context/firebase"; // ← adjust path to your context
import { Loader2 } from "lucide-react";

export default function AuthRedirect() {
  const { isLoggedIn, loading } = useFirebase();

  // 1. Still checking auth state (Firebase needs ~200–800 ms on first load / refresh)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    );
  }

  // 2. User is already logged in → redirect them away from login/signup
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
    // You can also redirect to "/" or "/home" or "/app" — whatever makes sense
  }

  // 3. User is NOT logged in → show the child route (LoginForm or SignupForm)
  return <Outlet />;
}
