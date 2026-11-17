import {
    computed,
    inject,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
} from 'vue';
import type { ComputedRef, InjectionKey, Ref } from 'vue';
import {
    arrangementFrom,
    defaultArrangement,
    firstWindowOnly,
    keptOnScreen,
    shownWindows,
} from '@/components/panes/arrangement';
import type {
    Arrangement,
    DetachedWindow,
    DropTarget,
    Screen,
} from '@/components/panes/arrangement';
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

function sameArrangement(one: Arrangement, other: Arrangement): boolean {
    return JSON.stringify(one) === JSON.stringify(other);
}

export function providePaneLayout(
    storageKey: string,
    windows: () => PaneWindow[],
): PaneLayoutStore {
    const windowList = computed(windows);
    const knownWindows = computed(() =>
        windowList.value.map((each) => each.key),
    );
    const firstArrangement = (): Arrangement => {
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
        {
            name: 'Chat only',
            arrangement: firstWindowOnly(knownWindows.value[0]),
        },
    ]);

    const store: PaneLayoutStore = {
        arrangement,
        layout: computed(() => arrangement.value.grid),
        detached: computed(() => arrangement.value.detached),
        windows: windowList,
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

            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
            } catch {
                // A browser that refuses storage keeps the arrangement for this visit only.
            }
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
        try {
            const remembered = localStorage.getItem(storageKey);
            const applied =
                remembered === null
                    ? null
                    : arrangementFrom(
                          JSON.parse(remembered),
                          knownWindows.value,
                      );

            if (applied) {
                arrangement.value = keptOnScreen(applied, screen());
            }
        } catch {
            // A missing or unreadable remembered arrangement leaves the default one.
        }

        window.addEventListener('resize', keepDetachedOnScreen);
    });

    onBeforeUnmount(() =>
        window.removeEventListener('resize', keepDetachedOnScreen),
    );

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
