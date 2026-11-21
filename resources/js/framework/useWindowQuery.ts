import { router, usePage } from '@inertiajs/vue3';
import { inject, provide } from 'vue';
import { useHostProp } from './hostProp';

const WINDOW_KEY = Symbol('journal.window');

/**
 * Marks everything under a window host as that window, so its links write its own part of the page's query.
 */
export function provideWindowKey(key: string): void {
    provide(WINDOW_KEY, key);
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
        const url = new URL(page.url, 'http://journal.local');
        const prefix = key === null ? null : `window[${key}]`;
        const names = [...url.searchParams.keys()];

        for (const name of names) {
            if (prefix === null || name.startsWith(`${prefix}[`)) {
                url.searchParams.delete(name);
            }
        }

        for (const [name, value] of Object.entries(query)) {
            if (value !== undefined && value !== '') {
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
 * Builds a link that changes only the named keys of this window's query and keeps every other key, of this window and
 * of the others; a key given undefined is removed.
 */
export function useWindowQueryChange(): (
    changes: Record<string, string | undefined>,
) => string {
    const page = usePage();
    const key = inject<string | null>(WINDOW_KEY, null);

    return (changes) => {
        const url = new URL(page.url, 'http://journal.local');

        for (const [name, value] of Object.entries(changes)) {
            const param = key === null ? name : `window[${key}][${name}]`;

            if (value === undefined || value === '') {
                url.searchParams.delete(param);
            } else {
                url.searchParams.set(param, value);
            }
        }

        return `${url.pathname}${url.search}`;
    };
}

/**
 * Asks the server again for this window's prop alone, with extra query values for this window only, such as the
 * cursor of a list's next page: on Home inside its own window[<key>] part, on its own page plainly. The answer
 * replaces the prop; the window keeps what it already shows.
 */
export function useWindowReload(): (
    values: Record<string, string>,
    callbacks: { onNetworkError: () => boolean; onHttpException: () => boolean },
) => void {
    const key = inject<string | null>(WINDOW_KEY, null);
    const prop = useHostProp();

    return (values, callbacks) =>
        router.reload({
            only: [prop],
            data: key === null ? values : { window: { [key]: values } },
            ...callbacks,
        });
}
