"use client";

import { motion } from "framer-motion";
import { Target, Users, Trophy, Zap, Shield, Heart, Info } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for the highest standards in everything we do",
  },
  {
    icon: Users,
    title: "Community",
    description: "Together we are stronger, supporting each other to succeed",
  },
  {
    icon: Trophy,
    title: "Competition",
    description: "Healthy competition drives us to improve and excel",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Always evolving, always improving our gaming experience",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "Fair play and respect are at the core of our community",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Love for gaming unites and motivates us every day",
  },
];

const achievements = [
  {
    year: "2020",
    title: "Community Founded",
    description: "Started with 50 passionate gamers",
  },
  {
    year: "2021",
    title: "First Tournament",
    description: "Hosted our first major esports event",
  },
  {
    year: "2022",
    title: "1000 Members",
    description: "Reached 1000 active community members",
  },
  {
    year: "2023",
    title: "Regional Champions",
    description: "Won multiple regional championships",
  },
  {
    year: "2024",
    title: "Going Global",
    description: "Expanded to international competitions",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6"
          >
            <Info className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-semibold">About Us</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-4 md:mb-6">
            About Maestros
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            We are more than just a gaming community. We are a family of
            passionate gamers dedicated to excellence, teamwork, and competitive
            spirit.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-20"
        >
          <div className="card-gold max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold mb-4 md:mb-6">
              Our Story
            </h2>
            <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-gray-300">
              <p>
                Founded in 2020, Maestros began as a small group of friends who
                shared a passion for competitive gaming. What started as casual
                gaming sessions quickly evolved into something bigger—a
                community where skill meets camaraderie.
              </p>
              <p>
                Today, we are proud to be one of the most respected gaming
                communities, with members from around the world. Our commitment
                to fostering talent, promoting fair play, and creating
                unforgettable gaming experiences has made us a home for
                thousands of gamers.
              </p>
              <p>
                At Maestros, we believe in the power of community. Whether
                you're a seasoned pro or just starting your gaming journey,
                you'll find your place here.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold text-center mb-8 md:mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold text-center mb-8 md:mb-12">
            Our Journey
          </h2>
          <div className="max-w-3xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 relative"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
                    {achievement.year}
                  </div>
                  {index < achievements.length - 1 && (
                    <div className="w-0.5 h-full bg-gold/30 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-gold mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-400">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
