// src/components/ProtectedRoute.jsx   (or wherever you keep components)

import { Navigate, Outlet } from "react-router";
import { useFirebase } from "@/Context/firebase"; // ← your path
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useFirebase();

  // Still checking auth status (very important on first load / refresh)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary size-8" />
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
