import React from "react";
import * as RenderlesskitComponents from "@renderlesskit/react-tailwind";

import "../styles/tailwind.css";
import "nextra-theme/style.css";

((typeof window !== "undefined" ? window : {}) as any).__COMPONENTS = {
  ...RenderlesskitComponents,
};

export default function Nextra({ Component, pageProps }) {
  return (
    <RenderlesskitComponents.RenderlesskitProvider>
      <Component {...pageProps} />
    </RenderlesskitComponents.RenderlesskitProvider>
  );
}
