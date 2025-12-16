"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "@/components/home/Hero";
import CommunityStats from "@/components/home/CommunityStats";
import FeaturedPlayers from "@/components/home/FeaturedPlayers";
import JoinCTA from "@/components/home/JoinCTA";

function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for token in URL (from backend OAuth redirect)
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      // Store token and reload to update auth state
      localStorage.setItem("auth_token", token);
      // Remove token from URL
      window.history.replaceState({}, "", "/");
      // Reload page to trigger auth check
      window.location.reload();
    } else if (error) {
      console.error("Authentication error:", error);
      alert(`Login failed: ${error}`);
      // Remove error from URL
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={null}>
        <AuthHandler />
      </Suspense>
      <Hero />
      <CommunityStats />
      <FeaturedPlayers />
      <JoinCTA />
    </div>
  );
}
