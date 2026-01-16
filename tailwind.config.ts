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
        // Primary colors from logo
        "lumi-blue": {
          50: "#e6f4ff",
          100: "#b3dfff",
          200: "#80caff",
          300: "#4db5ff",
          400: "#1aa0ff",
          500: "#0090e6",
          600: "#0070b3",
          700: "#005080",
          800: "#00304d",
          900: "#00101a",
        },
        "lumi-purple": {
          50: "#f3e8ff",
          100: "#dbb4fe",
          200: "#c480fd",
          300: "#ac4cfc",
          400: "#9518fb",
          500: "#7b00e2",
          600: "#6000b0",
          700: "#46007e",
          800: "#2b004c",
          900: "#11001a",
        },
        "lumi-gold": {
          50: "#fff9e6",
          100: "#ffecb3",
          200: "#ffdf80",
          300: "#ffd24d",
          400: "#ffc51a",
          500: "#e6ac00",
          600: "#b38600",
          700: "#806000",
          800: "#4d3a00",
          900: "#1a1300",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0090e6 0%, #7b00e2 50%, #9518fb 100%)",
        "card-gradient":
          "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #ffc51a 0%, #e6ac00 50%, #b38600 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        gradient: "gradient 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
