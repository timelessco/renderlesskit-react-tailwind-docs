// next.config.js
const withNextra = require("nextra")({
  theme: "nextra-theme",
  themeConfig: "./theme.config.js",
  stork: true,
});

module.exports = withNextra({});
