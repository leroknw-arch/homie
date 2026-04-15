import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        surface: {
          50: "#f7f8f3",
          100: "#f0f1ea",
          200: "#d8dccb",
          300: "#c4cab0",
          400: "#a7b38a",
          500: "#7c8f54",
          600: "#60723f",
          700: "#495730",
          800: "#324124",
          900: "#202a17"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      boxShadow: {
        soft: "0 20px 60px -24px rgba(30, 41, 59, 0.28)",
        panel: "0 24px 70px -28px rgba(15, 23, 42, 0.22)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(124,143,84,0.18), transparent 32%), radial-gradient(circle at 85% 10%, rgba(19,78,74,0.14), transparent 30%)"
      },
      fontFamily: {
        sans: ["'Avenir Next'", "Montserrat", "'Segoe UI'", "sans-serif"],
        display: ["'Sora'", "'Avenir Next'", "Montserrat", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
