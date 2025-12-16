"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Users, Zap } from "lucide-react";
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
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show loading screen every time the home page loads
    setShowWelcome(true);

    // Hide welcome screen after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Welcome Loading Screen */}
      <AnimatePresence mode="wait">
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal flex items-center justify-center overflow-hidden"
            style={{ zIndex: 9999999 }}
          >
            {/* Multiple animated background orbs */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.15, 0.35, 0.15],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-light/20 rounded-full blur-3xl"
            />

            <div className="relative z-10">
              <div className="text-center">
                {/* Logo Animation with smooth entrance */}
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotateY: -180 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{
                    duration: 1,
                    ease: [0.34, 1.56, 0.64, 1],
                    delay: 0.1,
                  }}
                  className="mb-8 mx-auto w-44 h-44 relative"
                  style={{ perspective: "1000px" }}
                >
                  {/* Outer spinning ring with smooth rotation */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold"
                  />

                  {/* Middle pulsing ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-3 rounded-full border-2 border-gold/40"
                  />

                  {/* Logo in center with subtle float */}
                  <motion.div
                    animate={{
                      y: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 flex items-center justify-center p-5"
                  >
                    <img
                      src="/logo.png"
                      alt="Maestros Logo"
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </motion.div>

                  {/* Inner rotating ring - counter direction */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-6 rounded-full border-2 border-transparent border-b-gold-light border-l-gold-light"
                  />

                  {/* Glow effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/20 to-gold-light/20 blur-xl"
                  />
                </motion.div>

                {/* Welcome Text with staggered entrance */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.6,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <motion.h1
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent"
                    style={{ backgroundSize: "200% auto" }}
                  >
                    Welcome to Maestros Community
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-gray-400 text-lg mb-8"
                  >
                    Where Champions Rise
                  </motion.p>
                </motion.div>

                {/* Floating Icons with smooth animations */}
                <div className="relative h-20 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -80, scale: 0 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      y: [0, -8, 0],
                    }}
                    transition={{
                      opacity: { delay: 1, duration: 0.6 },
                      x: { delay: 1, duration: 0.6, ease: "easeOut" },
                      scale: { delay: 1, duration: 0.6, ease: "backOut" },
                      y: {
                        delay: 1.6,
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="absolute left-0 top-0"
                  >
                    <Sparkles className="w-8 h-8 text-gold-light drop-shadow-lg" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 80, scale: 0 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      y: [0, -8, 0],
                    }}
                    transition={{
                      opacity: { delay: 1.1, duration: 0.6 },
                      x: { delay: 1.1, duration: 0.6, ease: "easeOut" },
                      scale: { delay: 1.1, duration: 0.6, ease: "backOut" },
                      y: {
                        delay: 1.7,
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="absolute right-0 top-0"
                  >
                    <Users className="w-8 h-8 text-gold-light drop-shadow-lg" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0 }}
                    animate={{
                      opacity: 1,
                      y: [0, -10, 0],
                      scale: 1,
                    }}
                    transition={{
                      opacity: { delay: 1.2, duration: 0.6 },
                      y: {
                        delay: 1.8,
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      scale: { delay: 1.2, duration: 0.6, ease: "backOut" },
                    }}
                    className="absolute left-1/2 -translate-x-1/2 top-10"
                  >
                    <Zap className="w-8 h-8 text-gold drop-shadow-lg" />
                  </motion.div>
                </div>

                {/* Enhanced Loading Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
                  className="w-72 mx-auto"
                >
                  <div className="relative h-2 bg-black-deep/50 rounded-full overflow-hidden backdrop-blur-sm border border-gold/20">
                    <motion.div
                      initial={{ width: "0%", opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      transition={{
                        width: {
                          duration: 4.5, // ⏱️ total loading time
                          ease: "easeInOut",
                        },
                        opacity: {
                          duration: 0.6,
                        },
                      }}
                      className="h-full relative overflow-hidden"
                    >
                      {/* Base gradient bar */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold" />

                      {/* Shimmer effect */}
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          duration: 1.2, // shimmer speed
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </motion.div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                    className="text-xs text-gray-500 text-center mt-3"
                  >
                    Loading experience...
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Suspense fallback={null}>
            <AuthHandler />
          </Suspense>
          <Hero />
          <CommunityStats />
          <FeaturedPlayers />
          <JoinCTA />
        </>
      )}
    </div>
  );
}
