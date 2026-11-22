<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import FactItem from '@kit/FactItem';
import FactList from '@kit/FactList';
import Status from '@kit/Status';
import TextLink from '@kit/TextLink';
import Toggle from '@kit/Toggle';
import type { TaskGraph } from '@generated/types/tasks';
import { bottlenecksOf, chainOf, layoutOf, NODE_HEIGHT, NODE_WIDTH } from './taskGraph';
import { taskStateLook } from './taskLooks';

/**
 * A plan's tasks as a graph: each task a node in the column of its wait depth, an arrow from every task that must
 * finish to the task that waits for it. Enter or Space on a node selects it, lights its whole chain both ways and fills
 * the inspector; Escape clears it and gives the focus back to the node; Show bottlenecks marks the tasks the most
 * others wait for. The inspector holds the task's facts, Open task, which returns here with the node selected, and
 * Close; a task whose waits the caller may not change keeps its facts readable and its change action disabled with the
 * reason. On a wide screen the canvas scrolls apart from the inspector; on a phone the inspector sits below.
 */
const props = defineProps<TaskGraph>();

const selectedId = ref<string | null>(props.selectedId ?? null);
const showsBottlenecks = ref(false);
const canvas = useTemplateRef<HTMLElement>('canvas');

const layout = computed(() => layoutOf(props.nodes, props.edges));
const chain = computed(() => (selectedId.value === null ? new Set<string>() : chainOf(selectedId.value, props.edges)));
const bottlenecks = computed(() => (showsBottlenecks.value ? bottlenecksOf(props.nodes, props.edges) : new Set<string>()));
const selected = computed(() => props.nodes.find((node) => node.id === selectedId.value));
const hasWaits = computed(() => props.edges.length > 0);
const waitsFor = computed(() =>
    props.edges
        .filter((edge) => edge.dependentId === selectedId.value)
        .map((edge) => props.nodes.find((node) => node.id === edge.prerequisiteId))
        .filter((node) => node !== undefined),
);
const holdsUp = computed(() =>
    props.edges
        .filter((edge) => edge.prerequisiteId === selectedId.value)
        .map((edge) => props.nodes.find((node) => node.id === edge.dependentId))
        .filter((node) => node !== undefined),
);

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

function isInChain(id: string): boolean {
    return selectedId.value !== null && chain.value.has(id);
}

function openHref(address: string, id: string): string {
    const separator = props.returnAddress.includes('?') ? '&' : '?';
    const back = `${props.returnAddress}${separator}node=${id}`;

    return `${address}?return=${encodeURIComponent(back)}`;
}

function select(id: string): void {
    selectedId.value = id;
}

async function clear(): Promise<void> {
    const id = selectedId.value;
    selectedId.value = null;

    if (id === null) {
        return;
    }

    await nextTick();
    canvas.value?.querySelector<HTMLElement>(`[data-node="${id}"]`)?.focus();
}
</script>

<template>
    <section class="flex flex-col gap-3" aria-label="Task graph" @keydown.escape="clear">
        <template v-if="nodes.length === 0">
            <EmptyState title="This plan has no tasks" text="Add a task to the plan to see how its tasks wait for each other." />
        </template>
        <template v-else>
            <div class="flex items-center gap-3 text-small text-text-2">
                <label class="flex items-center gap-2">
                    <Toggle v-model="showsBottlenecks" label="Show bottlenecks" :disabled="!hasWaits" />
                    Show bottlenecks
                </label>
                <template v-if="!hasWaits">
                    <span role="status">No task waits for another yet.</span>
                </template>
            </div>
            <div class="flex min-h-0 flex-col gap-3 @2xl:flex-row">
                <div ref="canvas" class="min-w-0 flex-1 overflow-auto rounded-card border border-line p-3">
                    <div
                        class="relative"
                        :style="{ width: `${layout.width}px`, height: `${layout.height}px` }"
                    >
                        <svg
                            class="pointer-events-none absolute inset-0"
                            :width="layout.width"
                            :height="layout.height"
                            aria-hidden="true"
                        >
                            <defs>
                                <marker id="graph-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
                                </marker>
                            </defs>
                            <template v-for="edge in edges" :key="`${edge.prerequisiteId}-${edge.dependentId}`">
                                <path
                                    :d="pathOf(edge.prerequisiteId, edge.dependentId)"
                                    fill="none"
                                    marker-end="url(#graph-arrow)"
                                    :data-edge="`${edge.prerequisiteId}>${edge.dependentId}`"
                                    :stroke-width="isInChain(edge.prerequisiteId) && isInChain(edge.dependentId) ? 2 : 1"
                                    :class="
                                        isInChain(edge.prerequisiteId) && isInChain(edge.dependentId)
                                            ? 'text-text'
                                            : 'text-border-3'
                                    "
                                    stroke="currentColor"
                                />
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
                                    isInChain(node.id) ? 'border-text bg-sel' : 'border-line bg-bg',
                                    bottlenecks.has(node.id) && 'ring-2 ring-text-3',
                                ]"
                                :style="{
                                    left: `${layout.placements[node.id].x}px`,
                                    top: `${layout.placements[node.id].y}px`,
                                    width: `${NODE_WIDTH}px`,
                                    height: `${NODE_HEIGHT}px`,
                                }"
                                @click="select(node.id)"
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
                <template v-if="selected !== undefined">
                    <aside
                        aria-label="Selected task"
                        class="flex w-full shrink-0 flex-col gap-3 overflow-y-auto rounded-card border border-line p-3 @2xl:w-72"
                    >
                        <h3 class="text-text">Task {{ selected.number }}: {{ selected.title }}</h3>
                        <FactList>
                            <FactItem term="State">
                                <Status :state="taskStateLook[selected.state].tone === 'good' ? 'done' : 'idle'" :label="taskStateLook[selected.state].label" />
                            </FactItem>
                            <FactItem term="Waits for">
                                <template v-if="waitsFor.length === 0">nothing</template>
                                <template v-for="(other, index) in waitsFor" :key="other.id">
                                    <template v-if="index > 0">, </template>
                                    <TextLink :href="openHref(other.address, other.id)">{{ other.number }}</TextLink>
                                </template>
                            </FactItem>
                            <FactItem term="Holds up">
                                <template v-if="holdsUp.length === 0">nothing</template>
                                <template v-for="(other, index) in holdsUp" :key="other.id">
                                    <template v-if="index > 0">, </template>
                                    <TextLink :href="openHref(other.address, other.id)">{{ other.number }}</TextLink>
                                </template>
                            </FactItem>
                        </FactList>
                        <div class="flex flex-wrap items-center gap-2">
                            <Button variant="bordered" :href="openHref(selected.address, selected.id)">Open task</Button>
                            <Button variant="ghost" @click="clear">Close</Button>
                        </div>
                        <template v-if="!selected.mayEditWaits">
                            <span class="flex flex-col gap-1">
                                <Button variant="bordered" disabled aria-describedby="graph-change-reason">Change waits</Button>
                                <span id="graph-change-reason" class="text-small text-text-3">{{ selected.reason }}</span>
                            </span>
                        </template>
                    </aside>
                </template>
            </div>
        </template>
    </section>
</template>
