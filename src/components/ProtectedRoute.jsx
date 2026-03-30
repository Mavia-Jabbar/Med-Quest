// src/components/ProtectedRoute.jsx   (or wherever you keep components)

import { Navigate, Outlet } from "react-router";
import { useFirebase } from "@/Context/firebase"; // ← your path
import ScienceLoader from "@/components/ui/ScienceLoader";

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useFirebase();

  // Still checking auth status (very important on first load / refresh)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 overflow-hidden w-full">
        <ScienceLoader text="Authenticating Session..." />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → show the protected page(s)
  return <Outlet />;
}
