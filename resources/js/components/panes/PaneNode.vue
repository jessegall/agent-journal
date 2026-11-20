<script setup lang="ts">
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import PaneFrame from './PaneFrame.vue';
import PaneSplitter from './PaneSplitter.vue';
import { centreSplit, withRatio } from './paneLayout';
import type { LayoutNode } from './paneLayout';

/**
 * One node of the layout tree: a pane, or a split laying its two sides out in a row or a column at its ratio with the
 * splitter between them. The side after the splitter has the 1 px border version 5 draws on a pane not at the edge.
 * Sizes ease over 0.26 s as version 5's do, except while a splitter is dragged.
 */
defineProps<{ node: LayoutNode }>();

defineSlots<{ default(props: { windowKey: string }): unknown }>();

const store = usePaneLayout();

function move(splitId: string, ratio: number, spaceSize: number): void {
    store.change(withRatio(store.layout.value, splitId, ratio, spaceSize));
}
</script>

<template>
    <template v-if="node.type === 'pane'">
        <PaneFrame :pane="node">
            <template #default="{ windowKey }">
                <slot :window-key="windowKey" />
            </template>
        </PaneFrame>
    </template>
    <template v-else>
        <div
            class="flex h-full min-h-0 w-full min-w-0"
            :class="node.axis === 'row' ? 'flex-row' : 'flex-col'"
        >
            <div
                class="min-h-0 min-w-0 flex-none transition-[flex-basis] duration-[260ms] ease-journal [body.resizing_&]:transition-none [body.resizing-y_&]:transition-none"
                :style="{ flexBasis: `${node.ratio * 100}%` }"
            >
                <PaneNode :node="node.first">
                    <template #default="{ windowKey }">
                        <slot :window-key="windowKey" />
                    </template>
                </PaneNode>
            </div>
            <PaneSplitter
                :axis="node.axis"
                :ratio="node.ratio"
                @move="(ratio, spaceSize) => move(node.id, ratio, spaceSize)"
                @reset="store.change(centreSplit(store.layout.value, node.id))"
            />
            <div
                class="min-h-0 min-w-0 flex-1 border-border"
                :class="node.axis === 'row' ? 'border-l' : 'border-t'"
            >
                <PaneNode :node="node.second">
                    <template #default="{ windowKey }">
                        <slot :window-key="windowKey" />
                    </template>
                </PaneNode>
            </div>
        </div>
    </template>
</template>
