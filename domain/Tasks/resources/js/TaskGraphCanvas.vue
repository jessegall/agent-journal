<script setup lang="ts">
import { computed, useId } from 'vue';
import type { TaskGraphEdge, TaskGraphNode } from '@generated/types/tasks';
import { layoutOf, NODE_HEIGHT, NODE_WIDTH } from './taskGraph';

/**
 * One canvas of a task graph: each task a node in the column of its wait depth, an arrow from every task that must
 * finish to the task that waits for it. A wait marked added is drawn heavy and labelled +, one marked removed is dashed
 * and labelled −, so a change never rests on colour alone. The lit chain, the selected node and the bottlenecks are
 * the caller's; choosing a node is the caller's too.
 */
const props = withDefaults(
    defineProps<{
        label: string;
        nodes: TaskGraphNode[];
        edges: TaskGraphEdge[];
        lit: Set<string>;
        selectedId: string | null;
        bottlenecks: Set<string>;
        added?: TaskGraphEdge[];
        removed?: TaskGraphEdge[];
    }>(),
    { added: () => [], removed: () => [] },
);

defineEmits<{ select: [id: string] }>();

const markerId = `graph-arrow-${useId()}`;
const drawn = computed(() => [
    ...props.edges.map((edge) => ({ ...edge, mark: props.added.some((each) => sameWait(each, edge)) ? 'added' : '' })),
    ...props.removed.map((edge) => ({ ...edge, mark: 'removed' })),
]);
const layout = computed(() => layoutOf(props.nodes, [...props.edges, ...props.added]));

function sameWait(first: TaskGraphEdge, second: TaskGraphEdge): boolean {
    return first.prerequisiteId === second.prerequisiteId && first.dependentId === second.dependentId;
}

function pathOf(prerequisiteId: string, dependentId: string): string {
    const from = layout.value.placements[prerequisiteId];
    const to = layout.value.placements[dependentId];
    const startX = from.x + NODE_WIDTH;
    const startY = from.y + NODE_HEIGHT / 2;
    const endX = to.x;
    const endY = to.y + NODE_HEIGHT / 2;
    const middle = (startX + endX) / 2;

    return `M ${startX} ${startY} C ${middle} ${startY}, ${middle} ${endY}, ${endX} ${endY}`;
}

function middleOf(prerequisiteId: string, dependentId: string): { x: number; y: number } {
    const from = layout.value.placements[prerequisiteId];
    const to = layout.value.placements[dependentId];

    return { x: (from.x + NODE_WIDTH + to.x) / 2, y: (from.y + to.y + NODE_HEIGHT) / 2 };
}

function isLit(edge: TaskGraphEdge): boolean {
    return props.lit.has(edge.prerequisiteId) && props.lit.has(edge.dependentId);
}
</script>

<template>
    <div class="min-w-0 flex-1 overflow-auto rounded-card border border-line p-3" :aria-label="label" role="group">
        <div class="relative" :style="{ width: `${layout.width}px`, height: `${layout.height}px` }">
            <svg class="pointer-events-none absolute inset-0" :width="layout.width" :height="layout.height" aria-hidden="true">
                <defs>
                    <marker :id="markerId" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
                        <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
                    </marker>
                </defs>
                <template v-for="edge in drawn" :key="`${edge.prerequisiteId}-${edge.dependentId}-${edge.mark}`">
                    <path
                        :d="pathOf(edge.prerequisiteId, edge.dependentId)"
                        fill="none"
                        stroke="currentColor"
                        :marker-end="`url(#${markerId})`"
                        :data-edge="`${edge.prerequisiteId}>${edge.dependentId}`"
                        :data-mark="edge.mark || undefined"
                        :stroke-width="edge.mark === 'added' ? 3 : isLit(edge) ? 2 : 1"
                        :stroke-dasharray="edge.mark === 'removed' ? '5 4' : undefined"
                        :class="edge.mark !== '' || isLit(edge) ? 'text-text' : 'text-border-3'"
                    />
                    <template v-if="edge.mark !== ''">
                        <text
                            :x="middleOf(edge.prerequisiteId, edge.dependentId).x"
                            :y="middleOf(edge.prerequisiteId, edge.dependentId).y - 4"
                            text-anchor="middle"
                            class="fill-current text-small text-text"
                        >
                            {{ edge.mark === 'added' ? '+ added' : '− removed' }}
                        </text>
                    </template>
                </template>
            </svg>
            <template v-for="node in nodes" :key="node.id">
                <button
                    type="button"
                    :data-node="node.id"
                    :aria-pressed="selectedId === node.id"
                    :aria-current="selectedId === node.id ? 'true' : undefined"
                    class="absolute flex items-center gap-2 overflow-hidden rounded-button border px-2 text-left text-small focus-visible:outline-2 focus-visible:outline-focus"
                    :class="[
                        selectedId !== null && lit.has(node.id) ? 'border-text bg-sel' : 'border-line bg-bg',
                        bottlenecks.has(node.id) && 'ring-2 ring-text-3',
                    ]"
                    :style="{
                        left: `${layout.placements[node.id].x}px`,
                        top: `${layout.placements[node.id].y}px`,
                        width: `${NODE_WIDTH}px`,
                        height: `${NODE_HEIGHT}px`,
                    }"
                    @click="$emit('select', node.id)"
                >
                    <span class="shrink-0 text-text-3 tabular-nums">{{ node.number }}</span>
                    <span class="min-w-0 flex-1 truncate text-text">{{ node.title }}</span>
                    <template v-if="bottlenecks.has(node.id)">
                        <span class="shrink-0 text-badge text-text-2">Bottleneck</span>
                    </template>
                </button>
            </template>
        </div>
    </div>
</template>
