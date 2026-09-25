<script setup>
import {computed, ref} from "vue";

const props = defineProps({board: {type: Object, required: true}});
const goal = computed(() => props.board.data.goal || "");
const clauses = computed(() => props.board.data.done_when || []);
const open = ref(false);
</script>

<template>
    <template v-if="goal || clauses.length">
        <section class="board-goal">
            <button type="button" class="board-goal-bar" :aria-expanded="open" @click="open = !open">
                <span class="board-goal-label">Goal</span>
                <span class="board-goal-text">{{ goal || "Done when" }}</span>
                <template v-if="clauses.length">
                    <span class="board-goal-count">{{ clauses.length }} done when {{ open ? "▴" : "▾" }}</span>
                </template>
            </button>
            <template v-if="open && clauses.length">
                <ol class="board-goal-done">
                    <template v-for="(clause, i) in clauses" :key="i">
                        <li>{{ clause }}</li>
                    </template>
                </ol>
            </template>
        </section>
    </template>
</template>

<style scoped>
.board-goal {
    display: flex;
    flex-direction: column;
    margin: 0 0 14px;
    border: 1px solid var(--border);
    border-radius: 11px;
    background: var(--raised);
}

.board-goal-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 8px 12px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.board-goal-label {
    flex: none;
    color: var(--text-4);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.board-goal-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.board-goal-count {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.board-goal-bar:hover .board-goal-count {
    color: var(--text);
}

.board-goal-done {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin: 0;
    padding: 8px 12px 10px 32px;
    border-top: 1px solid var(--border);
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.45;
    animation: fade-in 0.18s ease-out both;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}
</style>
