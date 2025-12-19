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
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show loading screen only on first visit (per session)
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");

    if (!hasSeenWelcome) {
      setShowWelcome(true);
      sessionStorage.setItem("hasSeenWelcome", "true");
    }
  }, []);

  useEffect(() => {
    if (showWelcome) {
      // Hide welcome screen after 3 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  return (
    <div className="min-h-screen">
      {/* Welcome Loading Screen - New 3s Animation Style */}
      <AnimatePresence mode="wait">
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
            style={{ zIndex: 9999999 }}
          >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 3,
                  ease: "linear",
                }}
                className="w-full h-full"
                style={{
                  backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              />
            </div>

            {/* Particle Effects */}
            {[...Array(20)].map((_, i) => {
              // Safe window access for SSR
              const windowWidth =
                typeof window !== "undefined" ? window.innerWidth : 1920;
              const windowHeight =
                typeof window !== "undefined" ? window.innerHeight : 1080;

              return (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * windowWidth,
                    y: Math.random() * windowHeight,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    y: [null, Math.random() * windowHeight],
                    x: [null, Math.random() * windowWidth],
                    scale: [0, Math.random() * 1.5 + 0.5, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: Math.random() * 0.5,
                    ease: "easeInOut",
                  }}
                  className="absolute w-2 h-2 bg-gold rounded-full blur-sm"
                />
              );
            })}

            {/* Wave Effect Background */}
            <motion.div
              animate={{
                scale: [1, 2, 3],
                opacity: [0.3, 0.2, 0],
              }}
              transition={{
                duration: 2.5,
                ease: "easeOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-96 h-96 rounded-full border-4 border-gold/30" />
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 2.5, 4],
                opacity: [0.2, 0.15, 0],
              }}
              transition={{
                duration: 2.5,
                delay: 0.3,
                ease: "easeOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-96 h-96 rounded-full border-4 border-gold-light/20" />
            </motion.div>

            <div className="relative z-10">
              <div className="text-center">
                {/* Logo with Circular Ring Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.68, -0.55, 0.265, 1.55],
                  }}
                  className="mb-6 mx-auto w-56 h-56 relative"
                >
                  {/* Outer Spinning Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold"
                  />

                  {/* Middle Ring - Counter Rotation */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-2 rounded-full border-3 border-transparent border-b-gold-light border-l-gold-light"
                  />

                  {/* Inner Pulsing Ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-4 rounded-full border-2 border-gold/50"
                  />

                  {/* Logo with Glitch */}
                  <motion.div
                    animate={{
                      filter: [
                        "hue-rotate(0deg)",
                        "hue-rotate(10deg)",
                        "hue-rotate(0deg)",
                      ],
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: 3,
                      repeatDelay: 0.5,
                    }}
                    className="absolute inset-0 flex items-center justify-center p-6"
                  >
                    <img
                      src="/logo.png"
                      alt="Maestros Logo"
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </motion.div>

                  {/* Glow Pulse */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/30 to-gold-light/30 blur-2xl"
                  />
                </motion.div>

                {/* Text with Typewriter & Glitch Effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.6,
                  }}
                >
                  <motion.h1 className="text-4xl sm:text-5xl font-bold mb-3 relative">
                    <motion.span
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="bg-gradient-to-r from-gold via-white to-gold-light bg-clip-text text-transparent"
                      style={{ backgroundSize: "200% auto" }}
                    >
                      MAESTROS COMMUNITY
                    </motion.span>

                    {/* Glitch overlay */}
                    <motion.span
                      animate={{
                        opacity: [0, 0.7, 0],
                        x: [0, -2, 2, 0],
                      }}
                      transition={{
                        duration: 0.2,
                        repeat: 2,
                        repeatDelay: 0.8,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-gold via-white to-gold-light bg-clip-text text-transparent"
                      style={{
                        backgroundSize: "200% auto",
                        textShadow: "2px 0 #ff00de, -2px 0 #00fff9",
                      }}
                    >
                      MAESTROS COMMUNITY
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                    animate={{ opacity: 1, letterSpacing: "0.2em" }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-gold-light text-sm font-semibold tracking-widest"
                  >
                    WHERE CHAMPIONS RISE
                  </motion.p>
                </motion.div>

                {/* Cyber Loading Bar */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="w-64 mx-auto mt-8"
                >
                  <div className="relative h-1 bg-black-charcoal/50 rounded-full overflow-hidden border border-gold/30">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                      }}
                      className="h-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold" />

                      {/* Scanning effect */}
                      <motion.div
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
                      />
                    </motion.div>
                  </div>

                  {/* Loading percentage */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex justify-between mt-2 text-xs text-gold/60 font-mono"
                  >
                    <span>INITIALIZING</span>
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ///
                    </motion.span>
                  </motion.div>
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
