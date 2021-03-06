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
