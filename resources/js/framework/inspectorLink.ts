import { usePage } from '@inertiajs/vue3';
import { watch } from 'vue';

/**
 * Builds a link that opens a record page in the inspector beside the current page, keeping the page's own query: the
 * page's key as inspect and the record's route values.
 */
export function useInspectorLink(): (
    page: string,
    record: Record<string, string>,
) => string {
    const current = usePage();

    return (page, record) => {
        const url = new URL(current.url, 'http://journal.local');
        url.searchParams.set('inspect', page);

        for (const [name, value] of Object.entries(record)) {
            url.searchParams.set(name, value);
        }

        return `${url.pathname}${url.search}`;
    };
}

/**
 * Calls back once the inspector closes, so the control that opened it can take the focus back.
 */
export function onInspectorClosed(callback: () => void): void {
    const current = usePage();

    watch(
        () => new URL(current.url, 'http://journal.local').searchParams.has('inspect'),
        (isOpen, wasOpen) => {
            if (wasOpen && !isOpen) {
                callback();
            }
        },
    );
}
