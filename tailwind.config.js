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
        "btn-hover": '#6829D1',
        "alt": {
          "cyan": '#2bcae0',
          "tangerine": "#f07d53",
          "sand": "#f7c97e",
          "aurelium": "#C98E2D",
          "slate": "#6e6e6e"
        }
      },
      height: {
        "i-lg": '49px',
        "i-xl": '70px'
      },
      margin: {
        'lg-height/2': '30px'
      },
      padding: {
        'lg-height/2': '30px'
      },
      lineHeight: {
        exl: '1.3em'
      },
      borderRadius: {
        exl: '64px'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: [ 'active' ]
    },
  },
  plugins: [],
}
