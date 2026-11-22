<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import { useWindowDrag } from '@/components/panes/useWindowDrag';
import { detachWindow, dropWindow } from './arrangement';
import DropCompass from './DropCompass.vue';
import MenuList from './MenuList.vue';
import type { MenuEntry } from './MenuList.vue';
import PaneAddBar from './PaneAddBar.vue';
import PaneTabs from './PaneTabs.vue';
import SplitOffer from './SplitOffer.vue';
import type { PaneTab } from './PaneTabs.vue';
import {
    activate,
    closePane,
    closeWindow,
    copyWindow,
    moveWindow,
    panesIn,
    splitPane,
    toggleLimitWidth,
} from './paneLayout';
import type { DropZone, Pane, SplitSide } from './paneLayout';

/**
 * One pane of the grid, as version 5's pane stage draws it: the tab strip with + (the add bar) and ⋮ (the pane menu),
 * then the open window, or "Nothing is open in this pane." The window itself comes from the grid's window slot. While
 * a window is dragged over it, it shows the drop compass or the place among its tabs.
 */
const props = defineProps<{ pane: Pane }>();

const store = usePaneLayout();
const { grab } = useWindowDrag();
const isAdding = ref(false);
const isMenuOpen = ref(false);

const tabs = computed<PaneTab[]>(() =>
    props.pane.windows.flatMap((key) => {
        const window = store.windowOf(key);

        return window
            ? [{ ...window, key, isActive: key === props.pane.active }]
            : [];
    }),
);

const otherPanes = computed(() =>
    panesIn(store.layout.value).filter((each) => each.id !== props.pane.id),
);

function titleOf(pane: Pane): string {
    if (pane.active === null) {
        return 'the empty pane';
    }

    return store.windowOf(pane.active)?.title ?? 'the empty pane';
}

function split(key: string | null, side: SplitSide): void {
    if (key) {
        store.change(splitPane(store.layout.value, props.pane.id, key, side));
    }
}

function add(key: string): void {
    store.change(moveWindow(store.layout.value, key, props.pane.id));
    isAdding.value = false;
}

function detach(key: string | null): void {
    if (key) {
        store.apply(
            detachWindow(
                store.arrangement.value,
                key,
                { left: 80, top: 80 },
                store.screen(),
            ),
        );
    }
}

const aimedHere = computed(() => {
    const target = store.drag.value?.target;

    return target && target !== 'detach' && target.paneId === props.pane.id
        ? target
        : null;
});

const compassZone = computed<DropZone | null>(() =>
    aimedHere.value && aimedHere.value.zone !== 'tabs'
        ? aimedHere.value.zone
        : null,
);

const insertAt = computed(() =>
    aimedHere.value?.zone === 'tabs' ? aimedHere.value.place : -1,
);

const offeredTitle = computed(() => {
    const offer = store.splitOffer.value;

    return offer?.paneId === props.pane.id
        ? (store.windowOf(offer.windowKey)?.title ?? '')
        : null;
});

function answerOffer(zone: DropZone | null): void {
    const offer = store.splitOffer.value;
    store.splitOffer.value = null;

    if (offer && zone) {
        store.apply(
            dropWindow(store.arrangement.value, offer.windowKey, {
                paneId: offer.paneId,
                zone,
            }),
        );
    }
}

const menuEntries = computed<MenuEntry[]>(() => {
    const isAlone = props.pane.windows.length < 2;
    const active = props.pane.active;
    const moves: MenuEntry[] = otherPanes.value.map((other, place) => ({
        label: `Move to ${titleOf(other)}`,
        groupLabel: place === 0 ? 'Move' : undefined,
        disabled: active === null,
        run: () => {
            if (active !== null) {
                store.change(moveWindow(store.layout.value, active, other.id));
            }
        },
    }));
    const foot: MenuEntry[] = [
        {
            label: 'Open a copy',
            disabled: active === null,
            startsGroup: true,
            run: () => {
                if (active !== null) {
                    store.change(
                        copyWindow(store.layout.value, active, props.pane.id),
                    );
                }
            },
        },
        {
            label: 'Close',
            disabled: otherPanes.value.length === 0,
            run: () =>
                store.change(closePane(store.layout.value, props.pane.id)),
        },
    ];

    if (!store.isDefault.value) {
        foot.push({ label: 'Reset layout', run: store.reset });
    }

    return [
        {
            label: 'Split right',
            disabled: isAlone,
            run: () => split(props.pane.active, 'right'),
        },
        {
            label: 'Split below',
            disabled: isAlone,
            run: () => split(props.pane.active, 'below'),
        },
        {
            label: 'Detach',
            disabled: props.pane.active === null,
            run: () => detach(props.pane.active),
        },
        {
            label: props.pane.limitWidth ? 'Use full width' : 'Limit width',
            run: () =>
                store.change(
                    toggleLimitWidth(store.layout.value, props.pane.id),
                ),
        },
        ...moves,
        ...foot,
    ];
});
</script>

<template>
    <section
        class="@container relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-bg"
        :aria-label="`Pane with ${titleOf(pane)}`"
        :data-pane-id="pane.id"
    >
        <PaneTabs
            :tabs="tabs"
            :insert-at="insertAt"
            :data-tabs-of="pane.id"
            @grab="
                (event, key) =>
                    grab(event, key, pane.id, () =>
                        store.change(
                            activate(store.layout.value, pane.id, key),
                        ),
                    )
            "
            @detach="detach"
            @pick="
                (key) =>
                    store.change(activate(store.layout.value, pane.id, key))
            "
            @close="(key) => store.change(closeWindow(store.layout.value, key))"
            @split="split"
        >
            <Button
                variant="icon"
                aria-label="Add a window"
                title="Add a window"
                :aria-expanded="isAdding"
                @click="isAdding = !isAdding"
                ><Icon name="plus" :size="13"
            /></Button>
            <Button
                variant="icon"
                aria-label="Window settings"
                title="Window settings"
                :aria-expanded="isMenuOpen"
                @click="isMenuOpen = !isMenuOpen"
                ><Icon name="dots-vertical" :size="13"
            /></Button>
        </PaneTabs>
        <template v-if="isAdding">
            <PaneAddBar
                :windows="store.closedWindows.value"
                @grab="
                    (event, key) => {
                        isAdding = false;
                        grab(event, key, null, () => add(key));
                    }
                "
            />
        </template>
        <template v-if="isMenuOpen">
            <MenuList
                :entries="menuEntries"
                class="absolute top-[34px] right-[5px]"
                @done="isMenuOpen = false"
            />
        </template>
        <div class="relative min-h-0 flex-1 overflow-auto">
            <template v-if="pane.active">
                <div
                    class="h-full"
                    :class="{ 'mx-auto max-w-[860px]': pane.limitWidth }"
                >
                    <slot :window-key="pane.active" />
                </div>
            </template>
            <template v-else>
                <div class="flex flex-col items-start gap-2 p-4">
                    <p class="text-body text-text-3">Nothing is open in this pane.</p>
                    <template v-if="store.closedWindows.value.length > 0">
                        <Button variant="bordered" size="small" @click="isAdding = true">Open a window</Button>
                    </template>
                </div>
            </template>
        </div>
        <template v-if="compassZone">
            <DropCompass :zone="compassZone" />
        </template>
        <template v-if="offeredTitle !== null">
            <SplitOffer :title="offeredTitle" @pick="answerOffer" />
        </template>
    </section>
</template>
