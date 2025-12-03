"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "@/components/home/Hero";
import CommunityStats from "@/components/home/CommunityStats";
import FeaturedPlayers from "@/components/home/FeaturedPlayers";
import LatestEvents from "@/components/home/LatestEvents";
import JoinCTA from "@/components/home/JoinCTA";

export default function Home() {
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

  return (
    <div className="min-h-screen">
      <Hero />
      <CommunityStats />
      <FeaturedPlayers />
      <LatestEvents />
      <JoinCTA />
    </div>
  );
}
