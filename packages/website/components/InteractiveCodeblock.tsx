import React from "react";
import get from "lodash.get";
import { CodeBlock } from "codeblock";
import { Checkbox, useTheme } from "@renderlesskit/react-tailwind";

type TemplateFunction = (props: {
  booleanProps: string[];
  unionProps: string[];
  choiceProps: string[];
  spreadProps: string;
  props: Record<string, any>;
}) => string;

type InteractiveCodeblockProps = {
  booleanProps: string[];
  unionProps: Record<string, string>;
  choiceProps: Record<string, any[]>;
  templateFn: TemplateFunction;
};

const mapUnionProps = (name: string, unions: Record<string, any>) =>
  unions[name] && `${name}="${unions[name]}"`;
const mapChoiceProps = (name: string, unions: Record<string, any>) =>
  unions[name] && `${name}={${unions[name]}}`;

const selectStyles =
  "mt-1 block pl-2 pr- py-2 text-sm bg-gray-200 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md";

const InteractiveCodeblock: React.FC<InteractiveCodeblockProps> = ({
  templateFn,
  booleanProps = [],
  unionProps = {},
  choiceProps = {},
}) => {
  const theme = useTheme();
  const [booleanState, onBooleanStateChange] = React.useState<
    Record<string, boolean>
  >({});
  const [unionState, setUnionStates] = React.useState<Record<string, string>>(
    {},
  );
  const [choiceState, setChoiceState] = React.useState<Record<string, any>>({});

  const finalBooleanProps = Object.keys(booleanState).filter(
    key => booleanState[key],
  );
  const finalUnionProps = Object.keys(unionState).map(key =>
    mapUnionProps(key, unionState),
  );

  const finalChoiceProps = Object.keys(choiceState)
    .filter(Boolean)
    .map(key => mapChoiceProps(key, choiceState));

  const printProps = (props: string[]) =>
    props.length > 0 ? ` ${props.filter(Boolean).join(" ")}` : "";

  const code = templateFn({
    booleanProps: finalBooleanProps,
    unionProps: finalUnionProps,
    spreadProps: `${printProps(finalBooleanProps)}${printProps(
      finalUnionProps,
    )}${printProps(finalChoiceProps)}`,
    choiceProps: finalChoiceProps,
    props: { ...unionState, ...booleanState, ...choiceState },
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
              className={selectStyles}
              name={name}
              value={unionState[name]}
              onChange={event =>
                setUnionStates(prev => ({
                  ...prev,
                  [name]: event.target.value,
                }))
              }
            >
              <option selected value="">
                Choose {name}
              </option>

              {Object.keys(get(theme, themeKey)).map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          );
        })}
      </div>
      <div className="mt-2 space-x-2 flex items-center">
        {Object.keys(choiceProps).map(name => {
          const values = choiceProps[name];

          return (
            <select
              className={selectStyles}
              name={name}
              value={choiceState[name]}
              onChange={event =>
                setChoiceState(prev => ({
                  ...prev,
                  [name]: event.target.value,
                }))
              }
            >
              <option selected value="">
                Choose {name}
              </option>

              {values?.map(value => (
                <option key={value} value={value}>
                  {value}
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
