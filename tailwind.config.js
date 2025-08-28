/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",             // root HTML files
    "./**/*.html",          // ALL subfolders HTML
    "./assets/js/**/*.js"   // scan JS files for classes
  ],
  theme: {
    extend: {
      colors: {
        trust: {
          50:  '#e0f7f7',
          100: '#b3e3e3',
          200: '#80cccc',
          300: '#4db6b6',
          400: '#269f9f',
          500: '#0e8a8a',
          600: '#087373',
          700: '#065c5c',
          800: '#044a4a',  // Main Color
          900: '#033333',
        }
      },
      fontFamily: {
        opensans: ['Open Sans', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      }
    }
  },
  plugins: [],
}
