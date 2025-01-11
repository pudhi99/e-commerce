// src/hooks/useAuth.js
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAdmin = false) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after the session is checked
    if (status !== "loading") {
      if (!session) {
        router.push("/login");
      } else if (requireAdmin && session.user?.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [session, status, requireAdmin, router]);

  return {
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isAdmin: session?.user?.role === "ADMIN",
    user: session?.user,
  };
}
