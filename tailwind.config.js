/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "#ffffff", // White
        "card-foreground": "#020617", // Slate 950
        primary: "#1d4ed8", // Blue 700
        "primary-foreground": "#ffffff",
        secondary: "#e2e8f0", // Slate 200
        accent: "#dc2626", // Red 600
        circuit: {
          bg: "#ffffff", // White
          panel: "#ffffff", // White
          wire: {
            off: "#64748b", // Slate 500 - Darker for visibility
            on: "#1d4ed8", // Blue 700 - High contrast blue
            high: "#dc2626", // Red 600 - High contrast red
          },
          chip: "#ffffff", // White background for chip
          pin: "#0f172a", // Slate 900 - Almost black
        }
      },
    },
  },
  plugins: [],
};
