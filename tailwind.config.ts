import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // FM-style dark theme
        bg: "#0a0a0f",
        bgLight: "#0f0f16",
        panel: "#14141e",
        panelLight: "#1a1a28",
        panelHover: "#1f1f2e",
        
        // Accent colors
        primary: "#22c55e",
        primaryDark: "#16a34a",
        accent: "#3b82f6",
        
        // Status colors
        green: "#22c55e",
        red: "#ef4444",
        yellow: "#eab308",
        orange: "#f97316",
        blue: "#3b82f6",
        purple: "#8b5cf6",
        cyan: "#06b6d4",
        
        // Text colors
        text: "#f1f5f9",
        textSecondary: "#94a3b8",
        muted: "#64748b",
        
        // Border colors
        border: "rgba(255, 255, 255, 0.08)",
        borderLight: "rgba(255, 255, 255, 0.12)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Oswald", "sans-serif"],
      },
      boxShadow: {
        'fm': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'fm-lg': '0 8px 40px rgba(0, 0, 0, 0.5)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'fm-panel': 'linear-gradient(180deg, rgba(20, 20, 30, 0.95) 0%, rgba(15, 15, 22, 0.98) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
