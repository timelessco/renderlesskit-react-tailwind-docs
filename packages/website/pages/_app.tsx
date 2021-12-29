import React from "react";
import * as RenderlesskitComponents from "@renderlesskit/react-tailwind";

import "../styles/tailwind.css";
import "nextra-theme/style.css";

export default function Nextra({ Component, pageProps }) {
  return (
    <RenderlesskitComponents.RenderlesskitProvider>
      <Component {...pageProps} />
    </RenderlesskitComponents.RenderlesskitProvider>
  );
}
