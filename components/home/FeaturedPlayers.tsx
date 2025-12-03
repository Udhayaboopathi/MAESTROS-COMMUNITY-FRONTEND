"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Crown, Award, Star } from "lucide-react";

const players = [
  {
    name: "ProGamer123",
    role: "Top Ranked Player",
    avatar: "/avatars/player1.png",
    level: 50,
    badges: ["Champion", "MVP", "Legend"],
    stats: { wins: 234, kd: 3.5 },
  },
  {
    name: "EliteSniper",
    role: "Event Champion",
    avatar: "/avatars/player2.png",
    level: 48,
    badges: ["Champion", "Sharpshooter"],
    stats: { wins: 198, kd: 4.2 },
  },
  {
    name: "StrategyMaster",
    role: "Team Captain",
    avatar: "/avatars/player3.png",
    level: 45,
    badges: ["Leader", "Tactician"],
    stats: { wins: 176, kd: 3.1 },
  },
];

export default function FeaturedPlayers() {
  return (
    <section className="py-20 px-4 bg-black-charcoal/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-gold" />
            <h2 className="text-4xl font-bold text-gold">Featured Players</h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Meet our top performers who set the standard for excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {players.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card-hover group"
            >
              <div className="relative mb-4">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-gold bg-steel overflow-hidden">
                  <div className="w-full h-full bg-gradient-gold opacity-20" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {player.level}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">
                  {player.name}
                </h3>
                <p className="text-gold text-sm mb-4">{player.role}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {player.badges.map((badge, idx) => (
                    <span key={idx} className="badge-gold text-xs">
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-steel">
                  <div>
                    <div className="text-2xl font-bold text-gold">
                      {player.stats.wins}
                    </div>
                    <div className="text-xs text-gray-400">Wins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gold">
                      {player.stats.kd}
                    </div>
                    <div className="text-xs text-gray-400">K/D Ratio</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
