/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",          // your main file
    "./**/*.html",           // all subfolders HTML
    "./assets/js/**/*.js"    // scripts (if you use classes in JS)
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
          800: '#044a4a',  // main Jeelani Trust color
          900: '#033333',
        }
      },
      fontFamily: {
        opensans: ['Open Sans', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        elmessiri: ['El Messiri', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto Condensed', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
