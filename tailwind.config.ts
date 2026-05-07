import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette marocaine
        majorelle: {
          50: '#e6f0ed',
          100: '#cce0db',
          200: '#99c1b7',
          300: '#66a293',
          400: '#33836f',
          500: '#1B4D3E',
          600: '#163d32',
          700: '#112e26',
          800: '#0b1e19',
          900: '#060f0d',
        },
        safran: {
          50: '#f9f3eb',
          100: '#f3e7d7',
          200: '#e7cfaf',
          300: '#dbb787',
          400: '#cf9f5f',
          500: '#C19A6B',
          600: '#9a7b56',
          700: '#735c40',
          800: '#4d3d2b',
          900: '#261f15',
        },
        tadelakt: {
          50: '#fbf9f6',
          100: '#f7f3ed',
          200: '#efe7db',
          300: '#e7dbc9',
          400: '#dfcfb7',
          500: '#E8DCC4',
          600: '#b9b09d',
          700: '#8a8476',
          800: '#5c584f',
          900: '#2e2c27',
        },
        bronze: {
          500: '#CD853F',
          600: '#a46a32',
        },
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'moroccan': '2rem 0.5rem 2rem 0.5rem',
        'moroccan-reverse': '0.5rem 2rem 0.5rem 2rem',
        'arch': '50% 50% 0 0 / 20% 20% 0 0',
      },
      backgroundImage: {
        'zellige-pattern': "url('/patterns/zellige.svg')",
        'gradient-moroccan': 'linear-gradient(135deg, #1B4D3E 0%, #C19A6B 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
