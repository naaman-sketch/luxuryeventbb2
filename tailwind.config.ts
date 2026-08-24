import type { Config } from "tailwindcss";

/**
 * LuxuryEvent B2B — palette premium sombre + accent OR/champagne.
 * Une seule famille d'accent (or) pour une cohérence « luxe ».
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#09090c",
          soft: "#131318",
          muted: "#1c1c24",
        },
        gold: {
          DEFAULT: "#E8B84B",
          soft: "#F3D07A",
          deep: "#B8892E",
          glow: "#FFE9A8",
        },
        accent: {
          DEFAULT: "#E8B84B",
          soft: "#F3D07A",
          glow: "#FFE9A8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 10px 44px -8px rgba(232,184,75,0.45)",
        card: "0 24px 60px -24px rgba(0,0,0,0.75)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
