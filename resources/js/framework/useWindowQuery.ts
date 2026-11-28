import { shouldIntercept } from "@inertiajs/core";
import type { FormDataConvertible, ReloadOptions } from "@inertiajs/core";
import { router, usePage } from "@inertiajs/vue3";
import { inject, provide } from "vue";
import { useHostProp } from "./hostProp";

const WINDOW_KEY = Symbol("journal.window");

/**
 * Marks everything under a window host as that window, so its links write its own part of the page's query.
 */
export function provideWindowKey(key: string): void {
  provide(WINDOW_KEY, key);
}

/**
 * Whether this component is shown inside a window host, such as a window on Home, rather than as its own page; a
 * window leaves the page's title and heading to the page around it.
 */
export function useIsInWindow(): boolean {
  return inject<string | null>(WINDOW_KEY, null) !== null;
}

/**
 * Builds a link that changes only this window's query: on Home its own window[<key>][...] part, keeping every other
 * window's, and on its own page the plain query. Empty values are left out.
 */
export function useWindowQuery(): (
  query: Record<string, string | number | undefined>,
) => string {
  const page = usePage();
  const key = inject<string | null>(WINDOW_KEY, null);

  return (query) => {
    const url = new URL(page.url, "http://journal.local");
    const prefix = key === null ? null : `window[${key}]`;
    const names = [...url.searchParams.keys()];

    for (const name of names) {
      if (prefix === null || name.startsWith(`${prefix}[`)) {
        url.searchParams.delete(name);
      }
    }

    for (const [name, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(
          prefix === null ? name : `${prefix}[${name}]`,
          String(value),
        );
      }
    }

    return `${url.pathname}${url.search}`;
  };
}

/**
 * The name a key of this window's query has in the page's address: on Home window[<key>][<name>], on its own page the
 * plain name.
 */
export function useWindowParam(): (name: string) => string {
  const key = inject<string | null>(WINDOW_KEY, null);

  return (name) => (key === null ? name : `window[${key}][${name}]`);
}

/**
 * Builds a link that changes only the named keys of this window's query and keeps every other key, of this window and
 * of the others; a key given undefined is removed.
 */
export function useWindowQueryChange(): (
  changes: Record<string, string | undefined>,
) => string {
  const page = usePage();
  const key = inject<string | null>(WINDOW_KEY, null);

  return (changes) => {
    const url = new URL(page.url, "http://journal.local");

    for (const [name, value] of Object.entries(changes)) {
      const param = key === null ? name : `window[${key}][${name}]`;

      if (value === undefined || value === "") {
        url.searchParams.delete(param);
      } else {
        url.searchParams.set(param, value);
      }
    }

    return `${url.pathname}${url.search}`;
  };
}

type WindowQueryChanges = Record<string, string | string[] | undefined>;
type WindowQuery = Record<string, FormDataConvertible>;
type WindowReloadOptions = Omit<ReloadOptions, "only" | "data">;

function addQueryValue(query: WindowQuery, parts: string[], value: string): void {
  const [key, ...rest] = parts;

  if (key === undefined || key === "__proto__") {
    return;
  }

  if (rest.length === 0) {
    query[key] = value;
    return;
  }

  if (rest[0] === "") {
    const values = query[key];
    query[key] = Array.isArray(values) ? [...values, value] : [value];
    return;
  }

  const existing = query[key];
  const branch: WindowQuery =
    typeof existing === "object" && existing !== null && !Array.isArray(existing)
      ? (existing as WindowQuery)
      : Object.create(null);
  addQueryValue(branch, rest, value);
  query[key] = branch;
}

/**
 * Inertia replaces top-level query keys. Include the other copies when replacing the window branch.
 */
export function windowQueryData(key: string, values: WindowQueryChanges): { window: WindowQuery } {
  const query: WindowQuery = Object.create(null);
  const url = new URL(window.location.href);

  for (const [name, value] of url.searchParams) {
    if (name.startsWith("window[")) {
      const parts = Array.from(name.matchAll(/\[([^\]]*)\]/g), (match) => match[1]);
      addQueryValue(query, parts, value);
    }
  }

  const changed = Object.fromEntries(
    Object.entries(values).map(([name, value]) => [name, value === "" ? undefined : value]),
  );
  query[key] = { ...(query[key] as WindowQuery | undefined), ...changed };

  return { window: query };
}

/**
 * Asks for the visible host alone and carries the rest of the current address through the reload.
 */
export function reloadWindow(
  prop: string,
  key: string | null,
  values: WindowQueryChanges,
  options: WindowReloadOptions = {},
): void {
  const data = key === null
    ? Object.fromEntries(
        Object.entries(values).map(([name, value]) => [name, value === "" ? undefined : value]),
      )
    : windowQueryData(key, values);

  router.reload({ only: [prop], data, ...options });
}

export function useWindowReload(): (
  values: WindowQueryChanges,
  options?: WindowReloadOptions,
) => void {
  const key = inject<string | null>(WINDOW_KEY, null);
  const prop = useHostProp();

  return (values, options) => reloadWindow(prop, key, values, options);
}

/**
 * Keeps a query link openable in a new tab and scopes ordinary clicks to its host's prop.
 */
export function useWindowQueryClick(): (event: MouseEvent, query: WindowQueryChanges) => void {
  const reload = useWindowReload();

  return (event, query) => {
    if (shouldIntercept(event)) {
      event.preventDefault();
      reload(query);
    }
  };
}

export function useWindowInstanceKey(): string | null {
  return inject<string | null>(WINDOW_KEY, null);
}
