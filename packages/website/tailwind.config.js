const { preset } = require("@renderlesskit/react-tailwind/preset");

module.exports = preset({
  mode: "jit",
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/\\@renderlesskit/react-tailwind/dist/esm/theme/defaultTheme/*.js",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
