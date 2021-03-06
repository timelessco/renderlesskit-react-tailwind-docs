import { MDXProvider } from "@mdx-js/react";
import Slugger from "github-slugger";
import Link from "next/link";
import React from "react";
import innerText from "react-innertext";
import "intersection-observer";
import Observer from "@researchgate/react-intersection-observer";

import { CodeBlock } from "codeblock";
import { useActiveAnchorSet } from "./active-anchor";

// Anchor links
const HeaderLink = ({
  tag: Tag,
  children,
  slugger,
  withObserver,
  ...props
}) => {
  const setActiveAnchor = useActiveAnchorSet();

  const slug = slugger.slug(innerText(children) || "");
  const anchor = <span className="subheading-anchor" id={slug} />;
  const anchorWithObserver = withObserver ? (
    <Observer
      onChange={e => {
        // if the element is above the 70% of height of the viewport
        // we don't use e.isIntersecting
        const isAboveViewport =
          e.boundingClientRect.y + e.boundingClientRect.height <=
          e.rootBounds.y + e.rootBounds.height;
        setActiveAnchor(f => ({ ...f, [slug]: isAboveViewport }));
      }}
      rootMargin="1000% 0% -70%"
      threshold={[0, 1]}
      children={anchor}
    />
  ) : (
    anchor
  );

  return (
    <Tag {...props}>
      {anchorWithObserver}
      <a href={"#" + slug} className="text-current no-underline no-outline">
        {children}
        <span className="anchor-icon" aria-hidden>
          #
        </span>
      </a>
    </Tag>
  );
};

const H2 =
  ({ slugger }) =>
  ({ children, ...props }) => {
    return (
      <HeaderLink tag="h2" slugger={slugger} withObserver {...props}>
        {children}
      </HeaderLink>
    );
  };

const H3 =
  ({ slugger }) =>
  ({ children, ...props }) => {
    return (
      <HeaderLink tag="h3" slugger={slugger} {...props}>
        {children}
      </HeaderLink>
    );
  };

const H4 =
  ({ slugger }) =>
  ({ children, ...props }) => {
    return (
      <HeaderLink tag="h4" slugger={slugger} {...props}>
        {children}
      </HeaderLink>
    );
  };

const H5 =
  ({ slugger }) =>
  ({ children, ...props }) => {
    return (
      <HeaderLink tag="h5" slugger={slugger} {...props}>
        {children}
      </HeaderLink>
    );
  };

const H6 =
  ({ slugger }) =>
  ({ children, ...props }) => {
    return (
      <HeaderLink tag="h6" slugger={slugger} {...props}>
        {children}
      </HeaderLink>
    );
  };

const A = ({ children, ...props }) => {
  const isExternal = props.href && props.href.startsWith("https://");
  if (isExternal) {
    return (
      <a target="_blank" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={props.href}>
      <a {...props}>{children}</a>
    </Link>
  );
};

const Table = ({ children }) => {
  return (
    <div className="table-container">
      <table>{children}</table>
    </div>
  );
};

const getComponents = args => ({
  h2: H2(args),
  h3: H3(args),
  h4: H4(args),
  h5: H5(args),
  h6: H6(args),
  a: A,
  pre: props => {
    if (props?.children?.props?.live === true) {
      return (
        <pre style={{ background: "transparent", padding: 1 }} {...props} />
      );
    }
    return <pre {...props} />;
  },
  code: CodeBlock,
  table: Table,
});

export default ({ children }) => {
  const slugger = new Slugger();
  return (
    <MDXProvider components={getComponents({ slugger })}>
      {children}
    </MDXProvider>
  );
};
