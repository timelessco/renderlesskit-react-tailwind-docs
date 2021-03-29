import React from "react";
import dracula from "prism-react-renderer/themes/dracula";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

const CodeBlock = ({ children, className }) => {
  const language = className?.replace(/language-/, "");
  return (
    <div>
      <LiveProvider
        theme={dracula}
        language={language}
        code={children}
        transformCode={(rawCode) => {
          const code = rawCode
            // remove imports
            .replace(/((^|)import[^;]+[; ]+)+/gi, "")
            // replace `export default => {*};` with `render(() => {*});`
            .replace(
              /export default \(\) => {((.|\n)*)};/,
              "render(() => {$1});"
            )
            // replace `export default => (*);` with `render(*);`
            .replace(/export default \(\) => \(((.|\n)*)\);/, "render($1);")
            // replace `export default => *;` with `render(*);`
            .replace(/export default \(\) => ((.|\n)*);/, "render($1);");

          return `<>${code}</>`;
        }}
        scope={{
          React,
        }}
      >
        <LivePreview className="p-2 mx-2 rounded-md" />
        <LiveEditor className="p-2 mx-2 rounded-md" />
        <LiveError className="p-2 mx-2 rounded-md text-xs bg-red-100 text-red-500" />
      </LiveProvider>
    </div>
  );
};

export default CodeBlock;
