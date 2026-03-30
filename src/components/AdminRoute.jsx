import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useFirebase } from '@/Context/firebase';
import ScienceLoader from '@/components/ui/ScienceLoader';

export default function AdminRoute() {
  const { userData, loading } = useFirebase();

  // Wait for firebase metadata to resolve
  if (loading) {
    return (
      <div className="flex flex-1 w-full items-center justify-center min-h-[500px]">
        <ScienceLoader text="Verifying Clearance..." />
      </div>
    );
  }

  // Cryptographic Security check: Only allow access if the database document has 'role: "admin"'
  if (userData?.role !== 'admin') {
    return <Navigate to="/Dashboard" replace />;
  }

  return <Outlet />;
}
