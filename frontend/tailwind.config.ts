import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#241C17",
        mist: "#F7F1EA",
        line: "#DCCFC2",
        brand: {
          50: "#FFF4EA",
          100: "#FDE6D3",
          200: "#F9CFAC",
          300: "#F4AD78",
          400: "#EE8748",
          500: "#E26A2C",
          600: "#C9571D",
          700: "#A54719",
          800: "#833918",
          900: "#6B3018",
        },
        sand: {
          50: "#FBF7F2",
          100: "#F3ECE3",
          200: "#E8DED1",
          300: "#D7C6B2",
          400: "#BFA38C",
          500: "#9B7D63",
        },
      },
      boxShadow: {
        soft: "0 8px 22px rgba(72, 50, 34, 0.05)",
        card: "0 4px 14px rgba(72, 50, 34, 0.04)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "SF Pro Display", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      backgroundImage: {
        hero: "linear-gradient(180deg, rgba(251,247,242,0.96) 0%, rgba(247,241,234,0.96) 100%)",
        panel: "linear-gradient(180deg, rgba(255,252,249,0.98) 0%, rgba(248,242,236,0.96) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
