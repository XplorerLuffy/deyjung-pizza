import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: { DEFAULT: '#8B1C1C', light: '#A82424', dark: '#6B1515' },
        olive: { DEFAULT: '#58703A', light: '#6A8A46' },
        gold: { DEFAULT: '#D4AF37', light: '#E8C94A', dark: '#A88A2A' },
        dark: { DEFAULT: '#0F0A06', lighter: '#1A0F08' },
        surface: { DEFAULT: '#1A1008', light: '#241508', card: '#1E1209' },
        brand: { text: '#F5EDCF', muted: '#8A7A5A' },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
export default config
