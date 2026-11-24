<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SegmentedControl from '@/components/kit/SegmentedControl.vue';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import DetachedWindowFrame from './DetachedWindowFrame.vue';
import DragGhost from '@/components/kit/DragGhost.vue';
import PaneNode from './PaneNode.vue';
import { shownWindows } from './arrangement';

/**
 * Version 5's pane grid (panes/PaneGrid.vue): the layout's panes side by side and above each other, split by
 * splitters. Narrower than version 5's 700 px, on a phone, one window shows under a switcher that lists every open
 * window and stays in place; every window stays mounted, so choosing another and coming back finds its draft and its
 * scroll as they were. Detached windows float over everything, and a dragged window's ghost follows the pointer.
 */
const NARROW_WIDTH = 700;

defineSlots<{ default(props: { windowKey: string }): unknown }>();

const store = usePaneLayout();

/** The window being dragged with where the pointer is, which the ghost beside the pointer shows. */
const dragged = computed(() => {
    const drag = store.drag.value;
    const window = drag === null ? undefined : store.windowOf(drag.windowKey);

    return drag === null || window === undefined ? null : { window, x: drag.x, y: drag.y };
});
const grid = ref<HTMLElement | null>(null);
const isNarrow = ref(false);
let watcher: ResizeObserver | null = null;

// On a phone every open window is one of the switcher's, the floating ones too: a phone has no room to float.
const openKeys = computed(() => shownWindows(store.arrangement.value));
const activeKey = ref('');
const items = computed(() =>
    openKeys.value.map((key) => ({ value: key, label: store.windowOf(key)?.title ?? key })),
);

watch(
    openKeys,
    (keys) => {
        if (!keys.includes(activeKey.value)) {
            activeKey.value = keys[0] ?? '';
        }
    },
    { immediate: true },
);

onMounted(() => {
    watcher = new ResizeObserver(([entry]) => {
        isNarrow.value = entry.contentRect.width < NARROW_WIDTH;
    });

    if (grid.value) {
        watcher.observe(grid.value);
    }
});

onBeforeUnmount(() => watcher?.disconnect());
</script>

<template>
    <div ref="grid" class="relative min-h-0 flex-1 overflow-hidden">
        <template v-if="isNarrow">
            <div class="flex h-full flex-col pb-[env(safe-area-inset-bottom)]">
                <div class="flex-none overflow-x-auto border-b border-border bg-side px-3 py-1.5" data-window-switcher>
                    <SegmentedControl v-model="activeKey" label="Open windows" :items="items" />
                </div>
                <div class="relative min-h-0 flex-1">
                    <template v-for="key in openKeys" :key="key">
                        <div v-show="key === activeKey" class="h-full overflow-auto" :data-phone-window="key">
                            <slot :window-key="key" />
                        </div>
                    </template>
                    <template v-if="openKeys.length === 0">
                        <p class="p-4 text-body text-text-3">Nothing is open. Add a window from the bar above.</p>
                    </template>
                </div>
            </div>
        </template>
        <template v-else>
            <PaneNode :node="store.shownLayout.value">
                <template #default="{ windowKey }">
                    <slot :window-key="windowKey" />
                </template>
            </PaneNode>
        </template>
        <template v-if="!isNarrow">
            <template v-for="detached in store.detached.value" :key="detached.key">
                <DetachedWindowFrame :window="detached">
                    <slot :window-key="detached.key" />
                </DetachedWindowFrame>
            </template>
        </template>
        <template v-if="dragged">
            <DragGhost
                :icon="dragged.window.icon"
                :title="dragged.window.title"
                :x="dragged.x"
                :y="dragged.y"
            />
        </template>
    </div>
</template>
