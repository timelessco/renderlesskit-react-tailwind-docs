import React from "react";
import { useClipboard } from "@chakra-ui/hooks";
import theme from "prism-react-renderer/themes/palenight";
import Highlight, { defaultProps } from "prism-react-renderer";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import * as Renderlesskit from "@renderlesskit/react-tailwind";

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

export const StaticCode = ({
  children,
  className,
  highlight,
  noCopy,
  ...props
}) => {
  if (!className) return <code {...props}>{children}</code>;

  const highlightedLines = highlight ? highlight.split(",").map(Number) : [];

  // https://mdxjs.com/guides/syntax-highlighting#all-together
  const language = className.replace(/language-/, "");
  return (
    <div className="relative">
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
      {!noCopy && <CopyButton code={children.trim()} top={-15} />}
    </div>
  );
};

export const CopyButton = ({ code }) => {
  const { hasCopied, onCopy } = useClipboard(code);

  return (
    <button
      className="absolute right-0 px-4 py-1 text-xs text-gray-800 transform -translate-x-2 translate-y-4 bg-white rounded-md -top-2"
      onClick={onCopy}
    >
      {hasCopied ? "COPIED!" : "COPY"}
    </button>
  );
};

const transformer = (rawCode, language, noInline) => {
  const code = rawCode
    // remove imports
    .replace(/((^|)import[^;]+[; ]+)+/gi, "")
    // replace `export default => {*};` with `render(() => {*});`
    .replace(/export default \(\) => {((.|\n)*)};/, "render(() => {$1});")
    // replace `export default => (*);` with `render(*);`
    .replace(/export default \(\) => \(((.|\n)*)\);/, "render($1);")
    // replace `export default => *;` with `render(*);`
    .replace(/export default \(\) => ((.|\n)*);/, "render($1);")
    .replace(/export default ((.|\n)*);/, "render($1);");

  return language === "jsx" && !noInline ? `<>${code}</>` : code;
};

export const CodeBlock = props => {
  const { children, className, live, render, noCopy, noInline, ...rest } =
    props;
  const language = className?.replace(/language-/, "");
  const [editorCode, setEditorCode] = React.useState(children.trim());
  const onChange = newCode => setEditorCode(newCode.trim());
  const scope = {
    React,
    ...Renderlesskit,
    // ...window.__COMPONENTS,
  };
  const liveProviderProps = {
    theme,
    language,
    code: editorCode,
    scope,
    noInline,
    ...rest,
  };

  if (typeof window === "undefined") return null;

  if (live) {
    return (
      <LiveProvider
        transformCode={rawCode =>
          transformer(rawCode, language, props.noInline)
        }
        {...liveProviderProps}
      >
        <LivePreview className="p-6 bg-white border border-gray-600 rounded-md rounded-b-none" />
        <div className="relative">
          <LiveEditor
            onChange={onChange}
            className="font-mono text-sm rounded-md rounded-t-none"
          />
          <CopyButton code={editorCode} />
        </div>
        <LiveError className="mt-0 text-xs text-red-500 bg-red-100 rounded-md rounded-t-none" />
      </LiveProvider>
    );
  }

  if (render) {
    return (
      <div>
        <LiveProvider
          transformCode={rawCode =>
            transformer(rawCode, language, props.noInline)
          }
          {...liveProviderProps}
        >
          <LivePreview style={{ fontFamily: "'Inter', sans-serif" }} />
        </LiveProvider>
      </div>
    );
  }

  return (
    <StaticCode noCopy={noCopy} className={className} {...props}>
      {editorCode}
    </StaticCode>
  );
};
