import { Alert, AlertProps } from "@renderlesskit/react-tailwind";

type CalloutProps = Omit<AlertProps, "title"> & { children: string };

const Callout = ({ children, ...props }: CalloutProps) => {
  return <Alert title={children} {...props} />;
};

export default Callout;
