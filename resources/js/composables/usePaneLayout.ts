import { computed, inject, onMounted, provide, ref } from 'vue';
import type { ComputedRef, InjectionKey, Ref } from 'vue';
import {
    defaultLayout,
    panesIn,
    windowsIn,
} from '@/components/panes/paneLayout';
import type { LayoutNode, PaneWindow } from '@/components/panes/paneLayout';

/**
 * The layout a pane grid shows and changes, with the windows it can hold. Until saved layouts arrive the arrangement
 * is remembered in this browser only; a remembered layout naming a window that no longer exists is dropped for the
 * default one.
 */
export type PaneLayoutStore = {
    layout: Ref<LayoutNode>;
    windows: ComputedRef<PaneWindow[]>;
    closedWindows: ComputedRef<PaneWindow[]>;
    isDefault: ComputedRef<boolean>;
    change: (next: LayoutNode) => void;
    reset: () => void;
};

const storeKey: InjectionKey<PaneLayoutStore> = Symbol('pane layout');

export function providePaneLayout(
    storageKey: string,
    windows: () => PaneWindow[],
): PaneLayoutStore {
    const windowList = computed(windows);
    const firstLayout = (): LayoutNode => {
        const [first, ...others] = windowList.value.map((each) => each.key);

        return defaultLayout(first, others);
    };
    const layout = ref<LayoutNode>(firstLayout());

    const store: PaneLayoutStore = {
        layout,
        windows: windowList,
        closedWindows: computed(() =>
            windowList.value.filter(
                (each) => !windowsIn(layout.value).includes(each.key),
            ),
        ),
        isDefault: computed(
            () =>
                JSON.stringify(layout.value) === JSON.stringify(firstLayout()),
        ),
        change(next) {
            layout.value = next;

            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
            } catch {
                // A browser that refuses storage keeps the layout for this visit only.
            }
        },
        reset() {
            store.change(firstLayout());
        },
    };

    onMounted(() => {
        try {
            const remembered = localStorage.getItem(storageKey);

            if (remembered === null) {
                return;
            }

            const saved = JSON.parse(remembered) as LayoutNode;
            const known = windowList.value.map((each) => each.key);

            if (
                panesIn(saved).length > 0 &&
                windowsIn(saved).every((key) => known.includes(key))
            ) {
                layout.value = saved;
            }
        } catch {
            // A missing or unreadable remembered layout leaves the default one.
        }
    });

    provide(storeKey, store);

    return store;
}

export function usePaneLayout(): PaneLayoutStore {
    const store = inject(storeKey);

    if (!store) {
        throw new Error('A pane is shown outside a pane grid.');
    }

    return store;
}
