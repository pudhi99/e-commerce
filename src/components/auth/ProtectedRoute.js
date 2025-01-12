// src/components/auth/ProtectedRoute.js
"use client";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated, isAdmin, user } = useAuth(true);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      {/* You can add a dashboard header or user info here */}
      <div className="absolute top-0 right-0 z-10 mb-4">
        Welcome {user?.name}!
        {isAdmin && <span className="ml-2 text-blue-600">Admin Access</span>}
      </div>
      {children}
    </div>
  );
}
