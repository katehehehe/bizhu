/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        twitterWhite: "#e7e9ea",
        twitterBlue: "#308CD8",
        twitterBorder: "#2f3336",
        twitterLightGray: "#71767b",
        twitterDarkGray: "#17181C",
      },
    },
    screens: {
      sm: "640px", // small screens, like phones
      md: "768px", // medium screens, like tablets
      lg: "1024px", // large screens, like laptops
      xl: "1280px", // extra large screens, like desktops
    },
    minWidth: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
  },

  plugins: [],
};
