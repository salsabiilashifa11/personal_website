import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          red: "#EA4335",
          blue: "#4285F4",
          yellow: "#FBBC04",
          green: "#34A853",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        pixel: ['"Press Start 2P"', "var(--font-pixel)", "cursive"],
        mono: ['"Space Mono"', "var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        "card-hover": "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
      },
      transitionProperty: {
        "shadow-transform": "box-shadow, transform",
      },
      keyframes: {
        pop: {
          "0%":   { transform: "scale(0.8)", opacity: "0.5" },
          "60%":  { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeSlideIn: {
          "from": { opacity: "0", transform: "translateY(6px)" },
          "to":   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 0.2s ease-out",
        fadeSlideIn: "fadeSlideIn 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
