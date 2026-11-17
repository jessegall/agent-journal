<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { usePaneLayout } from '@/composables/usePaneLayout';
import MenuList from './MenuList.vue';
import type { MenuEntry } from './MenuList.vue';
import PaneAddBar from './PaneAddBar.vue';
import PaneTabs from './PaneTabs.vue';
import type { PaneTab } from './PaneTabs.vue';
import {
    activate,
    closePane,
    closeWindow,
    moveWindow,
    panesIn,
    splitPane,
    toggleLimitWidth,
} from './paneLayout';
import type { Pane, SplitSide } from './paneLayout';

/**
 * One pane of the grid, as version 5's pane stage draws it: the tab strip with + (the add bar) and ⋮ (the pane menu),
 * then the open window, or "Nothing is open in this pane." The window itself comes from the grid's window slot.
 */
const props = defineProps<{ pane: Pane }>();

const store = usePaneLayout();
const isAdding = ref(false);
const isMenuOpen = ref(false);

const tabs = computed<PaneTab[]>(() =>
    props.pane.windows.flatMap((key) => {
        const window = store.windows.value.find((each) => each.key === key);

        return window
            ? [{ ...window, isActive: key === props.pane.active }]
            : [];
    }),
);

const otherPanes = computed(() =>
    panesIn(store.layout.value).filter((each) => each.id !== props.pane.id),
);

function titleOf(pane: Pane): string {
    return (
        store.windows.value.find((each) => each.key === pane.active)?.title ??
        'the empty pane'
    );
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

const menuEntries = computed<MenuEntry[]>(() => {
    const isAlone = props.pane.windows.length < 2;
    const moves: MenuEntry[] = otherPanes.value.map((other, place) => ({
        label: `Move to ${titleOf(other)}`,
        groupLabel: place === 0 ? 'Move' : undefined,
        disabled: props.pane.active === null,
        run: () =>
            store.change(
                moveWindow(
                    store.layout.value,
                    props.pane.active ?? '',
                    other.id,
                ),
            ),
    }));
    const foot: MenuEntry[] = [
        {
            label: 'Close',
            disabled: otherPanes.value.length === 0,
            startsGroup: true,
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
    >
        <PaneTabs
            :tabs="tabs"
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
            <PaneAddBar :windows="store.closedWindows.value" @add="add" />
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
                <p class="p-4 text-body text-text-3">
                    Nothing is open in this pane.
                </p>
            </template>
        </div>
    </section>
</template>
