import { usePage } from '@inertiajs/vue3';
import { inject, provide } from 'vue';

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
