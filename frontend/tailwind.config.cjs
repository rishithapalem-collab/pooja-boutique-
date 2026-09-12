/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boutique: {
          50: '#FDF8F5',
          100: '#FAF0E6',
          200: '#F5E1D2',
          300: '#E6BEA5',
          400: '#D49B78',
          500: '#B87851',
          600: '#9B5B37',
          700: '#7A1C30',
          800: '#5C1222',
          900: '#3D0A15',
        },
        gold: {
          400: '#E6CA65',
          500: '#D4AF37',
          600: '#AA8820',
          700: '#886810',
        },
        cream: '#FFF9F3',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA8820 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #7A1C30 0%, #5C1222 100%)',
      }
    },
  },
  plugins: [],
};
