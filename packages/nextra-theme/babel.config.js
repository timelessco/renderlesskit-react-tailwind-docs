const BABEL_ENV = process.env.BABEL_ENV;

module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/env",
      {
        modules: false,
        targets: {
          esmodules: true,
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ];

  const plugins = [["@babel/plugin-proposal-class-properties"]];

  return {
    presets,
    plugins,
    env: {
      test: {
        presets: [["@babel/env", { targets: { node: "current" } }]],
      },
    },
  };
};
