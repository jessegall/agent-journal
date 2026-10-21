<script setup>
import TaskStatusIcon from "./TaskStatusIcon.vue";

defineProps({
    place: {type: Object, required: true},
    status: {type: String, default: ""},
    number: {type: String, default: ""},
    label: {type: String, default: ""},
    word: {type: String, required: true},
    text: {type: String, required: true},
    why: {type: String, default: ""},
    mono: Boolean,
    outside: Boolean,
    selected: Boolean,
    dim: Boolean,
    open: {type: Function, required: true},
});
</script>

<template>
    <div :class="['task-graph-node', {dim}]" :style="place">
        <button type="button" :class="['box', {outside, selected}]" :title="text" @click="open()">
            <span class="top">
                <template v-if="status">
                    <TaskStatusIcon :status="status" :size="13" />
                </template>
                <template v-if="number">
                    <span class="number">{{ number }}</span>
                </template>
                <template v-if="label">
                    <span>{{ label }}</span>
                </template>
                <span class="word">{{ word }}</span>
            </span>
            <span :class="['text', {mono}]">{{ text }}</span>
        </button>
        <template v-if="why">
            <span class="why">Why: {{ why }}</span>
        </template>
    </div>
</template>

<style scoped>
.task-graph-node {
    position: absolute;
    transition:
        left 0.24s var(--ease),
        top 0.24s var(--ease),
        opacity 0.15s ease;
}

.task-graph-node.dim {
    opacity: 0.35;
}

.box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    width: 100%;
    height: 52px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.12s ease,
        background-color 0.12s ease;
}

.box:hover {
    border-color: var(--border-3);
}

.box.selected {
    border-color: var(--border-3);
    background: var(--sel);
}

.box.outside {
    border-style: dashed;
    background: var(--bg);
}

.top {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    color: var(--text-3);
    font-size: 11.5px;
    white-space: nowrap;
}

.number {
    color: var(--text-4);
    font: 11px var(--mono);
}

.word {
    margin-left: auto;
}

.text {
    width: 100%;
    overflow: hidden;
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.text.mono {
    font: 11.5px var(--mono);
}

.why {
    position: absolute;
    top: calc(100% + 3px);
    left: 2px;
    width: 100%;
    overflow: hidden;
    color: var(--text-3);
    font-size: 11.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
    .task-graph-node,
    .box {
        transition: none;
    }
}
</style>
