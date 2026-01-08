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
        /*
         * WCAG Accessible Mondrian Colors
         * All accent colors meet minimum 4.5:1 contrast ratio against bg (#0a0a0a)
         */
        accent: '#4A9CFF',           // Accessible Blue (7.2:1 contrast - AAA)
        'accent-red': '#FF5252',     // Accessible Red (6.2:1 contrast - AA)
        'accent-yellow': '#FFEB00',  // Yellow (16.1:1 contrast - AAA)
        'mondrian-red': '#FF5252',   // Accessible Red (6.2:1 contrast - AA)
        'mondrian-blue': '#4A9CFF',  // Accessible Blue (7.2:1 contrast - AAA)
        'mondrian-yellow': '#FFEB00',// Yellow (16.1:1 contrast - AAA)
        'mondrian-black': '#000000',
        'mondrian-white': '#FFFFFF',
        'text-main': '#e8e8e8',      // Primary text (16.1:1 contrast - AAA)
        'text-dim': '#A3A3A3',       // Secondary text (7.8:1 contrast - AAA)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'sharp': '20px 20px 60px #000000, -5px -5px 20px rgba(255,255,255,0.03)',
        'accent-glow': '0 0 30px rgba(74, 156, 255, 0.4)',   // Updated for accessible blue
        'red-glow': '0 0 30px rgba(255, 82, 82, 0.4)',       // Updated for accessible red
        'yellow-glow': '0 0 30px rgba(255, 235, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

