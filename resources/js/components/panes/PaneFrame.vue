<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import { useWindowDrag } from '@/components/panes/useWindowDrag';
import { detachWindow, dropWindow } from './arrangement';
import DropCompass from './DropCompass.vue';
import MenuList from './MenuList.vue';
import type { MenuEntry } from './MenuList.vue';
import AddWindowPopover from './AddWindowPopover.vue';
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
const addButton = ref<{ $el: HTMLElement } | null>(null);
const addAnchor = computed(() => addButton.value?.$el ?? null);
/**
 * The chat on day one: the only pane of Home, holding one window, drawn plain with no tab strip, as the design draws it.
 */
const isPlain = computed(
    () => store.layout.value.type === 'pane' && props.pane.windows.length === 1,
);
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

/**
 * The least a pane may measure on the axis a split would divide, so neither half ends up unreadable.
 */
const SMALLEST_SPLITTABLE = 280;

const refusal = ref('');
const frame = ref<HTMLElement | null>(null);

function split(key: string | null, side: SplitSide): void {
    if (!key) {
        return;
    }

    const box = frame.value;
    const space = side === 'left' || side === 'right' ? box?.offsetWidth : box?.offsetHeight;

    if (space !== undefined && space < SMALLEST_SPLITTABLE) {
        refusal.value = 'This pane is too narrow to split.';

        return;
    }

    refusal.value = '';
    store.change(splitPane(store.layout.value, props.pane.id, key, side));
}

/**
 * Closes a tab and gives the focus to the pane's new active tab, or its next window, instead of losing it.
 */
function closeTab(key: string): void {
    store.change(closeWindow(store.layout.value, key));
    void nextTick(() => frame.value?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus());
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
        label: `Join ${titleOf(other)}`,
        groupLabel: place === 0 ? 'Join pane' : undefined,
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
        { label: 'Dock left', disabled: isAlone, run: () => split(props.pane.active, 'left') },
        { label: 'Dock right', disabled: isAlone, run: () => split(props.pane.active, 'right') },
        { label: 'Dock above', disabled: isAlone, run: () => split(props.pane.active, 'above') },
        { label: 'Dock below', disabled: isAlone, run: () => split(props.pane.active, 'below') },
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
        ref="frame"
        class="@container relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-bg"
        :aria-label="`Pane with ${titleOf(pane)}`"
        :data-pane-id="pane.id"
    >
        <PaneTabs
            v-if="!isPlain"
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
            @close="closeTab"
            @split="split"
        >
            <Button
                ref="addButton"
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
        <AddWindowPopover
            v-model:open="isAdding"
            :windows="store.closedWindows.value"
            :anchor="addAnchor"
            @add="add"
            @grab="
                (event, key) => {
                    isAdding = false;
                    grab(event, key, null, () => add(key));
                }
            "
        />
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
                    :class="{ 'mx-auto max-w-[760px]': pane.limitWidth }"
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
        <template v-if="refusal !== ''">
            <p role="alert" class="absolute right-2 bottom-2 rounded-field border border-border-2 bg-raised px-2 py-1 text-small text-text-2">
                {{ refusal }}
            </p>
        </template>
        <template v-if="compassZone">
            <DropCompass :zone="compassZone" />
        </template>
        <template v-if="offeredTitle !== null">
            <SplitOffer :title="offeredTitle" @pick="answerOffer" />
        </template>
    </section>
</template>
