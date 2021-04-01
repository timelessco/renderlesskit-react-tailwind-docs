// next.config.js
const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  stork: true,
});

module.exports = withNextra({
  future: {
    webpack5: true,
  },
});
