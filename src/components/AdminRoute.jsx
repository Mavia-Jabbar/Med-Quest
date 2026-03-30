import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useFirebase } from '@/Context/firebase';
import { Loader2 } from 'lucide-react';

export default function AdminRoute() {
  const { userData, loading } = useFirebase();

  // Wait for firebase metadata to resolve
  if (loading) {
    return (
      <div className="flex flex-1 w-full items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Cryptographic Security check: Only allow access if the database document has 'role: "admin"'
  if (userData?.role !== 'admin') {
    return <Navigate to="/Dashboard" replace />;
  }

  return <Outlet />;
}
