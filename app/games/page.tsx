"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import LoadingScreen from "@/components/common/LoadingScreen";
import {
  Gamepad2,
  Monitor,
  Sparkles,
  Trophy,
  Users,
  Smartphone,
} from "lucide-react";

interface Game {
  _id: string;
  name: string;
  description: string;
  image_url?: string;
  category?: string;
  platform?: string;
  clan?: string;
  active: boolean;
  created_at: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await api.get("/games");
      setGames(response.data.games || []);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch games:", err);
      setError("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(games.map((g) => g.category).filter(Boolean))),
  ];
  const filteredGames =
    selectedCategory === "all"
      ? games
      : games.filter((g) => g.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen message="Loading Games..." fullScreen={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button onClick={fetchGames} className="btn-gold">
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-semibold">
              Our Gaming Arsenal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              Games We Master
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            From competitive esports to casual fun, discover the games that
            define our community
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category ?? "all")}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-gold text-black shadow-gold-glow"
                    : "bg-black-charcoal border border-steel text-gray-400 hover:border-gold/50 hover:text-gold"
                }`}
              >
                {(category ?? "All").charAt(0).toUpperCase() +
                  (category ?? "All").slice(1)}
              </button>
            ))}
          </motion.div>
        )}

        {/* Games Grid */}
        {filteredGames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center py-20"
          >
            <div className="card-gold max-w-md mx-auto">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gold opacity-50" />
              <p className="text-gray-400 text-lg">
                No games available yet. Check back soon!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredGames.map((game, index) => (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="relative h-[420px] rounded-xl overflow-hidden">
                  {/* Background Image */}
                  {game.image_url ? (
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-black-deep to-black-charcoal flex items-center justify-center">
                      <Gamepad2 className="w-24 h-24 text-gold/30" />
                    </div>
                  )}

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent group-hover:from-gold/20 transition-all duration-500" />

                  {/* Content Container */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top Section - Category & Clan */}
                    <div className="flex items-start justify-between gap-2">
                      {game.category && (
                        <motion.span
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-gold/30 text-gold text-xs font-bold rounded-full"
                        >
                          {game.category}
                        </motion.span>
                      )}
                      {game.clan && (
                        <motion.span
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="px-3 py-1.5 bg-gold/90 text-black text-xs font-bold rounded-full backdrop-blur-sm"
                        >
                          {game.clan}
                        </motion.span>
                      )}
                    </div>

                    {/* Bottom Section - Game Info */}
                    <div className="space-y-3">
                      {/* Game Title */}
                      <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-3xl font-bold text-white group-hover:text-gold transition-colors duration-300 leading-tight"
                      >
                        {game.name}
                      </motion.h3>

                      {/* Description */}
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-gray-300 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300"
                      >
                        {game.description}
                      </motion.p>

                      {/* Platform Tag */}
                      {game.platform && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center gap-2 pt-2 border-t border-gold/30"
                        >
                          <div className="p-1.5 bg-gold/10 rounded">
                            {game.platform === "Mobile" && (
                              <Smartphone className="w-4 h-4 text-gold" />
                            )}
                            {game.platform === "PC" && (
                              <Monitor className="w-4 h-4 text-gold" />
                            )}
                            {game.platform === "Console" && (
                              <Gamepad2 className="w-4 h-4 text-gold" />
                            )}
                          </div>
                          <span className="text-sm text-gray-300 font-medium">
                            {game.platform}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 rounded-xl transition-all duration-300" />

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Section */}
        {games.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 md:mt-24"
          >
            <div className="card-gold">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-gold mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-gold mb-2">
                    {games.length}
                  </div>
                  <div className="text-gray-400">Games Available</div>
                </div>
                <div className="text-center">
                  <Gamepad2 className="w-12 h-12 text-gold mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-gold mb-2">
                    {new Set(games.map((g) => g.category).filter(Boolean)).size}
                  </div>
                  <div className="text-gray-400">Categories</div>
                </div>
                <div className="text-center">
                  <Monitor className="w-12 h-12 text-gold mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-gold mb-2">
                    {new Set(games.map((g) => g.platform).filter(Boolean)).size}
                  </div>
                  <div className="text-gray-400">Platforms</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
