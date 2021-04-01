import React from "react";
import useClipboard from "react-use-clipboard";
import prismTheme from "prism-react-renderer/themes/palenight";
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

const CopyButton = ({ code }) => {
  const [isCopied, setCopied] = useClipboard(code);
  return (
    <button
      className="absolute top-2 right-2 transform translate-y-2 -translate-x-2 bg-gray-800 text-white rounded-md px-4 py-1 text-sm"
      onClick={setCopied}
    >
      {isCopied ? "COPIED!" : "COPY"}
    </button>
  );
};

const CodeBlock = ({ children, className, live, render, ...props }) => {
  const language = className?.replace(/language-/, "");
  const source = children.trim();

  if (live) {
    return (
      <div className="relative">
        <LiveProvider
          theme={prismTheme}
          language={language}
          code={source}
          transformCode={rawCode => {
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
          <LivePreview
            className="p-6 rounded-md bg-white rounded-b-none border border-gray-600"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <LiveEditor
            style={{ fontFamily: "SF Mono, Menlo, monospace" }}
            className="rounded-md rounded-t-none text-sm"
          />
          <LiveError className="rounded-md rounded-t-none mt-0 text-xs bg-red-100 text-red-500" />
        </LiveProvider>
        <CopyButton code={source} />
      </div>
    );
  }

  if (render) {
    return (
      <div>
        <LiveProvider code={source}>
          <LivePreview />
        </LiveProvider>
      </div>
    );
  }

  return <StaticCode children={source} className={className} {...props} />;
};

export default CodeBlock;
