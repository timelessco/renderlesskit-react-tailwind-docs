import React from "react";

// https://www.notion.so/Callout-blocks-5b2638247b54447eb2e21145f97194b0
export default ({
  children,
  background = "bg-orange-100 dark:text-gray-800",
  emoji = "💡",
}) => {
  return (
    <div className={`${background} flex rounded-lg callout mt-6`}>
      <div
        className="py-2 pl-3 pr-2 text-xl select-none"
        style={{
          fontFamily:
            '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
      >
        {emoji}
      </div>
      <div className="py-2 pr-4">{children}</div>
    </div>
  );
};
