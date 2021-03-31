import { Button, ButtonGroup } from "@renderlesskit/react-tailwind";
import { Link } from "@renderlesskit/react";
import { SiStorybook, SiGithub } from "react-icons/si";

type ComponentLinkProps = {
  github: string;
  story: string;
  theme: string;
};

const ComponentLinks: React.FC<ComponentLinkProps> = ({
  github,
  story,
  theme,
}) => {
  const githubBase =
    "https://github.com/timelessco/renderlesskit-react-tailwind/tree/main/src/";
  const themeBase =
    "https://github.com/timelessco/renderlesskit-react-tailwind/tree/main/src/theme/defaultTheme/";
  const storybookBase =
    "https://renderlesskit-react-tailwind.vercel.app/?path=/story/";

  return (
    <ButtonGroup size="md" className="mt-5">
      {github && (
        <Button
          as={Link}
          isExternal
          variant="outline"
          className="no-underline"
          prefix={<SiGithub />}
          href={`${githubBase}${github}`}
        >
          View source
        </Button>
      )}

      {theme && (
        <Button
          as={Link}
          isExternal
          variant="outline"
          className="no-underline"
          prefix={<SiGithub />}
          href={`${themeBase}${theme}.ts`}
        >
          View theme source
        </Button>
      )}

      {story && (
        <Button
          as={Link}
          isExternal
          variant="outline"
          className="no-underline"
          prefix={<SiStorybook />}
          href={`${storybookBase}${story}`}
        >
          View storybook
        </Button>
      )}
    </ButtonGroup>
  );
};

export default ComponentLinks;
