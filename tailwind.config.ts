import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple:  '#4b1d79',
          purple2: '#6b2fa0',
          purple3: '#9333ea',
          pale:    '#f3eef9',
          gold:    '#c9a227',
          gold2:   '#e8c84a',
          slate:   '#111118',
          mid:     '#44444f',
          muted:   '#7a7a8c',
          bg:      '#f8f7fc',
          border:  '#e6e0f0',
          card:    '#ffffff',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-playfair)', '"Playfair Display"', 'serif'],
      },
      maxWidth: { portal: '1200px' },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(22px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        tick:    { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        blink:   { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.4', transform: 'scale(0.7)' } },
        modalIn: { from: { opacity: '0', transform: 'scale(0.93) translateY(14px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease both',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
        tick:       'tick 18s linear infinite',
        blink:      'blink 2s infinite',
        'modal-in': 'modalIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      },
      backdropBlur: { portal: '16px' },
      boxShadow: {
        topbar:    '0 1px 16px rgba(75,29,121,0.06)',
        card:      '0 20px 50px rgba(75,29,121,0.13)',
        'card-lg': '0 40px 100px rgba(0,0,0,0.35)',
        modal:     '0 40px 80px rgba(0,0,0,0.30)',
      },
    },
  },
  plugins: [],
};

export default config;
