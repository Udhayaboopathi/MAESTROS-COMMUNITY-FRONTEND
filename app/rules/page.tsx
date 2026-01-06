"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Shield, Sparkles, AlertCircle } from "lucide-react";

interface Rule {
  _id: string;
  title: string;
  category: string;
  rule_content: string;
  active: boolean;
  created_at: string;
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await api.get("/rules");
      const activeRules = (response.data.rules || []).filter(
        (rule: Rule) => rule.active
      );
      setRules(activeRules);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch rules:", err);
      setError("Failed to load rules");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(rules.map((r) => r.category).filter(Boolean))),
  ];

  const filteredRules =
    selectedCategory === "all"
      ? rules
      : rules.filter((r) => r.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold animate-spin" />

            {/* Middle pulsing ring */}
            <div className="absolute inset-3 rounded-full border-2 border-gold/30 animate-pulse" />

            {/* Logo in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Loading..."
                className="w-24 h-24 object-contain animate-pulse"
              />
            </div>

            {/* Inner rotating ring */}
            <div
              className="absolute inset-6 rounded-full border-2 border-transparent border-b-gold-light animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-gold text-xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Loading Rules
            </p>
            <div className="flex justify-center gap-1">
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-gold rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
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
          <button onClick={fetchRules} className="btn-gold">
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
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-semibold">
              Community Guidelines
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              Community Rules
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Please read and follow these rules to maintain a positive and
            respectful environment
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

        {/* Rules List */}
        {filteredRules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center py-20"
          >
            <div className="card-gold max-w-md mx-auto">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gold opacity-50" />
              <p className="text-gray-400 text-lg">
                No rules available yet. Check back soon!
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {filteredRules.map((rule, index) => {
              const rulesList = rule.rule_content
                .split("\n")
                .filter((r) => r.trim() !== "");

              return (
                <motion.div
                  key={rule._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="relative bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal border border-gold/20 rounded-2xl p-8 shadow-2xl hover:shadow-gold-glow/20 transition-all duration-500 group overflow-hidden"
                >
                  {/* Decorative Corner Accents */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-gold opacity-10 rounded-br-full"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-gold opacity-10 rounded-tl-full"></div>

                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Title Section */}
                  <div className="relative flex items-center gap-4 mb-6 pb-6 border-b border-gold/20">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-gold rounded-xl shadow-gold-glow flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-7 h-7 text-black" />
                    </div>
                    <h3 className="text-3xl font-bold text-transparent bg-gradient-gold bg-clip-text group-hover:scale-105 transition-transform duration-300 origin-left">
                      {rule.title}
                    </h3>
                  </div>

                  {/* Rules Content */}
                  <div className="relative space-y-4">
                    {rulesList.map((ruleText, ruleIndex) => (
                      <motion.div
                        key={ruleIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1 * index + 0.1 * ruleIndex,
                        }}
                        className="flex gap-4 items-start group/item"
                      >
                        <div className="flex items-center justify-center min-w-[2.5rem] h-10 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-lg text-gold font-bold text-base flex-shrink-0 group-hover/item:scale-110 group-hover/item:shadow-gold-glow transition-all duration-300">
                          {ruleIndex + 1}
                        </div>
                        <p className="text-gray-200 leading-relaxed flex-1 pt-2 text-justify text-base group-hover/item:text-white transition-colors duration-300">
                          {ruleText}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Important Notice */}
        {rules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 md:mt-24 max-w-4xl mx-auto"
          >
            <div className="card-gold border-gold/30">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-gold flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gold mb-2">
                    Important Notice
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-justify">
                    Violations of these rules may result in warnings, temporary
                    suspension, or permanent removal from the community. If you
                    witness any rule-breaking behavior, please report it to the
                    moderators immediately. Let's work together to keep our
                    community safe and enjoyable for everyone.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
