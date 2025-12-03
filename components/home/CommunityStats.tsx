"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Star, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1,234",
    label: "Active Members",
    color: "text-gold",
    bgColor: "bg-gold/10",
  },
  {
    icon: Trophy,
    value: "150+",
    label: "Tournaments Won",
    color: "text-gold-light",
    bgColor: "bg-gold-light/10",
  },
  {
    icon: Star,
    value: "5,000+",
    label: "Total XP Earned",
    color: "text-gold-medium",
    bgColor: "bg-gold-medium/10",
  },
  {
    icon: Zap,
    value: "99.9%",
    label: "Uptime",
    color: "text-silver",
    bgColor: "bg-silver/10",
  },
];

export default function CommunityStats() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gold mb-4">
            Community at a Glance
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of gamers who trust Maestros as their home for
            competitive gaming
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-hover group"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
