"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "Access to exclusive tournaments",
  "Premium Discord roles",
  "Priority event registration",
  "Custom badges and rewards",
  "Community recognition",
  "Direct support channel",
];

export default function JoinCTA() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />

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
              Ready to Join the Elite?
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
  );
}
