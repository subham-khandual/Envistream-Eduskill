/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Vibrant, Eye-Catchy Edtech Palette matching the user's reference design
        primary: {
          DEFAULT: "#1D4ED8", // Royal Blue
          hover: "#1E40AF",
          dark: "#0F3BD4",
          light: "#3B82F6",
          soft: "#EFF6FF",
        },
        navy: {
          950: "#060D1E",
          900: "#0A1128",
          800: "#0F172A",
          700: "#1E293B",
        },
        royal: {
          DEFAULT: "#1D4ED8",
          dark: "#1E40AF",
          ribbon: "#1238CE",
          bright: "#2563EB",
          light: "#3B82F6",
        },
        accent: {
          DEFAULT: "#F97316", // Vibrant Orange
          hover: "#EA580C",
          soft: "#FFF7ED",
          gold: "#F59E0B",
        },
        emerald: {
          DEFAULT: "#10B981",
          dark: "#059669",
          soft: "#ECFDF5",
        },
        "webflow-blue": "#1D4ED8",
        obsidian: "#0A1128",
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#0A1128",
        },
      },
      fontFamily: {
        display: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        poppins: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(29, 78, 216, 0.2)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.08)",
        cardHover: "0 20px 40px -15px rgba(29, 78, 216, 0.15)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
