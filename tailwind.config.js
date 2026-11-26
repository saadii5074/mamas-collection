/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festiva: {
          burgundy: '#6B1222',
          maroon: '#4A0B16',
          wine: '#851A2E',
          gold: '#C59B27',
          lightgold: '#FDF3D6',
          sand: '#F7EDE2',
          blush: '#FAF5F3',
          rose: '#D9777F',
          dark: '#1C1917',
          muted: '#6B7280'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'festive': '0 10px 25px -5px rgba(107, 18, 34, 0.12), 0 8px 10px -6px rgba(107, 18, 34, 0.08)',
        'gold-glow': '0 0 20px rgba(197, 155, 39, 0.25)',
      }
    },
  },
  plugins: [],
}
