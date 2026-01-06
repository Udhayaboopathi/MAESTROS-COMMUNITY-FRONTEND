"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Crown, Award, Check } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Player {
  discord_id: string;
  name: string;
  role: string;
  avatar: string | null;
  level: number;
  xp: number;
  badges: string[];
  stats: {
    wins: number;
    kd: number;
  };
}

const benefits = [
  "Access to exclusive tournaments",
  "Premium Discord roles",
  "Priority event registration",
  "Custom badges and rewards",
  "Community recognition",
  "Direct support channel",
];

function AuthHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      localStorage.setItem("auth_token", token);
      window.history.replaceState({}, "", "/");
      window.location.reload();
    } else if (error) {
      console.error("Authentication error:", error);
      alert(`Login failed: ${error}`);
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return null;
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [playersError, setPlayersError] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");

    if (!hasSeenWelcome) {
      setShowWelcome(true);
      sessionStorage.setItem("hasSeenWelcome", "true");
    }
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  useEffect(() => {
    const fetchFeaturedCEOs = async () => {
      try {
        const response = await api.get("/users/featured/ceos");
        const playersData = Array.isArray(response.data)
          ? response.data
          : response.data?.users || response.data?.data || [];

        setPlayers(playersData);
      } catch (err) {
        console.error("Failed to fetch featured CEOs:", err);
        setPlayersError("Failed to load featured players");
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchFeaturedCEOs();
  }, []);

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

          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 container mx-auto px-4">
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm text-gold font-semibold">
                    Elite Gaming Community
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold"
                >
                  <span className="text-gold-glow animate-pulse-gold">
                    MAESTROS COMMUNITY
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto px-4"
                >
                  Join the most prestigious gaming community. Compete, connect,
                  and conquer with the best players worldwide.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Link href="/apply" className="btn-gold group">
                    <span>Apply Now</span>
                    <ArrowRight className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-gold"
                  >
                    Join Discord
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto pt-8 md:pt-12 px-4"
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold">
                      280+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">
                      Members
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold">
                      30+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">
                      Played Games
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold">
                      24/7
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">
                      Active Servers
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-6 h-10 border-2 rounded-full flex justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-gold rounded-full"
                />
              </div>
            </motion.div>
          </section>

          {/* Join CTA Section */}
          <section className="py-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br  via-transparent to-gold/5" />

            <div className="container mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto card-gold text-center"
              >
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-gold mb-4">
                    Ready to Join Our Community?
                  </h2>
                  <p className="text-xl text-gray-300">
                    Become part of the most prestigious gaming community
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-3 text-left"
                    >
                      <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/apply" className="btn-gold group">
                    <span>Apply for Membership</span>
                    <ArrowRight className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-gold"
                  >
                    Join Our Discord
                  </a>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  Applications are reviewed within 24-48 hours
                </p>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
