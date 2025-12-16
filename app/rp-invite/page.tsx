"use client";

import { motion } from "framer-motion";
import { Gamepad2, Send, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function RpInvitePage() {
  const [rpFormData, setRpFormData] = useState({
    serverName: "",
    ownerName: "",
    discordId: "",
    serverDescription: "",
    playerCount: "",
    serverIP: "",
    additionalInfo: "",
  });
  const [isRpSubmitting, setIsRpSubmitting] = useState(false);
  const [rpSubmitStatus, setRpSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleRpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRpSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/discord/send-invite-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            server_name: rpFormData.serverName,
            owner_name: rpFormData.ownerName,
            discord_id: rpFormData.discordId,
            server_description: rpFormData.serverDescription,
            player_count: rpFormData.playerCount,
            server_ip: rpFormData.serverIP,
            additional_info: rpFormData.additionalInfo,
          }),
        }
      );

      if (response.ok) {
        setIsRpSubmitting(false);
        setRpSubmitStatus("success");
        setRpFormData({
          serverName: "",
          ownerName: "",
          discordId: "",
          serverDescription: "",
          playerCount: "",
          serverIP: "",
          additionalInfo: "",
        });
        setTimeout(() => setRpSubmitStatus("idle"), 5000);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      setIsRpSubmitting(false);
      setRpSubmitStatus("error");
      setTimeout(() => setRpSubmitStatus("idle"), 5000);
    }
  };

  const handleRpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRpFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-black-deep relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-light/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Back Button */}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6"
          >
            <Gamepad2 className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-semibold">
              RP Server Partnership
            </span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-white">
            Join Our{" "}
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Gaming Network
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Get your RP server featured in our community and reach thousands of
            gamers
          </p>
        </motion.div>

        {/* Benefits Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              title: "Increased Visibility",
              description: "Reach thousands of active players",
              icon: "🌟",
            },
            {
              title: "Community Support",
              description: "Get featured in our Discord server",
              icon: "🤝",
            },
            {
              title: "Promotional Help",
              description: "Professional showcase & promotion",
              icon: "📢",
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-black-charcoal/50 backdrop-blur-sm rounded-xl p-6 border border-gold/10 hover:border-gold/40 transition-all"
            >
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* RP Server Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-black-charcoal/70 backdrop-blur-md rounded-2xl border border-gold/20 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gold/20 via-gold-light/10 to-transparent px-8 py-6 border-b border-gold/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Gamepad2 className="w-7 h-7 text-black-deep" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Submit Your Server
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Fill out the form below to get your server featured
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleRpSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Server Name */}
                  <div>
                    <label
                      htmlFor="serverName"
                      className="block text-sm font-semibold text-gold-light mb-2"
                    >
                      Server Name *
                    </label>
                    <input
                      type="text"
                      id="serverName"
                      name="serverName"
                      value={rpFormData.serverName}
                      onChange={handleRpChange}
                      required
                      className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                      placeholder="My RP Server"
                    />
                  </div>

                  {/* Owner Name */}
                  <div>
                    <label
                      htmlFor="ownerName"
                      className="block text-sm font-semibold text-gold-light mb-2"
                    >
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={rpFormData.ownerName}
                      onChange={handleRpChange}
                      required
                      className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Discord ID */}
                  <div>
                    <label
                      htmlFor="discordId"
                      className="block text-sm font-semibold text-gold-light mb-2"
                    >
                      Discord ID *
                    </label>
                    <input
                      type="text"
                      id="discordId"
                      name="discordId"
                      value={rpFormData.discordId}
                      onChange={handleRpChange}
                      required
                      className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                      placeholder="123456789012345678"
                    />
                  </div>

                  {/* Player Count */}
                  <div>
                    <label
                      htmlFor="playerCount"
                      className="block text-sm font-semibold text-gold-light mb-2"
                    >
                      Player Count
                    </label>
                    <input
                      type="text"
                      id="playerCount"
                      name="playerCount"
                      value={rpFormData.playerCount}
                      onChange={handleRpChange}
                      className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                      placeholder="32/64"
                    />
                  </div>
                </div>

                {/* Server IP */}
                <div>
                  <label
                    htmlFor="serverIP"
                    className="block text-sm font-semibold text-gold-light mb-2"
                  >
                    Server IP/Connect Link
                  </label>
                  <input
                    type="text"
                    id="serverIP"
                    name="serverIP"
                    value={rpFormData.serverIP}
                    onChange={handleRpChange}
                    className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                    placeholder="connect cfx.re/join/abc123"
                  />
                </div>

                {/* Server Description */}
                <div>
                  <label
                    htmlFor="serverDescription"
                    className="block text-sm font-semibold text-gold-light mb-2"
                  >
                    Server Description *
                  </label>
                  <textarea
                    id="serverDescription"
                    name="serverDescription"
                    value={rpFormData.serverDescription}
                    onChange={handleRpChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                    placeholder="Tell us about your server..."
                  />
                </div>

                {/* Additional Info */}
                <div>
                  <label
                    htmlFor="additionalInfo"
                    className="block text-sm font-semibold text-gold-light mb-2"
                  >
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={rpFormData.additionalInfo}
                    onChange={handleRpChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                    placeholder="Anything else we should know..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isRpSubmitting}
                  className="w-full px-6 py-4 bg-gradient-gold text-black-deep font-bold text-base rounded-lg hover:shadow-lg hover:shadow-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isRpSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black-deep border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Partnership Request
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Success Message */}
                {rpSubmitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center font-medium"
                  >
                    ✓ Request submitted! We'll review and contact you soon.
                  </motion.div>
                )}

                {/* Error Message */}
                {rpSubmitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center font-medium"
                  >
                    ✕ Failed to submit. Please try again later.
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-gold/5 to-transparent rounded-2xl p-6 border border-gold/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-lg">ℹ️</span>
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-2">
                What happens next?
              </h4>
              <ul className="text-gray-400 text-sm space-y-1 leading-relaxed">
                <li>• Our team will review your server within 24-48 hours</li>
                <li>
                  • You'll receive a Discord DM with the partnership details
                </li>
                <li>
                  • Once approved, your server will be featured in our community
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
