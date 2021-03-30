import { Alert, AlertProps } from "@renderlesskit/react-tailwind";

const Callout = ({
  children,
  ...props
}: Omit<AlertProps, "title"> & { children: string }) => {
  return <Alert title={children} {...props} />;
};

export default Callout;
