<script setup>
import TextDisplay from "../kit/TextDisplay.vue";
import {peek} from "../route.js";
import {meta} from "../state/store.js";

defineProps({made: {type: Object, required: true}});
</script>

<template>
    <button type="button" class="thread-made" @click="peek(made.type, made.n)">
        <span class="thread-made-kind">{{ meta(made.type).title }} created</span>
        <span class="thread-made-title">{{ made.title }}</span>
        <template v-if="made.abstract">
            <TextDisplay inline class="thread-made-line" :text="made.abstract" />
        </template>
    </button>
</template>

<style scoped>
.thread-made {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: 420px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.thread-made:hover {
    border-color: var(--accent);
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
