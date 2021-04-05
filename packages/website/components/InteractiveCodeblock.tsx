import React from "react";
import CodeBlock from "codeblock";
import {
  Checkbox,
  CheckboxStatus,
  useTheme,
} from "@renderlesskit/react-tailwind";
import get from "lodash.get";

type InteractiveCodeblockProps = {
  booleanProps: string[];
  unionProps: any[];
  templateFn: ({
    booleanProps,
    unionProps,
  }: {
    booleanProps: boolean[];
    unionProps: any[];
  }) => string;
};

const InteractiveCodeblock: React.FC<InteractiveCodeblockProps> = ({
  templateFn,
  booleanProps,
  unionProps,
}) => {
  const theme = useTheme();
  const [booleanState, onBooleanStateChange] = React.useState<CheckboxStatus>(
    [],
  );
  const [unionState, setUnionStates] = React.useState<{}>({});

  return (
    <div className="mt-6">
      <CodeBlock
        live
        children={templateFn({
          booleanProps: booleanState as any,
          unionProps: Object.keys(unionState).map(
            name => `${name}="${unionState[name]}"`,
          ) as any,
        })}
      />
      <div className="mt-2 space-x-2 flex items-center">
        {booleanProps.map(value => {
          return (
            <Checkbox
              state={booleanState}
              onStateChange={onBooleanStateChange}
              value={value}
            >
              {value}
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
                <option value={size}>{size}</option>
              ))}
            </select>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveCodeblock;
