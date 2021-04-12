import React from "react";
import get from "lodash.get";
import { CodeBlock } from "codeblock";
import { Checkbox, runIfFn, useTheme } from "@renderlesskit/react-tailwind";

type TemplateFunctionProps = {
  booleanProps: string[];
  themeProps: string[];
  choiceProps: string[];
  spreadProps: string;
  props: Record<string, any>;
};
type TemplateFunction = (props: TemplateFunctionProps) => string;

type InteractiveCodeblockProps = {
  booleanProps: string[];
  themeProps: Record<string, string>;
  choiceProps: Record<string, string[]>;
  children?: TemplateFunction;
};

const selectStyles =
  "mt-1 mr-2 block pl-2 pr- py-2 text-sm bg-gray-200 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md";
const wrapperStyles = "mt-2 flex items-center flex-wrap";

const InteractiveCodeblock = (props: InteractiveCodeblockProps) => {
  const {
    children = "",
    themeProps = {},
    choiceProps = {},
    booleanProps = [],
  } = props;

  const theme = useTheme();
  const [booleanStates, onBooleanStateChange] = React.useState<
    Record<string, boolean>
  >({});
  const [themeStates, setThemeStates] = React.useState<Record<string, string>>(
    {},
  );
  const [choiceStates, setChoiceState] = React.useState<Record<string, any>>(
    {},
  );

  const finalBooleanProps = Object.keys(booleanStates).filter(
    key => booleanStates[key],
  );
  const finalThemeProps = Object.keys(themeStates).map(key =>
    mapThemeProps(key, themeStates),
  );
  const finalChoiceProps = Object.keys(choiceStates).map(key =>
    mapChoiceProps(key, choiceStates),
  );

  const spreadProps = [finalBooleanProps, finalThemeProps, finalChoiceProps]
    .map(printProps)
    .join("")
    .trimEnd()
    .replace(/\s\s+/, " ");

  const code = runIfFn(children, {
    spreadProps,
    themeProps: finalThemeProps,
    choiceProps: finalChoiceProps,
    booleanProps: finalBooleanProps,
    props: { ...themeStates, ...booleanStates, ...choiceStates },
  });

  return (
    <div className="mt-6">
      <CodeBlock live children={code} />
      <div className={wrapperStyles}>
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
      <div className={wrapperStyles}>
        {Object.keys(themeProps).map(name => {
          const themeKey = themeProps[name];
          return (
            <select
              key={name}
              name={name}
              className={selectStyles}
              value={themeStates[name]}
              onChange={event =>
                setThemeStates(prev => ({
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
        {Object.keys(choiceProps).map(name => {
          const values = choiceProps[name];

          return (
            <select
              key={name}
              name={name}
              className={selectStyles}
              value={choiceStates[name]}
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

const mapThemeProps = (name: string, unions: Record<string, any>) => {
  return unions[name] && `${name}="${unions[name]}"`;
};
const mapChoiceProps = (name: string, unions: Record<string, any>) => {
  return unions[name] && `${name}={${unions[name]}}`;
};

const printProps = (props: string[]) => {
  return " " + props.filter(Boolean).join(" ");
};
