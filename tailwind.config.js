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
        card: "#1e293b", // Slate 800
        "card-foreground": "#f8fafc", // Slate 50
        primary: "#3b82f6", // Blue 500
        "primary-foreground": "#ffffff",
        secondary: "#64748b", // Slate 500
        accent: "#ef4444", // Red 500 (for LEDs)
      },
    },
  },
  plugins: [],
};
