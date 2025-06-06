/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#1A1A1A',
          'dark': '#2C3E50'
        },
        'secondary': {
          DEFAULT: '#26A69A'
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

