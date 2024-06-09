const konstaConfig = require("konsta/config");

module.exports = konstaConfig({
  konsta: {
    colors: {
      primary: "#7484fc",
    },
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    ripple: (theme) => ({
      colors: theme("colors"),
    }),
    extend: {
      keyframes: {
        "box-shadow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.5)" },
          "50%": { boxShadow: "0 0 2px 2px rgba(100, 100, 100, 0.9)" },
        },
        "drop-shadow-pulse": {
          "0%, 100%": { dropShadow: "0 0 0 rgba(0, 0, 0, 0.5)" },
          "50%": { dropShadow: "0 0 2px rgba(100, 100, 100, 0.9)" },
        },
      },
      animation: {
        "box-shadow-pulse": "box-shadow-pulse 1.5s infinite",
        "drop-shadow-pulse": "drop-shadow-pulse 1.5s infinite",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/postcss7-compat"),
    require("tailwindcss-ripple")(),
    require("tailwindcss-animated"),
  ],
});
