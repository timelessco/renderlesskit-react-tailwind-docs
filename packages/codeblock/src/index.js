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

const useCopyButtonOffset = () => {
  const wrapper = React.useRef();
  const [top, setTop] = React.useState(0);

  useSafeLayoutEffect(() => {
    if (wrapper?.current) {
      const live = wrapper.current.children[0];
      const liveBB = live.getBoundingClientRect();
      setTop(liveBB.height <= 90 ? liveBB.height - 10 : liveBB.height);
    }
  }, [wrapper]);

  return { top, wrapper };
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

export const CopyButton = ({ code, top }) => {
  const [isCopied, setCopied] = useClipboard(code);
  return (
    <button
      className="absolute px-4 py-1 text-xs text-gray-800 transform -translate-x-2 translate-y-4 bg-white rounded-md right-2"
      onClick={setCopied}
      style={{ top: `${top}px` }}
    >
      {isCopied ? "COPIED!" : "COPY"}
    </button>
  );
};

const useSafeLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

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

export const CodeBlock = ({
  children,
  className,
  live,
  render,
  noCopy,
  ...props
}) => {
  const { wrapper, top } = useCopyButtonOffset();
  const language = className?.replace(/language-/, "");
  const source = children.trim();

  if (typeof window === "undefined") return null;

  const reactLivescope = {
    React,
    ...(typeof window !== "undefined" ? window.__COMPONENTS : {}),
  };

  if (live) {
    return (
      <div className="relative" ref={wrapper}>
        <LiveProvider
          theme={prismTheme}
          language={language}
          code={source}
          transformCode={rawCode =>
            transformer(rawCode, language, props.noInline)
          }
          scope={reactLivescope}
          {...props}
        >
          <LivePreview
            className="p-6 bg-white border border-gray-600 rounded-md rounded-b-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <LiveEditor
            style={{ fontFamily: "SF Mono, Menlo, monospace" }}
            className="text-sm rounded-md rounded-t-none"
          />
          <LiveError className="mt-0 text-xs text-red-500 bg-red-100 rounded-md rounded-t-none" />
          <CopyButton code={source} top={top} />
        </LiveProvider>
      </div>
    );
  }

  if (render) {
    return (
      <div>
        <LiveProvider
          theme={prismTheme}
          language={language}
          code={source}
          transformCode={rawCode =>
            transformer(rawCode, language, props.noInline)
          }
          scope={reactLivescope}
          {...props}
        >
          <LivePreview style={{ fontFamily: "'Inter', sans-serif" }} />
        </LiveProvider>
      </div>
    );
  }

  return (
    <StaticCode noCopy={noCopy} className={className} {...props}>
      {source}
    </StaticCode>
  );
};
