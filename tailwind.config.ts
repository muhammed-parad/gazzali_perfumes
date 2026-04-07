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
        "matte-black": "#000000",
        "gold-accent-1": "#D4AF37",
        "gold-accent-2": "#F5E1A4",
        "misty-grey": "#F0F0F0",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5E1A4 0%, #D4AF37 50%, #996515 100%)",
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'modal-enter': 'modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'modal-backdrop': 'modalBackdrop 0.4s ease-out',
      },
      keyframes: {
        modalEnter: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        modalBackdrop: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
