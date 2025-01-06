/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#fef2f3',
          100: '#fde6e7',
          200: '#fbd0d5',
          300: '#f7aab2',
          400: '#f27785',
          500: '#e63e4f',
          600: '#9b122c', // Primary brand red
          700: '#8b0f27',
          800: '#740f23',
          900: '#611021',
        },
      },
    },
  },
  plugins: [],
};