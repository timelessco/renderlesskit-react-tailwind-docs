import React from "react";
import { Box, IconButton, useTheme } from "@renderlesskit/react-tailwind";
import { InfoCircleIcon } from "@renderlesskit/react-tailwind";
import { RegionTable } from "./RegionTable";
import get from "lodash.get";

import {
  usePopoverState,
  Popover as ReakitPopover,
  PopoverDisclosure,
  PopoverArrow,
} from "reakit/Popover";

type PropDef = {
  name: string;
  themeKey?: string;
  required?: boolean;
  default?: string | boolean;
  type: string;
  typeSimple: string;
  description?: string;
};

type PopoverTypes = {
  children: React.ReactNode;
  content: React.ReactNode;
  label?: string;
};
function Popover({ children, content, label }: PopoverTypes) {
  const popover = usePopoverState({ placement: "top" });
  return (
    <>
      <PopoverDisclosure className="text-sm mx-2" {...popover}>
        {children}
      </PopoverDisclosure>
      <ReakitPopover
        {...popover}
        aria-label={label || ""}
        className="bg-white shadow-lg text-gray-800 rounded-md border-none outline-none text-sm px-2 py-2 max-w-sm"
      >
        <PopoverArrow size="12px" style={{ fill: "white" }} {...popover} />
        {content}
      </ReakitPopover>
    </>
  );
}

type PropsTableProps = {
  data: PropDef[];
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function PropsTable({
  data,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: PropsTableProps) {
  const theme = useTheme();
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);

  return (
    <RegionTable
      className="w-full p-left border-collapse"
      aria-label={hasAriaLabel ? ariaLabel : "Component Props"}
      aria-labelledby={ariaLabelledBy}
    >
      <thead>
        <tr className="bg-transparent">
          <Box
            as="th"
            className="px-2 py-2 border-0 border-b-0 border-gray-500"
          >
            <p className="text-gray-800">Prop</p>
          </Box>
          <Box
            as="th"
            className="px-2 py-2 border-0 border-b-0 border-gray-500"
          >
            <p className="text-gray-800">Type</p>
          </Box>
          <Box
            as="th"
            className="px-2 py-2 border-0 border-b-0 border-gray-500"
          >
            <p className="text-gray-800">Default</p>
          </Box>
        </tr>
      </thead>
      <tbody>
        {data.map(
          (
            {
              name,
              themeKey,
              type,
              typeSimple,
              required,
              default: defaultValue,
              description,
            },
            i
          ) => (
            <tr className="bg-transparent" key={`${name}-${i}`}>
              <Box as="td" className="border-0 border-b-0 border-gray-500">
                <code>
                  {name}
                  {required ? "*" : null}
                </code>
                {description && (
                  <Popover content={description}>
                    <IconButton
                      aria-label="Prop description"
                      size="sm"
                      variant="secondary"
                    >
                      <InfoCircleIcon />
                    </IconButton>
                  </Popover>
                )}
              </Box>
              <Box as="td" className="border-0 border-b-0 border-gray-500">
                <code className="text-gray-800">
                  {themeKey ? "union" : Boolean(typeSimple) ? typeSimple : type}
                </code>
                {!!typeSimple && (
                  <Popover
                    content={
                      <code className="bg-blue-100 text-blue-800 px-2 py-1">
                        {type}
                      </code>
                    }
                  >
                    <IconButton
                      size="sm"
                      variant="secondary"
                      aria-label="See full type"
                    >
                      <InfoCircleIcon />
                    </IconButton>
                  </Popover>
                )}
                {!!themeKey && (
                  <Popover
                    content={
                      <code className="bg-blue-100 text-blue-800 px-2 py-1">
                        {Object.keys(get(theme, themeKey)).join(" | ")}
                      </code>
                    }
                  >
                    <IconButton
                      size="sm"
                      variant="secondary"
                      aria-label="See full type"
                    >
                      <InfoCircleIcon />
                    </IconButton>
                  </Popover>
                )}
              </Box>
              <Box as="td" className="border-0 border-b-0 border-gray-500">
                {!!defaultValue ? (
                  <code className="text-gray-800">{defaultValue}</code>
                ) : (
                  "-"
                )}
              </Box>
            </tr>
          )
        )}
      </tbody>
    </RegionTable>
  );
}
