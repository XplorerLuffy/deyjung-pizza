/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        dark: '#0A0A0A',
        surface: '#141414',
        card: '#1C1C1C',
        'card-raised': '#242424',
        gold: '#D4A853',
        'gold-light': '#E2C07A',
        'gold-dim': '#8B6E35',
        crimson: '#C8102E',
        'brand-text': '#F5EDD8',
        'brand-muted': '#A8A29E',
        'status-pending': '#F59E0B',
        'status-preparing': '#3B82F6',
        'status-ready': '#22C55E',
        'status-completed': '#6B7280',
        'status-cancelled': '#EF4444',
      },
    },
  },
  plugins: [],
}
