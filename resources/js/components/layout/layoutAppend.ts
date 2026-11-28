import { usePage } from '@inertiajs/vue3';
import { computed, inject, provide, ref, watch } from 'vue';
import { useAppContext } from '@/framework/appContext';
import { useHostProp } from '@/framework/hostProp';
import { useWindowInstanceKey } from '@/framework/useWindowQuery';
import type { InjectionKey, Ref } from 'vue';

const APPENDING: InjectionKey<Ref<boolean>> = Symbol('journal.layout-append');

/**
 * Lets a layout's Show more tell its rows that the next read adds to them instead of replacing them.
 */
export function provideLayoutAppend(): void {
    const pending = ref(false);
    watch(useLayoutListIdentity(), () => (pending.value = false), { flush: 'sync' });
    provide(APPENDING, pending);
}

/**
 * Whether the read now coming in is added to the rows shown; it is true only while a Show more waits for its answer.
 */
export function useLayoutAppend(): Ref<boolean> {
    return inject(APPENDING, ref(false));
}

/**
 * Identifies the active list independently of its cursor and the query of other panes.
 */
export function useLayoutListIdentity() {
    const page = usePage();
    const { viewer } = useAppContext();
    const host = useHostProp();
    const windowKey = useWindowInstanceKey();
    const prefix = windowKey === null ? null : `window[${windowKey}]`;

    return computed(() => {
        const url = new URL(page.url ?? '/', 'http://journal.local');
        const filters = [...url.searchParams].filter(([name]) =>
            prefix === null
                ? name !== 'after' && !name.startsWith('window[')
                : name.startsWith(`${prefix}[`) && name !== `${prefix}[after]`,
        );

        return JSON.stringify([viewer.value?.id, host, windowKey, url.pathname, filters.sort()]);
    });
}
