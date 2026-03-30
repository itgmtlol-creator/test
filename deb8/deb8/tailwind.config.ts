import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        border: '#222222',
        'border-2': '#2a2a2a',
        muted: '#666666',
        subtle: '#444444',
        primary: '#ffffff',
        secondary: '#aaaaaa',
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
}
export default config
