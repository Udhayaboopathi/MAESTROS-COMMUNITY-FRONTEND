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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
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
    <div className="min-h-screen bg-black-deep relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-light/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4 px-6 py-2 bg-gold/10 border border-gold/30 rounded-full">
            <p className="text-gold font-semibold text-sm">CONTACT US</p>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-white">
            Let's Start a{" "}
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Conversation
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            We're here to help and answer any questions you might have
          </p>
        </motion.div>

        {/* Contact Methods - Horizontal Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={index}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="group relative bg-black-charcoal/50 backdrop-blur-sm rounded-xl p-6 border border-gold/10 hover:border-gold/40 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-lg bg-gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-black-deep" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    {method.title}
                  </h3>
                  <p className="text-gold-light text-sm mb-2 font-medium">
                    {method.value}
                  </p>
                  <p className="text-gray-500 text-xs">{method.description}</p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-5 gap-8 items-start mb-12">
          {/* Form - Takes up 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-black-charcoal/70 backdrop-blur-md rounded-2xl p-8 border border-gold/20 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Send a Message
                </h2>
                <p className="text-gray-400 text-sm">
                  Fill out the form below and we'll get back to you shortly
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gold-light mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gold-light mb-2"
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
                      className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gold-light mb-2"
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
                    className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gold-light mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-black-deep/80 border border-gold/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-gold text-black-deep font-bold text-base rounded-lg hover:shadow-lg hover:shadow-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black-deep border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center font-medium"
                  >
                    ✓ Message sent! We'll respond within 24 hours.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Info Sidebar - Takes up 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Community Card */}
            <div className="bg-gradient-to-br from-gold/10 via-black-charcoal/90 to-black-charcoal/90 backdrop-blur-sm rounded-2xl p-6 border border-gold/30">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.png"
                  alt="Maestros"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Maestros Community
                  </h3>
                  <p className="text-gold-light text-sm">Gaming Excellence</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Join our thriving gaming community where passion meets
                excellence. Connect with gamers worldwide.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span className="text-gray-300">Global Community</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gold" />
                  <span className="text-gray-300">24hr Response Time</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-black-charcoal/70 backdrop-blur-sm rounded-2xl p-6 border border-gold/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-gold rounded-full" />
                Quick Navigation
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Join Now", href: "/apply" },
                  { label: "Rules", href: "/rules" },
                  { label: "Our Team", href: "/team" },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="px-4 py-2 bg-black-deep/60 hover:bg-black-deep border border-gold/10 hover:border-gold/30 rounded-lg text-gray-300 hover:text-gold text-sm transition-all text-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-gold/5 to-transparent rounded-2xl p-5 border border-gold/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold text-lg">💡</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">
                    Pro Tip
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Check our{" "}
                    <a href="/rules" className="text-gold hover:underline">
                      Rules
                    </a>{" "}
                    page for FAQs before reaching out
                  </p>
                </div>
              </div>
            </div>

            {/* RP Server Partnership Link */}
            <a
              href="/rp-invite"
              className="block bg-gradient-to-r from-gold/10 via-gold-light/5 to-transparent rounded-2xl p-6 border border-gold/30 hover:border-gold/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-black-deep" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-base mb-1 group-hover:text-gold transition-colors">
                    RP Server Partnership
                  </h4>
                  <p className="text-gray-400 text-xs">
                    Get your server featured in our community →
                  </p>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
