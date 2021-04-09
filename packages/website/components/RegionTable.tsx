import React from "react";
import { Box, BoxProps } from "@renderlesskit/react-tailwind";

export function RegionTable({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: BoxProps) {
  return (
    <Box
      as="div"
      role="region"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={0}
      className="region-table relative mt-8"
    >
      <Box as="table" className="border-0 outline-none" {...props} />
    </Box>
  );
}
