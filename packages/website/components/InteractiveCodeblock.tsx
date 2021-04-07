import React from "react";
import get from "lodash.get";
import { CodeBlock } from "codeblock";
import { Checkbox, useTheme } from "@renderlesskit/react-tailwind";

type TemplateFunction = (props: {
  booleanProps: string[];
  unionProps: string[];
  spreadProps: string;
  props: Record<string, any>;
}) => string;

type InteractiveCodeblockProps = {
  booleanProps: string[];
  unionProps: Record<string, string>;
  templateFn: TemplateFunction;
};

const mapUnionProps = (name: string, unions: Record<string, any>) =>
  `${name}="${unions[name]}"`;

const InteractiveCodeblock: React.FC<InteractiveCodeblockProps> = ({
  templateFn,
  booleanProps = [],
  unionProps = {},
}) => {
  const theme = useTheme();
  const [booleanState, onBooleanStateChange] = React.useState<
    Record<string, boolean>
  >({});
  const [unionState, setUnionStates] = React.useState<Record<string, string>>(
    {},
  );

  const finalBooleanProps = Object.keys(booleanState).filter(
    key => booleanState[key],
  );
  const finalUnionProps = Object.keys(unionState).map(key =>
    mapUnionProps(key, unionState),
  );

  const printProps = (props: string[]) =>
    props.length > 0 ? ` ${props.join(" ")}` : "";

  const code = templateFn({
    booleanProps: finalBooleanProps,
    unionProps: finalUnionProps,
    spreadProps: `${printProps(finalBooleanProps)}${printProps(
      finalUnionProps,
    )}`,
    props: { ...unionState, ...booleanState },
  });

  return (
    <div className="mt-6">
      <CodeBlock live children={code} />
      <div className="mt-2 space-x-2 flex items-center">
        {booleanProps.map(name => {
          return (
            <Checkbox
              key={name}
              onStateChange={value => {
                onBooleanStateChange(prev => ({ ...prev, [name]: !!value }));
              }}
            >
              {name}
            </Checkbox>
          );
        })}
      </div>
      <div className="mt-2 space-x-2 flex items-center">
        {Object.keys(unionProps).map(name => {
          const themeKey = unionProps[name];
          return (
            <select
              className="mt-1 block pl-3 pr-10 py-2 text-base bg-gray-200 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              name={name}
              value={unionState[name]}
              onChange={event =>
                setUnionStates(prev => ({
                  ...prev,
                  [name]: event.target.value,
                }))
              }
            >
              {Object.keys(get(theme, themeKey)).map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveCodeblock;
