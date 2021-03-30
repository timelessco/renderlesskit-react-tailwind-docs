import "tailwindcss/tailwind.css";
import "nextra-theme-docs/style.css";
import React from "react";
import * as RenderlesskitComponents from "@renderlesskit/react-tailwind";

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
