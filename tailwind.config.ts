import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        // Gold Palette (Brand Primary)
        "gold-light": "#ffd363",
        "gold-medium": "#e6b325",
        "gold-dark": "#a67c00",
        gold: "#e6b325",

        // Tech Accent Colors
        "cyber-blue": "#00d4ff",
        "electric-purple": "#a855f7",
        "neon-cyan": "#22d3ee",
        "deep-blue": "#1e3a8a",
        "royal-purple": "#581c87",

        // Neutrals
        silver: "#c8c8c8",
        steel: "#2c2c2c",
        "black-pure": "#000000",
        "black-deep": "#0a0a0a",
        "black-charcoal": "#111111",

        // Semantic Colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      backgroundImage: {
        // Gold Gradients
        "gradient-gold":
          "linear-gradient(135deg, #ffd363 0%, #e6b325 50%, #a67c00 100%)",
        "metallic-sheen":
          "linear-gradient(135deg, rgba(255, 211, 99, 0.1) 0%, rgba(230, 179, 37, 0.05) 100%)",

        // Tech Gradients
        "gradient-tech-blue":
          "linear-gradient(180deg, #1e3a8a 0%, #0a0a0a 100%)",
        "gradient-purple-night":
          "radial-gradient(circle at top, #581c87 0%, #0a0a0a 70%)",
        "gradient-cyber": "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
        "gradient-mesh":
          "radial-gradient(at 27% 37%, #a855f7 0px, transparent 50%), radial-gradient(at 97% 21%, #00d4ff 0px, transparent 50%), radial-gradient(at 52% 99%, #e6b325 0px, transparent 50%), radial-gradient(at 10% 29%, #22d3ee 0px, transparent 50%), radial-gradient(at 97% 96%, #581c87 0px, transparent 50%), radial-gradient(at 33% 50%, #1e3a8a 0px, transparent 50%), radial-gradient(at 79% 53%, #000000 0px, transparent 50%)",

        // Subtle Overlays
        "gradient-overlay":
          "linear-gradient(180deg, transparent 0%, rgba(10, 10, 10, 0.8) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(230, 179, 37, 0.4)",
        "inner-gold": "inset 0 1px 2px rgba(230, 179, 37, 0.1)",
        "cyber-glow": "0 0 30px rgba(0, 212, 255, 0.3)",
        "purple-glow": "0 0 30px rgba(168, 85, 247, 0.3)",
        neon: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
