"use client";

import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  MapPin,
  Send,
  Phone,
  Globe,
  Gamepad2,
} from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [rpFormData, setRpFormData] = useState({
    serverName: "",
    ownerName: "",
    discordId: "",
    serverDescription: "",
    playerCount: "",
    serverIP: "",
    additionalInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRpSubmitting, setIsRpSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [rpSubmitStatus, setRpSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 2000);
  };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRpFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@maestros.gg",
      description: "Send us an email anytime",
      link: "mailto:contact@maestros.gg",
    },
    {
      icon: MessageSquare,
      title: "Discord",
      value: "Join our server",
      description: "Chat with us on Discord",
      link: "https://discord.gg/maestros",
    },
    {
      icon: Globe,
      title: "Social Media",
      value: "@MaestrosCommunity",
      description: "Follow us on social platforms",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
            Have a question or want to join our community? We'd love to hear
            from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-2xl p-6 border border-gold/20 hover:border-gold/50 transition-all hover:transform hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gold font-bold text-lg mb-1">
                      {method.title}
                    </h3>
                    <p className="text-white text-sm mb-1">{method.value}</p>
                    <p className="text-gray-400 text-xs">
                      {method.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </motion.div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-3xl p-8 border border-gold/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold-light/30 flex items-center justify-center border border-gold/40">
                  <Send className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl font-bold text-gold">
                  Send us a message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="What is this about?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-gold via-gold-light to-gold text-black-deep font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-gold/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black-deep border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center"
                  >
                    Message sent successfully! We'll get back to you soon.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Community Info */}
            <div className="bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-2xl p-8 border border-gold/20">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo.png"
                  alt="Maestros Logo"
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gold">
                    Maestros Community
                  </h3>
                  <p className="text-gray-400 text-sm">Gaming Excellence</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Join our thriving gaming community where passion meets
                excellence. Whether you're a casual player or competitive gamer,
                there's a place for you here.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white">Global Community</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Response Time</p>
                    <p className="text-white">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-2xl p-8 border border-gold/20">
              <h3 className="text-xl font-bold text-gold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a
                  href="/about"
                  className="block text-gray-300 hover:text-gold transition-colors"
                >
                  → About Us
                </a>
                <a
                  href="/apply"
                  className="block text-gray-300 hover:text-gold transition-colors"
                >
                  → Join Our Community
                </a>
                <a
                  href="/rules"
                  className="block text-gray-300 hover:text-gold transition-colors"
                >
                  → Community Rules
                </a>
                <a
                  href="/team"
                  className="block text-gray-300 hover:text-gold transition-colors"
                >
                  → Meet Our Team
                </a>
              </div>
            </div>

            {/* FAQ Hint */}
            <div className="bg-gradient-to-br from-gold/5 via-black-deep/50 to-gold/5 rounded-2xl p-6 border border-gold/30">
              <h4 className="text-lg font-bold text-gold mb-2">
                💡 Before you ask...
              </h4>
              <p className="text-gray-300 text-sm">
                Check out our{" "}
                <a href="/rules" className="text-gold hover:underline">
                  Rules page
                </a>{" "}
                for common questions about membership, events, and community
                guidelines.
              </p>
            </div>
          </motion.div>
        </div>

        {/* RP Server Invite Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-black-charcoal via-black-deep to-black-charcoal rounded-3xl p-8 border border-gold/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold-light/30 flex items-center justify-center border border-gold/40">
                <Gamepad2 className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-gold">
                Request RP Server Invite
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-6 ml-15">
              Want to partner with us or get your server featured? Fill out this
              form and we'll review your request.
            </p>

            <form onSubmit={handleRpSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Server Name */}
                <div>
                  <label
                    htmlFor="serverName"
                    className="block text-sm font-medium text-gray-400 mb-2"
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
                    className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="My Awesome RP Server"
                  />
                </div>

                {/* Owner Name */}
                <div>
                  <label
                    htmlFor="ownerName"
                    className="block text-sm font-medium text-gray-400 mb-2"
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
                    className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Discord ID */}
                <div>
                  <label
                    htmlFor="discordId"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Your Discord ID *
                  </label>
                  <input
                    type="text"
                    id="discordId"
                    name="discordId"
                    value={rpFormData.discordId}
                    onChange={handleRpChange}
                    required
                    className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="123456789012345678"
                  />
                </div>

                {/* Player Count */}
                <div>
                  <label
                    htmlFor="playerCount"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Average Player Count
                  </label>
                  <input
                    type="text"
                    id="playerCount"
                    name="playerCount"
                    value={rpFormData.playerCount}
                    onChange={handleRpChange}
                    className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="32/64"
                  />
                </div>
              </div>

              {/* Server IP */}
              <div>
                <label
                  htmlFor="serverIP"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Server IP/Connect Link
                </label>
                <input
                  type="text"
                  id="serverIP"
                  name="serverIP"
                  value={rpFormData.serverIP}
                  onChange={handleRpChange}
                  className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="connect cfx.re/join/abc123"
                />
              </div>

              {/* Server Description */}
              <div>
                <label
                  htmlFor="serverDescription"
                  className="block text-sm font-medium text-gray-400 mb-2"
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
                  className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  placeholder="Describe your server, what makes it unique, game mode, features, etc..."
                />
              </div>

              {/* Additional Info */}
              <div>
                <label
                  htmlFor="additionalInfo"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={rpFormData.additionalInfo}
                  onChange={handleRpChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-black-deep border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  placeholder="Any other details you'd like to share..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRpSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-gold via-gold-light to-gold text-black-deep font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-gold/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isRpSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black-deep border-t-transparent rounded-full animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Server Request
                  </>
                )}
              </button>

              {/* Success Message */}
              {rpSubmitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center"
                >
                  🎉 Server invite request submitted successfully! We'll review
                  it and get back to you soon.
                </motion.div>
              )}

              {/* Error Message */}
              {rpSubmitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center"
                >
                  ❌ Failed to submit request. Please try again or contact us
                  directly.
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
