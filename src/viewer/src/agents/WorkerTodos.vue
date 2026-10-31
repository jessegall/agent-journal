<script setup>
import {computed, ref} from "vue";
import WorkerQueue from "./WorkerQueue.vue";

const props = defineProps({todos: {type: Array, required: true}, queue: {type: Array, default: () => []}});
const left = computed(() => props.todos.filter((item) => !item.complete));
const done = computed(() => props.todos.filter((item) => item.complete));
const showDone = ref(false);
</script>

<template>
    <div class="todos">
        <template v-if="queue.length">
            <WorkerQueue :queue="queue" />
        </template>
        <template v-for="(item, i) in [...left, ...(showDone ? done : [])]" :key="i">
            <div :class="['todo', {done: item.complete}]">
                <svg class="box" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <rect x="2.5" y="2.5" width="11" height="11" rx="3" />
                    <template v-if="item.complete">
                        <path d="M5.2 8.2l2 2 3.6-4" />
                    </template>
                </svg>
                <span>{{ item.text }}</span>
            </div>
        </template>
        <template v-if="done.length">
            <button type="button" class="more" @click="showDone = !showDone">{{ showDone ? "Hide the done" : `Show the ${done.length} done` }}</button>
        </template>
        <p class="foot-note">The worker's own steps, kept with journal todo; they are not the points of the task it works on.</p>
    </div>
</template>
<style scoped>
.todos {
    display: flex;
    flex-direction: column;
}

.todo {
    display: grid;
    grid-template-columns: 14px minmax(0, 1fr);
    gap: 10px;
    padding: 7px 16px;
    color: var(--text);
    text-wrap: pretty;
}

.todo.done {
    color: var(--text-4);
}

.more {
    align-self: flex-start;
    margin: 6px 16px 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: 11.5px var(--font);
    text-decoration: underline;
    text-decoration-color: var(--border-3);
    text-underline-offset: 3px;
    cursor: pointer;
}

.more:hover {
    color: var(--text);
}

.box {
    margin-top: 2px;
    fill: none;
    stroke: var(--text-4);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.foot-note {
    margin: 6px 16px 14px;
    color: var(--text-4);
    font-size: 11.5px;
    text-wrap: pretty;
}
</style>
