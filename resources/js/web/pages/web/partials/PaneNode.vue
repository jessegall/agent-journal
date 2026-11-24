<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { computed, ref } from 'vue';
import Splitter from '@/components/kit/Splitter.vue';
import { usePaneLayout } from '@/components/panes/usePaneLayout';
import PaneFrame from './PaneFrame.vue';
import { withRatio } from '@/components/panes/paneLayout';
import type { LayoutNode } from '@/components/panes/paneLayout';

/**
 * One node of the layout tree: a pane, or a split laying its two sides out in a row or a column at its ratio with the
 * splitter between them. The side after the splitter has the 1 px border version 5 draws on a pane not at the edge.
 * Sizes ease over 0.26 s as version 5's do, except while a splitter is dragged.
 */
const props = defineProps<{ node: LayoutNode }>();

defineSlots<{ default(props: { windowKey: string }): unknown }>();

const store = usePaneLayout();
const splitBox = ref<HTMLElement | null>(null);
const boxSize = useElementSize(splitBox);
// How long the split is along its axis: what the splitter moves its ratio over.
const span = computed(() =>
    props.node.type === 'split' && props.node.axis === 'row' ? boxSize.width.value : boxSize.height.value,
);
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
            ref="splitBox"
            class="relative flex h-full min-h-0 w-full min-w-0"
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
            <Splitter
                :axis="node.axis === 'row' ? 'x' : 'y'"
                :span="span"
                :model-value="node.ratio"
                :style="
                    node.axis === 'row'
                        ? { left: `calc(${node.ratio * 100}% - 4px)` }
                        : { top: `calc(${node.ratio * 100}% - 4px)` }
                "
                @update:model-value="(ratio: number) => store.change(withRatio(store.layout.value, node.id, ratio, span))"
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
