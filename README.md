# Renderlesskit React Tailwind Docs

## Getting Started

Renderlesskit uses tailwind to provide better styling so you'll need to install
the neccesary dependencies and setup a tailwind.

### Installation

```bash
npm i @renderlesskit/react-tailwind
```

```bash
yarn add @renderlesskit/react-tailwind
```

## Tailwind setup

After setting up tailwind in your project, all you need to do inside your
`tailwind.config.js` is import our `preset` function and use it.

```js
const { preset } = require("@renderlesskit/react-tailwind/preset");

module.exports = preset({
  purge: [
    // Make sure to add this purge
    "./node_modules/\\@renderlesskit/react-tailwind/dist/esm/theme/defaultTheme/*.js",
  ],
});
```

## Setting up provider

Renderlesskit needs a theme provider which passes down all the neccesary styling
for the components at the root of your app.

Go to your root of the application and add this:

```js
import * as React from "react";
// 1. import `RenderlesskitProvider` component
import { RenderlesskitProvider } from "@renderlesskit/react-tailwind";

function App() {
  // 2. Use at the root of your app
  return (
    <RenderlesskitProvider>
      <App />
    </RenderlesskitProvider>
  );
}
```

## Contributors ✨

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://navinmoorthy.me/"><img src="https://avatars.githubusercontent.com/u/39694575?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Navin Moorthy</b></sub></a><br /><a href="https://github.com/timelessco/renderlesskit-react-tailwind-docs/commits?author=navin-moorthy" title="Code">💻</a></td>
    <td align="center"><a href="https://anuraghazra.github.io/"><img src="https://avatars.githubusercontent.com/u/35374649?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anurag Hazra</b></sub></a><br /><a href="https://github.com/timelessco/renderlesskit-react-tailwind-docs/commits?author=anuraghazra" title="Code">💻</a> <a href="https://github.com/timelessco/renderlesskit-react-tailwind-docs/commits?author=anuraghazra" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!
