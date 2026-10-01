<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import GoalPoints from "./GoalPoints.vue";
import {useOutside} from "../composables/outside.js";

const props = defineProps({board: {type: Object, required: true}});
const goal = computed(() => props.board.data.goal || "");
const clauses = computed(() => props.board.data.done_when || []);
const points = computed(() => `${clauses.value.length} ${clauses.value.length === 1 ? "point" : "points"}`);
const open = ref(false);
const band = ref(null);
useOutside(band, () => (open.value = false));
</script>

<template>
    <template v-if="goal || clauses.length">
        <section ref="band" class="board-goal">
            <span class="board-goal-label">Goal</span>
            <button type="button" class="board-goal-text" :aria-expanded="open" @click="open = !open">{{ goal || "Done when" }}</button>
            <template v-if="clauses.length">
                <button type="button" :class="['board-goal-count', {open}]" :aria-expanded="open" @click="open = !open">
                    <span class="board-goal-done-when">Done when ·</span>
                    {{ points }}
                    <Icon name="caret" :size="12" :class="{flip: open}" />
                </button>
            </template>
            <template v-if="open">
                <div class="board-goal-panel">
                    <GoalPoints :goal="goal" :points="clauses" />
                </div>
            </template>
        </section>
    </template>
</template>

<style scoped>
.board-goal {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 34px;
    padding: 0 12px 0 20px;
    border-bottom: 1px solid var(--border);
    font-size: 12.5px;
}

.board-goal-label {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.board-goal-text {
    flex: 1;
    min-width: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.board-goal-text:hover {
    color: var(--text);
    text-decoration: underline;
    text-decoration-color: var(--border-3);
    text-underline-offset: 3px;
}

.board-goal-count {
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    white-space: nowrap;
    cursor: pointer;
}

.board-goal-count:hover,
.board-goal-count.open {
    background: var(--hover);
    color: var(--text);
}

.flip {
    transform: rotate(180deg);
}

.board-goal-panel {
    position: absolute;
    top: 38px;
    right: 12px;
    left: 12px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: #1a1b1f;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
    animation: fade-in 0.18s ease-out both;
}

.board-goal-panel :deep(.goal-whole) {
    margin: 0;
    color: var(--text);
    font-size: 13.5px;
    line-height: 1.5;
}

.board-goal-panel :deep(.goal-points) {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin: 0;
    padding: 0 0 0 20px;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.45;
}

.board-goal-panel :deep(.goal-whole + .goal-points) {
    padding-top: 12px;
    border-top: 1px solid var(--border);
}

.board-goal-panel :deep(.goal-points li::marker) {
    color: var(--text-4);
    font-size: 11px;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
}

@media (max-width: 640px) {
    .board-goal {
        height: 40px;
        padding: 0 8px 0 14px;
    }

    .board-goal-done-when {
        display: none;
    }
}
</style>
