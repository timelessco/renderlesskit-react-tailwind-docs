import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import "focus-visible";
import { SkipNavContent, SkipNavLink } from "@reach/skip-nav";
import { ThemeProvider } from "next-themes";
import innerText from "react-innertext";
import cn from "classnames";
import Slugger from "github-slugger";

import flatten from "./utils/flatten";
import cleanupAndReorder from "./utils/cleanup-and-reorder";

import Search from "./search";
import StorkSearch from "./stork-search";
import GitHubIcon from "./icons/github-icon";
import ThemeSwitch from "./theme-switch";
import LocaleSwitch from "./locale-switch";
import Footer from "./footer";
import renderComponent from "./utils/render-component";

import Theme from "./misc/theme";
import { ActiveAnchor, useActiveAnchor } from "./misc/active-anchor";
import defaultConfig from "./misc/default.config";

const TreeState = new Map();
const titleType = ["h1", "h2", "h3", "h4", "h5", "h6"];
const MenuContext = createContext(false);

const getFSRoute = (asPath, locale) => {
  if (!locale) return asPath.replace(new RegExp("/index(/|$)"), "$1");

  return asPath
    .replace(new RegExp(`\\.${locale}(\\/|$)`), "$1")
    .replace(new RegExp("/index(/|$)"), "$1");
};

function Folder({ item, anchors }) {
  const { asPath, locale } = useRouter();
  const route = getFSRoute(asPath, locale) + "/";
  const active = route === item.route + "/";
  const open = TreeState[item.route] ?? true;
  // eslint-disable-next-line no-unused-vars
  const [_, render] = useState(false);

  useEffect(() => {
    if (active) {
      TreeState[item.route] = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <li className={open ? "active" : ""}>
      <button
        onClick={() => {
          if (active) return;
          TreeState[item.route] = !open;
          render(x => !x);
        }}
      >
        {item.title}
      </button>
      <div
        style={{
          display: open ? "initial" : "none",
        }}
      >
        <Menu dir={item.children} base={item.route} anchors={anchors} />
      </div>
    </li>
  );
}

function File({ item, anchors }) {
  const { setMenu } = useContext(MenuContext);
  const { asPath, locale } = useRouter();
  const route = getFSRoute(asPath, locale) + "/";
  const active = route === item.route + "/";
  const slugger = new Slugger();
  const activeAnchor = useActiveAnchor();

  let title = item.title;
  const shouldPreventChildAnchors = item.title.startsWith("> ");
  if (anchors && anchors.length && !shouldPreventChildAnchors) {
    if (active) {
      let activeIndex = 0;
      const anchorInfo = anchors.map((anchor, i) => {
        const text = innerText(anchor) || "";
        const slug = slugger.slug(text);
        if (activeAnchor[slug]) {
          activeIndex = i;
        }
        return { text, slug };
      });

      return (
        <li className={active ? "active" : ""}>
          <Link href={item.route}>
            <a>{title}</a>
          </Link>
          <ul>
            {anchors.map((_, i) => {
              const { slug, text } = anchorInfo[i];
              const isActive = i === activeIndex;

              return (
                <a
                  href={"#" + slug}
                  key={`a-${slug}`}
                  onClick={() => setMenu(false)}
                  className={isActive ? "active-anchor" : ""}
                >
                  <span className="flex text-sm">
                    <span className="opacity-25">#</span>
                    <span className="mr-2"></span>
                    <span className="inline-block">{text}</span>
                  </span>
                </a>
              );
            })}
          </ul>
        </li>
      );
    }
  }

  if (shouldPreventChildAnchors) {
    title = title.substr(2);
  }

  return (
    <li className={active ? "active" : ""}>
      <Link href={item.route}>
        <a onClick={() => setMenu(false)}>{title}</a>
      </Link>
    </li>
  );
}

function Menu({ dir, anchors }) {
  return (
    <ul>
      {dir.map(item => {
        if (item.children) {
          return <Folder key={item.name} item={item} anchors={anchors} />;
        }
        return <File key={item.name} item={item} anchors={anchors} />;
      })}
    </ul>
  );
}

function Sidebar({ show, directories, anchors }) {
  return (
    <aside
      className={`h-screen bg-white dark:bg-dark flex-shrink-0 w-full md:w-64 md:block fixed md:sticky z-10 ${
        show ? "" : "hidden"
      }`}
      style={{
        top: "4rem",
        height: "calc(100vh - 4rem)",
      }}
    >
      <div className="w-full h-full p-4 pb-40 overflow-y-auto border-gray-200 sidebar dark:border-gray-900 md:pb-16">
        <Menu dir={directories} anchors={anchors} />
      </div>
    </aside>
  );
}

const Layout = ({ filename, config: _config, pageMap, meta, children }) => {
  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const { route, asPath, locale, defaultLocale } = router;
  const fsPath = getFSRoute(asPath, locale);

  const directories = useMemo(
    () => cleanupAndReorder(pageMap, locale, defaultLocale),
    [pageMap, locale, defaultLocale],
  );
  const flatDirectories = useMemo(() => flatten([directories]), [directories]);
  const config = Object.assign({}, defaultConfig, _config);

  const filepath = route.slice(0, route.lastIndexOf("/") + 1);
  const filepathWithName = filepath + filename;
  const titles = React.Children.toArray(children).filter(child =>
    titleType.includes(child.props.mdxType),
  );
  const titleEl = titles.find(child => child.props.mdxType === "h1");
  const title =
    meta.title || (titleEl ? innerText(titleEl.props.children) : "Untitled");
  const anchors = titles
    .filter(child => child.props.mdxType === "h2")
    .map(child => child.props.children);

  useEffect(() => {
    if (menu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [menu]);

  const currentIndex = useMemo(
    () => flatDirectories.findIndex(dir => dir.route === fsPath),
    [flatDirectories, fsPath],
  );

  const isRTL = useMemo(() => {
    if (!config.i18n) return config.direction === "rtl" || null;
    const localeConfig = config.i18n.find(l => l.locale === locale);
    return localeConfig && localeConfig.direction === "rtl";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.i18n, locale]);

  return (
    <React.Fragment>
      <Head>
        {config.font ? (
          <link
            href="https://fonts.googleapis.com/css2?family=Inter"
            rel="stylesheet"
            crossOrigin="anonymous"
          />
        ) : null}
        <title>
          {title}
          {renderComponent(config.titleSuffix, { locale })}
        </title>
        {config.font ? (
          <style
            dangerouslySetInnerHTML={{
              __html: `html{font-family:Inter,sans-serif}@supports(font-variation-settings:normal){html{font-family:'Inter var',sans-serif}}`,
            }}
          />
        ) : null}
        {renderComponent(config.head, { locale })}
      </Head>
      <SkipNavLink />
      <div
        className={cn("nextra-container main-container flex flex-col", {
          rtl: isRTL,
        })}
      >
        <nav className="fixed top-0 left-0 right-0 z-20 flex items-center h-16 px-6 bg-white border-b border-gray-200 dark:bg-dark dark:border-gray-900">
          <div className="flex items-center hidden w-full md:block">
            <Link href="/">
              <a className="inline-block text-xl text-current no-underline hover:opacity-75">
                {renderComponent(config.logo, { locale })}
              </a>
            </Link>
          </div>

          {config.customSearch ||
            (config.search ? (
              config.UNSTABLE_stork ? (
                <StorkSearch />
              ) : (
                <Search directories={flatDirectories} />
              )
            ) : null)}

          <div className="mr-2" />

          {config.darkMode ? <ThemeSwitch /> : null}

          {config.i18n ? (
            <LocaleSwitch options={config.i18n} isRTL={isRTL} />
          ) : null}

          {config.repository ? (
            <a
              className="p-2 text-current"
              href={config.repository}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon height={24} />
            </a>
          ) : null}

          <button
            className="block p-2 md:hidden"
            onClick={() => setMenu(!menu)}
          >
            <svg
              fill="none"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="-mr-2" />
        </nav>
        <ActiveAnchor>
          <div className="flex flex-1 h-full">
            <MenuContext.Provider value={{ setMenu }}>
              <Sidebar
                show={menu}
                anchors={anchors}
                directories={directories}
              />
            </MenuContext.Provider>
            <SkipNavContent />
            {meta.full ? (
              <article className="relative w-full pt-16 overflow-x-hidden">
                {children}
              </article>
            ) : (
              <article className="relative w-full max-w-full px-6 pt-20 pb-16 overflow-x-hidden docs-container md:px-8">
                <main className="max-w-screen-md mx-auto">
                  <Theme>{children}</Theme>
                  <Footer
                    config={config}
                    flatDirectories={flatDirectories}
                    currentIndex={currentIndex}
                    filepathWithName={filepathWithName}
                    isRTL={isRTL}
                  />
                </main>
              </article>
            )}
          </div>
        </ActiveAnchor>
      </div>
    </React.Fragment>
  );
};

export default (opts, config) => props => {
  return (
    <ThemeProvider attribute="class">
      <Layout config={config} {...opts} {...props} />
    </ThemeProvider>
  );
};
