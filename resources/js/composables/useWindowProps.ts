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
            outcome = shown?.status === 'denied' || shown?.status === 'unavailable'
                ? 'denied'
                : shown === undefined || shown.status === 'failed' ? 'failed' : 'applied';
        },
        onFinish: () => ended(outcome),
    });

    return () => cancelRead?.();
});
let nextMount = 0;

/**
 * One mount of a window or section prop: its result, the Data last shown before a failure, and a retry that reloads
 * only this prop. Mounts asking at once share one read and keep their own draft, focus and scroll; an optional prop is
 * asked for once shown and leaves with its last mount.
 */
export function isWindowShown(propName: string): boolean {
    return sharedReads.isShown(propName);
}

export function useWindowProps(propName: string, askOnStart: () => boolean = () => true) {
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
            if (current?.status === 'ready') {
                keptData.value = current.data;
            }

            if (current?.status === 'denied' || current?.status === 'unavailable') {
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

    watch(askOnStart, (shouldRead) => {
        const deferred = Object.values(page.deferredProps ?? {}).flat();

        if (shouldRead && result.value === undefined && !deferred.includes(propName)) {
            retry();
        }
    }, { immediate: true });

    // The page this mount shows the prop on; a navigation away never clears the next page's prop of the same name.
    const mountedComponent = page.component;
    const mountedPath = page.url.split('?')[0];
    sharedReads.show(propName, mount);

    onBeforeUnmount(() => {
        const isLast = sharedReads.hide(propName, mount);

        // The last mount closed: the prop leaves the page, so the live client no longer reads it.
        if (isLast && page.component === mountedComponent && page.url.split('?')[0] === mountedPath) {
            router.replaceProp(propName, undefined);
        }

        if (readKey !== null) {
            sharedReads.detach(readKey, mount);
        }
    });

    return { result, keptData, retry, announcedOutcome };
}
