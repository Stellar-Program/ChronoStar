import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0b0f',
          card: '#111318',
          elevated: '#1a1d25',
        },
        accent: {
          blue: '#4f8ef7',
          green: '#22c55e',
          orange: '#f97316',
          purple: '#a855f7',
          red: '#ef4444',
        },
        border: {
          DEFAULT: '#1e2330',
          accent: '#2a3045',
        },
        text: {
          primary: '#f1f5f9',
          muted: '#64748b',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
