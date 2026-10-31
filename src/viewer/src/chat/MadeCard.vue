<script setup>
import {computed} from "vue";
import MarkIcon from "../kit/MarkIcon.vue";
import {meta} from "../domain/tables.js";
import {peek} from "../route.js";

// a document or report the agent made: a small card in the agent's colour with what it is, its title and its summary, saying it is still
// being written while it is, that opens the row on a click
const props = defineProps({made: {type: Object, required: true}});
const kindWord = computed(() => `${meta(props.made.table).title} ${props.made.id}`);
const writing = computed(() => props.made.status === "Being written");
</script>

<template>
    <button type="button" class="thread-made" :data-figure-mark="`made:${made.table}:${made.id}`" :title="`Open the ${meta(made.table).title.toLowerCase()}`" @click="peek(made.table, made.id)">
        <span class="made-tile"><MarkIcon name="document" /></span>
        <span class="made-kind">{{ kindWord }}</span>
        <span class="made-title">{{ made.title }}</span>
        <template v-if="made.status">
            <span :class="['made-status', {writing}]">{{ made.status }}</span>
        </template>
        <template v-if="made.summary">
            <span class="made-sum">{{ made.summary }}</span>
        </template>
    </button>
</template>

<style scoped>
.thread-made {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 1px 10px;
    max-width: min(520px, 100%);
    padding: 8px 12px 8px 9px;
    border: 1px solid var(--border);
    border-radius: 11px;
    background: var(--bg);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s ease;
}

.thread-made:hover {
    border-color: var(--border-3);
}

.made-tile {
    display: grid;
    grid-row: span 2;
    place-items: center;
    align-self: start;
    width: 28px;
    height: 32px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--group-agent) 14%, transparent);
    color: var(--group-agent);
}

.made-kind {
    color: var(--text-4);
    font-size: 10.5px;
}

.made-title {
    grid-column: 2;
    overflow: hidden;
    color: var(--text);
    font-size: 12.5px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.made-status {
    grid-row: 1 / span 2;
    grid-column: 3;
    color: var(--text-4);
    font-size: 11px;
}

.made-status.writing {
    color: var(--accent-text);
    animation: breathe 1.6s ease-in-out infinite;
}

@keyframes breathe {
    50% {
        opacity: 0.45;
    }
}

.made-sum {
    grid-column: 2 / -1;
    margin-top: 4px;
    color: var(--text-2);
    font-size: 12px;
}
</style>
