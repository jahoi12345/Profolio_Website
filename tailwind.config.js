/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        'slab-surface': '#111111',
        accent: '#0052FF', // Mondrian Blue
        'accent-red': '#E60012', // Mondrian Red
        'accent-yellow': '#FFEB00', // Mondrian Yellow
        'mondrian-red': '#E60012',
        'mondrian-blue': '#0052FF',
        'mondrian-yellow': '#FFEB00',
        'mondrian-black': '#000000',
        'mondrian-white': '#FFFFFF',
        'text-main': '#e8e8e8',
        'text-dim': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'sharp': '20px 20px 60px #000000, -5px -5px 20px rgba(255,255,255,0.03)',
        'accent-glow': '0 0 30px rgba(0, 82, 255, 0.4)',
        'red-glow': '0 0 30px rgba(230, 0, 18, 0.4)',
        'yellow-glow': '0 0 30px rgba(255, 235, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

