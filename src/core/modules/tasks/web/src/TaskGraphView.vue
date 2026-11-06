<script setup>
import {computed} from "vue";
import {Skeleton, TaskStatusIcon, useWindow} from "@journal/window-kit";
import {NODE, taskGraphLayout} from "./taskGraphLayout.js";

// what waits on what among the unfinished tasks: each task a card, a line from what it waits on to it
defineProps({selected: {type: Number, default: 0}});
const emit = defineEmits(["select"]);
const window = useWindow();
window.state.tab = "graph";
const {data: graph, failure} = window.props.graph;
const layout = computed(() => taskGraphLayout(graph.value?.tasks ?? [], graph.value?.edges ?? []));
const path = (line) => {
    const fromX = line.from.x + NODE.width;
    const fromY = line.from.y + NODE.height / 2;
    const toY = line.to.y + NODE.height / 2;
    const middle = (fromX + line.to.x) / 2;
    return `M ${fromX} ${fromY} C ${middle} ${fromY}, ${middle} ${toY}, ${line.to.x} ${toY}`;
};

</script>

<template>
    <div class="graph" data-task-graph>
        <template v-if="failure">
            <p class="graph-note">{{ failure }}</p>
        </template>
        <template v-else-if="!graph">
            <Skeleton shape="rows" />
        </template>
        <template v-else-if="!layout.nodes.length">
            <p class="graph-note">Task dependencies appear here when one task is blocked by another.</p>
        </template>
        <template v-else>
            <div class="graph-canvas" :style="{width: `${layout.width}px`, height: `${layout.height}px`}">
                <svg class="graph-lines" :width="layout.width" :height="layout.height" aria-hidden="true">
                    <template v-for="line in layout.lines" :key="line.key">
                        <path :d="path(line)" data-graph-line />
                    </template>
                </svg>
                <template v-for="node in layout.nodes" :key="node.task.id">
                    <button type="button" :class="['graph-node', {selected: node.task.id === selected}]" :style="{left: `${node.x}px`, top: `${node.y}px`, width: `${NODE.width}px`, height: `${NODE.height}px`}" :data-graph-node="node.task.id" @click="emit('select', node.task.id)">
                        <TaskStatusIcon :status="node.task.state" />
                        <span class="graph-title">{{ node.task.id }} {{ node.task.title }}</span>
                    </button>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.graph {
    overflow: auto;
    padding: 16px 20px;
}

.graph-note {
    margin: 0;
    color: var(--text-2);
}

.graph-canvas {
    position: relative;
}

.graph-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.graph-lines path {
    fill: none;
    stroke: var(--border-2);
    stroke-width: 1.5;
}

.graph-node {
    position: absolute;
    display: flex;
    gap: 8px;
    align-items: center;
    box-sizing: border-box;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.graph-node:hover,
.graph-node.selected {
    border-color: var(--accent);
}

.graph-title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 12.5px;
    line-height: 1.3;
}
</style>
