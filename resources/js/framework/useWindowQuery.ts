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

/**
 * Asks the server again for this window's prop alone, with extra query values for this window only, such as a list's
 * next cursor: on Home inside its own window[<key>] part, elsewhere plainly. The answer replaces the prop while the
 * window keeps what it shows.
 */
export function useWindowReload(): (
  values: Record<string, string | string[]>,
  callbacks: {
    onNetworkError: () => boolean;
    onHttpException: (response: { status: number }) => boolean;
  },
) => void {
  const key = inject<string | null>(WINDOW_KEY, null);
  const prop = useHostProp();

  return (values, callbacks) => {
    if (key === null) {
      router.reload({ only: [prop], data: values, ...callbacks });

      return;
    }

    const url = new URL(window.location.href);
    const prefix = `window[${key}]`;

    for (const [name, value] of Object.entries(values)) {
      const param = `${prefix}[${name}]`;

      for (const kept of [...url.searchParams.keys()]) {
        if (kept === param || kept.startsWith(`${param}[`)) {
          url.searchParams.delete(kept);
        }
      }

      for (const [index, each] of (Array.isArray(value) ? value : [value]).entries()) {
        if (each !== "") {
          url.searchParams.set(Array.isArray(value) ? `${param}[${index}]` : param, each);
        }
      }
    }

    router.visit(`${url.pathname}${url.search}`, {
      only: [prop],
      preserveState: true,
      preserveScroll: true,
      replace: true,
      async: true,
      ...callbacks,
    });
  };
}
