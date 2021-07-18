module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.js'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: [ 'Manrope', 'sans-serif' ]
    },
    extend: {
      colors: {
        "primary-bk": '#1A0739',
        "primary-font": '#B68CFB',
        "primary-btn": "#9555ff",
        "secondary-bk": '#230845',
        "banner-bk": '#2A0C5A',
        "alt": {
          "cyan": '#2bcae0',
          "tangerine": "#f07d53",
          "sand": "#f7c97e",
          "aurelium": "#C98E2D",
          "slate": "#6e6e6e"
        }
      },
      height: {
        "i-lg": '60px',
        "i-xl": '70px'
      },
      margin: {
        'lg-height/2': '30px'
      },
      padding: {
        'lg-height/2': '30px'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
