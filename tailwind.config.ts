import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gold-light": "#ffd363",
        "gold-medium": "#e6b325",
        "gold-dark": "#a67c00",
        gold: "#e6b325",
        silver: "#c8c8c8",
        steel: "#2c2c2c",
        "black-pure": "#000000",
        "black-deep": "#0a0a0a",
        "black-charcoal": "#111111",
      },
      backgroundImage: {
        "gradient-gold":
          "linear-gradient(135deg, #ffd363 0%, #e6b325 50%, #a67c00 100%)",
        "metallic-sheen":
          "linear-gradient(135deg, rgba(255, 211, 99, 0.1) 0%, rgba(230, 179, 37, 0.05) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(230, 179, 37, 0.4)",
        "inner-gold": "inset 0 1px 2px rgba(230, 179, 37, 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
