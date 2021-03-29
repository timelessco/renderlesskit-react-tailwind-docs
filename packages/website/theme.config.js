// theme.config.js
export default {
  repository: "https://github.com/timelessco/renderlesskit-react-tailwind", // project repo
  docsRepository: "https://github.com/timelessco/renderlesskit-react-tailwind", // docs repo
  path: "/", // path of docs
  titleSuffix: " – Renderlesskit",
  nextLinks: true,
  prevLinks: true,
  search: true,
  footerEditOnGitHubLink: true, // will link to the docs repo
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Renderlesskit React Tailwind" />
      <meta name="og:title" content="Renderlesskit React Tailwind" />
    </>
  ),
};
