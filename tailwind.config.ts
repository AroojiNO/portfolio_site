import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#06070A",        // Deep background
        primary: "#7231FF",     // Vibrant purple (used sparingly for highlights)
        accent: "#FFC01D",      // Golden yellow (for gradients and highlights)
        glassWhite: "rgba(255, 255, 255, 0.05)", // For translucent glass cards
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "purple-gold-gradient":
          "linear-gradient(135deg, #7231FF 0%, #FFC01D 100%)",
      },
    },
  },
  plugins: [],
};
export default config;