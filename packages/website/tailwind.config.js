const preset = require("@renderlesskit/react-tailwind/preset");

module.exports = preset({
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
