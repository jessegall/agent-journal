<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { usePaneLayout } from '@/composables/usePaneLayout';
import PaneFrame from './PaneFrame.vue';
import PaneNode from './PaneNode.vue';
import { panesIn } from './paneLayout';

/**
 * Version 5's pane grid (panes/PaneGrid.vue): the layout's panes side by side and above each other, split by
 * splitters. Narrower than version 5's 700 px the panes stack instead, the one holding the first window first, each
 * one grid high, with scroll snapping.
 */
const NARROW_WIDTH = 700;

defineSlots<{ default(props: { windowKey: string }): unknown }>();

const store = usePaneLayout();
const grid = ref<HTMLElement | null>(null);
const isNarrow = ref(false);
let watcher: ResizeObserver | null = null;

const stackedPanes = computed(() => {
    const first = store.windows.value[0]?.key;

    return [...panesIn(store.layout.value)].sort(
        (one, other) =>
            Number(other.windows.includes(first)) -
            Number(one.windows.includes(first)),
    );
});

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
            <div
                class="flex h-full snap-y snap-proximity flex-col overflow-y-auto overscroll-contain"
            >
                <template v-for="pane in stackedPanes" :key="pane.id">
                    <div
                        class="h-full flex-none snap-start border-b border-border"
                    >
                        <PaneFrame :pane="pane">
                            <template #default="{ windowKey }">
                                <slot :window-key="windowKey" />
                            </template>
                        </PaneFrame>
                    </div>
                </template>
            </div>
        </template>
        <template v-else>
            <PaneNode :node="store.layout.value">
                <template #default="{ windowKey }">
                    <slot :window-key="windowKey" />
                </template>
            </PaneNode>
        </template>
    </div>
</template>
