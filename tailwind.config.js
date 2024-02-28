/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
    ripple: (theme) => ({
      colors: theme("colors"),
    }),
    extend: {
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
    },
  },
  variants: {
    extend: {
      backdropFilter: ["responsive"], // or other variants you need
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/postcss7-compat"),
    require("tailwindcss-ripple")(),
    require("tw-elements-react/dist/plugin.cjs"),
  ],
};
