import {
    computed,
    inject,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
} from 'vue';
import { keepStoredJson, readStoredJson } from '@/composables/browserStorage';
import type { ComputedRef, InjectionKey, Ref } from 'vue';
import {
    arrangementFrom,
    defaultArrangement,
    firstWindowOnly,
    keptOnScreen,
    sameArrangement,
    shownWindows,
} from '@/components/panes/arrangement';
import type {
    Arrangement,
    DetachedWindow,
    DropTarget,
    Screen,
} from '@/components/panes/arrangement';
import { originalKeyOf } from '@/components/panes/paneLayout';
import type { LayoutNode, PaneWindow } from '@/components/panes/paneLayout';

/**
 * The arrangement a pane grid shows and changes, the windows it can hold, and the window being dragged. The live
 * arrangement is remembered in this browser; saved layouts live on the server. A remembered arrangement drops the
 * windows that no longer exist.
 */
export type WindowDrag = {
    windowKey: string;
    fromPaneId: string | null;
    x: number;
    y: number;
    target: DropTarget | 'detach' | null;
};

export type Preset = { name: string; arrangement: Arrangement };

export type PaneLayoutStore = {
    arrangement: Ref<Arrangement>;
    layout: ComputedRef<LayoutNode>;
    detached: ComputedRef<DetachedWindow[]>;
    windows: ComputedRef<PaneWindow[]>;
    /**
     * The window a pane tab's key shows, a copy's key naming the window it copies; undefined once it is gone.
     */
    windowOf(key: string): PaneWindow | undefined;
    closedWindows: ComputedRef<PaneWindow[]>;
    presets: ComputedRef<Preset[]>;
    isDefault: ComputedRef<boolean>;
    drag: Ref<WindowDrag | null>;
    splitOffer: Ref<{ paneId: string; windowKey: string } | null>;
    change: (grid: LayoutNode) => void;
    apply: (next: Arrangement) => void;
    reset: () => void;
    screen: () => Screen;
};

const storeKey: InjectionKey<PaneLayoutStore> = Symbol('pane layout');

export function providePaneLayout(
    storageKey: string,
    windows: () => PaneWindow[],
): PaneLayoutStore {
    const windowList = computed(windows);
    const knownWindows = computed(() =>
        windowList.value.map((each) => each.key),
    );
    const firstArrangement = (): Arrangement => firstWindowOnly(knownWindows.value[0]);
    const sideBySide = (): Arrangement => {
        const [first, ...others] = knownWindows.value;

        return defaultArrangement(first, others);
    };
    const arrangement = ref<Arrangement>(firstArrangement());
    const screen = (): Screen => ({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const presets = computed<Preset[]>(() => [
        { name: 'Default', arrangement: firstArrangement() },
        { name: 'Side by side', arrangement: sideBySide() },
    ]);

    const store: PaneLayoutStore = {
        arrangement,
        layout: computed(() => arrangement.value.grid),
        detached: computed(() => arrangement.value.detached),
        windows: windowList,
        windowOf: (key) =>
            windowList.value.find((each) => each.key === originalKeyOf(key)),
        closedWindows: computed(() =>
            windowList.value.filter(
                (each) => !shownWindows(arrangement.value).includes(each.key),
            ),
        ),
        presets,
        isDefault: computed(() =>
            sameArrangement(arrangement.value, firstArrangement()),
        ),
        drag: ref(null),
        splitOffer: ref(null),
        change(grid) {
            store.apply({ ...arrangement.value, grid });
        },
        apply(next) {
            arrangement.value = next;

            keepStoredJson('local', storageKey, next);
        },
        reset() {
            store.apply(firstArrangement());
        },
        screen,
    };

    function keepDetachedOnScreen(): void {
        arrangement.value = keptOnScreen(arrangement.value, screen());
    }

    onMounted(() => {
        const applied = readStoredJson('local', storageKey, (decoded) =>
            arrangementFrom(decoded, knownWindows.value),
        );

        if (applied) {
            arrangement.value = keptOnScreen(applied, screen());
        }

        window.addEventListener('resize', keepDetachedOnScreen);
    });

    onBeforeUnmount(() =>
        window.removeEventListener('resize', keepDetachedOnScreen),
    );

    provide(storeKey, store);

    return store;
}

/**
 * A pane component was mounted with no pane grid above it to give it its layout.
 */
export class PaneOutsideGrid extends Error {
    static create(): PaneOutsideGrid {
        return new PaneOutsideGrid('A pane is shown outside a pane grid.');
    }
}

export function usePaneLayout(): PaneLayoutStore {
    const store = inject(storeKey);

    if (!store) {
        throw PaneOutsideGrid.create();
    }

    return store;
}
