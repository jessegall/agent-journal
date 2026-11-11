<script setup>
import {computed} from "vue";
import {peekRef, wordLabel} from "@journal/window-kit";

// one memory in a list: its text, then its state and weight with a mark of ten steps, the task it belongs to and the reason it was removed
const HIGHEST_WEIGHT = 10;
const props = defineProps({row: {type: Object, required: true}});
const facts = computed(() => [props.row.task_id ? `Task ${props.row.task_id}` : "", props.row.reason ? `Reason: ${props.row.reason}` : ""].filter(Boolean));
</script>

<template>
    <button type="button" :class="['memory', {removed: row.state === 'removed'}]" :data-memory="row.id" @click="peekRef(`memories:${row.id}`)">
        <span class="memory-text">{{ row.text }}</span>
        <span class="memory-meta">
            <span data-memory-state>State: {{ wordLabel(row.state) }}</span>
            <span class="memory-weight" data-memory-weight>
                Weight: {{ row.weight }} of {{ HIGHEST_WEIGHT }}
                <span class="steps" aria-hidden="true">
                    <template v-for="step in HIGHEST_WEIGHT" :key="step"><i :class="{on: step <= row.weight}" /></template>
                </span>
            </span>
            <template v-for="fact in facts" :key="fact">
                <span>{{ fact }}</span>
            </template>
        </span>
    </button>
</template>

<style scoped>
.memory {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
    padding: 9px 0;
    border: 0;
    border-bottom: 1px solid var(--border-inner);
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.memory:hover .memory-weight {
    display: inline-flex;
    gap: 6px;
    align-items: center;
}

.steps {
    display: inline-flex;
    gap: 2px;
}

.steps i {
    width: 4px;
    height: 8px;
    border-radius: 1px;
    background: var(--border-2);
}

.steps i.on {
    background: var(--text-3);
}

.memory-text {
    color: var(--accent-text);
}

.memory:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
}

.memory.removed .memory-text {
    color: var(--text-3);
}

.memory-text {
    max-width: 74ch;
}

.memory-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 12px;
    color: var(--text-3);
    font-size: 12px;
}

@media (max-width: 720px) {
    .memory {
        min-height: 44px;
    }
}
</style>
