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
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/postcss7-compat"),
    require("tailwindcss-ripple")(),
    require("tailwindcss-animated"),
  ],
});
