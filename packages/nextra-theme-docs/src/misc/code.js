import React from "react";
import prismTheme from "prism-react-renderer/themes/github";
import Highlight, { defaultProps } from "prism-react-renderer";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

const THEME = {
  plain: {
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["keyword", "builtin"],
      style: {
        color: "#ff0078",
        fontWeight: "bold",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#999",
        fontStyle: "italic",
      },
    },
    {
      types: ["variable", "language-javascript"],
      style: {
        color: "#0076ff",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "#d9931e",
        fontStyle: "normal",
      },
    },
    {
      types: ["boolean", "regex"],
      style: {
        color: "#d9931e",
      },
    },
  ],
};

const StaticCode = ({ children, className, highlight, ...props }) => {
  if (!className) return <code {...props}>{children}</code>;

  const highlightedLines = highlight ? highlight.split(",").map(Number) : [];

  // https://mdxjs.com/guides/syntax-highlighting#all-together
  const language = className.replace(/language-/, "");
  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={THEME}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code className={className} style={{ ...style }}>
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line, key: i })}
              style={
                highlightedLines.includes(i + 1)
                  ? {
                      background: "var(--c-highlight)",
                      margin: "0 -1rem",
                      padding: "0 1rem",
                    }
                  : null
              }
            >
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  );
};

const CodeBlock = ({ children, className, live, render, ...props }) => {
  const language = className?.replace(/language-/, "");

  if (live) {
    return (
      <div>
        <LiveProvider
          theme={prismTheme}
          language={language}
          code={children.trim()}
          transformCode={(rawCode) => {
            const code = rawCode;
            // // remove imports
            // .replace(/((^|)import[^;]+[; ]+)+/gi, "")
            // // replace `export default => {*};` with `render(() => {*});`
            // .replace(
            //   /export default \(\) => {((.|\n)*)};/,
            //   "render(() => {$1});"
            // )
            // // replace `export default => (*);` with `render(*);`
            // .replace(/export default \(\) => \(((.|\n)*)\);/, "render($1);")
            // // replace `export default => *;` with `render(*);`
            // .replace(/export default \(\) => ((.|\n)*);/, "render($1);");

            return language === "jsx" ? `<>${code}</>` : code;
          }}
          scope={{
            React,
            ...(typeof window !== "undefined" ? window.__COMPONENTS : {}),
          }}
        >
          <LivePreview className="p-2 mx-2 rounded-md" />
          <LiveEditor className="p-2 mx-2 rounded-md" />
          <LiveError className="p-2 mx-2 rounded-md text-xs bg-red-100 text-red-500" />
        </LiveProvider>
      </div>
    );
  }

  if (render) {
    return (
      <div>
        <LiveProvider code={children.trim()}>
          <LivePreview />
        </LiveProvider>
      </div>
    );
  }

  return (
    <StaticCode children={children.trim()} className={className} {...props} />
  );
};

export default CodeBlock;
