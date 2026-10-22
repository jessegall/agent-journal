<script setup>
import {meta} from "../domain/tables.js";
import TextDisplay from "../kit/TextDisplay.vue";
import {peek} from "../route.js";

defineProps({made: {type: Object, required: true}});
</script>

<template>
    <div class="thread-made">
        <button type="button" class="thread-made-open" @click="peek(made.table, made.id)">
            <span class="thread-made-kind">{{ meta(made.table).title }} created</span>
            <span class="thread-made-title">{{ made.title }}</span>
            <template v-if="made.line">
                <TextDisplay inline class="thread-made-line" :text="made.line" />
            </template>
        </button>
    </div>
</template>

<style scoped>
.thread-made {
    display: flex;
    flex-direction: column;
    max-width: 420px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    color: var(--text);
}

.thread-made:hover {
    border-color: var(--accent);
}

.thread-made-open {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 10px 12px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.thread-made-kind {
    color: var(--created);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.thread-made-title {
    font-weight: 500;
}

.thread-made-line {
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
