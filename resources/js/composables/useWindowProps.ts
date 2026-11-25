import { router, usePage } from '@inertiajs/vue3';
import { useAppContext } from '@/framework/appContext';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { SharedPropReads } from './sharedPropReads';
import type { PropReadOutcome } from './sharedPropReads';
import type { WindowResult } from '@/generated/types/page-props';

const sharedReads = new SharedPropReads((propName, ended) => {
    let cancelRead: (() => void) | undefined;
    let outcome: PropReadOutcome = 'failed';
    router.reload({
        only: [propName],
        onCancelToken: (token) => (cancelRead = () => token.cancel()),
        onSuccess: (page) => {
            const shown = page.props[propName] as WindowResult<unknown> | undefined;
            outcome = shown?.state === 'denied' ? 'denied' : 'applied';
        },
        onFinish: () => ended(outcome),
    });

    return () => cancelRead?.();
});
let nextMount = 0;

/**
 * One mount of a window or section prop: its current result, the Data last shown before a failure (cleared when the
 * user may no longer see it or its record is unavailable), and a retry that reloads only this prop. Mounts of the same
 * prop asking at once share one read; each keeps its own draft, focus and scroll, and only the mount that asked
 * announces the outcome, or the next one still waiting when it left. An optional window prop is asked for once shown;
 * after that the live client reads it while it is on the page, and it leaves the page when its last mount closes.
 */
export function useWindowProps(propName: string, askOnStart = true) {
    const page = usePage();
    const { viewer } = useAppContext();
    const mount = ++nextMount;
    const result = computed(() => page.props[propName] as WindowResult<unknown> | null | undefined);
    const keptData = ref<unknown>(undefined);
    // The outcome of the last read this mount announces; a mount that only joined announces nothing.
    const announcedOutcome = ref<PropReadOutcome | null>(null);
    let readKey: string | null = null;

    watch(
        result,
        (current) => {
            if (current?.state === 'ready') {
                keptData.value = current.data;
            }

            if (current?.state === 'denied' || current?.state === 'unavailable') {
                keptData.value = undefined;
            }
        },
        { immediate: true },
    );

    function retry(): void {
        const principal = viewer.value.id ?? 'guest';
        const query = page.url.includes('?') ? page.url.slice(page.url.indexOf('?')) : '';
        readKey = sharedReads.keyOf(principal, propName, query);
        sharedReads.request(readKey, propName, mount, (outcome) => (announcedOutcome.value = outcome));
    }

    if (askOnStart && result.value === undefined) {
        retry();
    }

    // The page this mount shows the prop on; a navigation away never clears the next page's prop of the same name.
    const mountedComponent = page.component;
    const mountedUrl = page.url;
    sharedReads.show(propName, mount);

    onBeforeUnmount(() => {
        const isLast = sharedReads.hide(propName, mount);

        // The last mount closed: the prop leaves the page, so the live client no longer reads it.
        if (isLast && page.component === mountedComponent && page.url === mountedUrl) {
            router.replaceProp(propName, undefined);
        }

        if (readKey !== null) {
            sharedReads.detach(readKey, mount);
        }
    });

    return { result, keptData, retry, announcedOutcome };
}
