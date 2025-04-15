module.exports = {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.html", 
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0E0940',
        daylight: '#EDF6FF',
      },
      fontFamily: {
        headings: ['DrukWideBold', 'Helvetica', 'sans-serif'],
        medium: ['DrukWideMedium', 'Helvetica', 'sans-serif'],
        italic: ['DrukWideItalic', 'Helvetica', 'sans-serif'],
        navbar: ['AtypDisplayMedium', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        h1: '2rem',
        h2: '1.8rem',
        p: '1.125rem',
        smalllabel: '1rem',
      },
    },
  },
  plugins: [],
}
