"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      // Store token
      localStorage.setItem("auth_token", token);
      console.log("✅ Token saved, redirecting to home...");
      // Force full page reload to trigger AuthContext refresh
      window.location.href = "/home";
    } else if (error) {
      console.error("Authentication error:", error);
      alert(`Login failed: ${error}`);
      window.location.href = "/home";
    } else {
      // No token or error, just redirect to home
      router.replace("/home");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-gold animate-pulse">Loading...</div>
    </div>
  );
}

export default function RootPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-gold animate-pulse">Loading...</div>
        </div>
      }
    >
      <AuthHandler />
    </Suspense>
  );
}
