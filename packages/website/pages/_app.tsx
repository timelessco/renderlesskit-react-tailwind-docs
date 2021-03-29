import "nextra-theme-docs/style.css";
import React from "react";
import CustomComponent from "../components/CustomComponent";

((typeof window !== "undefined" ? window : {}) as any).__COMPONENTS = {
  CustomComponent,
};

export default function Nextra({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
