/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#060709',
          deep: '#030406',
          card: 'rgba(15, 18, 25, 0.7)',
          elevated: 'rgba(23, 27, 38, 0.85)',
        },
        gold: {
          50: '#fffbf0',
          100: '#ffefc2',
          200: '#fedf8f',
          300: '#fccb57',
          400: '#f5b026',
          500: '#e59914',
          600: '#c5780d',
          700: '#9d560e',
          800: '#804413',
          900: '#6c3814',
          accent: '#e5a93c',
        },
        earth: {
          50: '#fbf7f4',
          100: '#f6ede6',
          200: '#edd9cc',
          300: '#e0bfa9',
          400: '#cb9c7f',
          500: '#b87c5a',
          600: '#a36344',
          700: '#844d36',
          800: '#6c4030',
          900: '#58362a',
        },
        paddy: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cinzel Decorative"', '"Cinzel"', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
