import React, {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import matchSorter from "match-sorter";
import cn from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";
import normalizeTitle from "./utils/normalize-title";

const Item = ({ title, active, href, onMouseOver, search }) => {
  const _title = normalizeTitle(title);
  const highlight = _title.toLowerCase().indexOf(search.toLowerCase());

  return (
    <Link href={href}>
      <a className="block no-underline" onMouseOver={onMouseOver}>
        <li className={cn("p-2", { active })}>
          {_title.substring(0, highlight)}
          <span className="highlight">
            {_title.substring(highlight, highlight + search.length)}
          </span>
          {_title.substring(highlight + search.length)}
        </li>
      </a>
    </Link>
  );
};

const Search = ({ directories }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef(null);

  const results = useMemo(() => {
    if (!search) return [];

    // Will need to scrape all the headers from each page and search through them here
    // (similar to what we already do to render the hash links in sidebar)
    // We could also try to search the entire string text from each page
    return matchSorter(directories, search, { keys: ["title"] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleKeyDown = useCallback(
    e => {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (active + 1 < results.length) {
            setActive(active + 1);
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (active - 1 >= 0) {
            setActive(active - 1);
          }
          break;
        }
        case "Enter": {
          router.push(results[active].route);
          break;
        }
        default: {
          break;
        }
      }
    },
    [active, results, router],
  );

  useEffect(() => {
    setActive(0);
  }, [search]);

  useEffect(() => {
    const inputs = ["input", "select", "button", "textarea"];

    const down = e => {
      if (
        document.activeElement &&
        inputs.indexOf(document.activeElement.tagName.toLowerCase()) === -1
      ) {
        if (e.key === "/") {
          e.preventDefault();
          input.current.focus();
        } else if (e.key === "Escape") {
          setShow(false);
        }
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  const renderList = show && results.length > 0;

  return (
    <div className="relative w-full nextra-search md:w-64">
      {renderList && (
        <div className="search-overlay z-1" onClick={() => setShow(false)} />
      )}
      <input
        onChange={e => {
          setSearch(e.target.value);
          setShow(true);
        }}
        className="w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:ring"
        type="search"
        placeholder='Search ("/" to focus)'
        onKeyDown={handleKeyDown}
        onFocus={() => setShow(true)}
        ref={input}
      />
      {renderList && (
        <ul className="absolute left-0 p-0 m-0 mt-1 list-none border divide-y rounded shadow-md md:right-0 top-100 z-2">
          {results.map((res, i) => {
            return (
              <Item
                key={`search-item-${i}`}
                title={res.title}
                href={res.route}
                active={i === active}
                search={search}
                onMouseOver={() => setActive(i)}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Search;
