// theme.config.js
export default {
  repository: "https://github.com/timelessco/renderlesskit-react-tailwind", // project repo
  docsRepository: "https://github.com/timelessco/renderlesskit-react-tailwind", // docs repo
  path: "/", // path of docs
  titleSuffix: " – Timeless",
  search: true,
  UNSTABLE_stork: true,
  darkMode: true,
  nextLinks: true,
  prevLinks: true,
  footer: true,
  footerEditOnGitHubLink: true,
  logo: (
    <span className="hidden mr-2 font-extrabold md:inline">
      RenderlessKit React Tailwind
    </span>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="og:title" content="Renderlesskit React Tailwind" />
      <meta name="description" content="Renderlesskit React Tailwind" />
      <meta name="og:description" content="Renderlesskit React Tailwind" />
    </>
  ),
  footerText: <>MIT {new Date().getFullYear()} © Timeless.</>,
};
