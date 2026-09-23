<script setup>
import {computed} from "vue";
import {peek} from "../route.js";

const props = defineProps({tasks: {type: Array, required: true}});
const LABELS = {done: "done", doing: "in hand", waiting: "waiting"};
const done = computed(() => props.tasks.filter((task) => task.state === "done").length);
</script>

<template>
    <div class="tasks">
        <template v-if="tasks.length">
            <p class="progress">{{ done }} of {{ tasks.length }} done</p>
            <template v-for="task in tasks" :key="task.n">
                <button type="button" :class="['task', task.state]" @click="peek('todo', task.n)">
                    <span class="dot" />
                    <span class="task-title">{{ task.title }}</span>
                    <span class="task-state">{{ LABELS[task.state] }}</span>
                </button>
            </template>
        </template>
        <template v-else>
            <p class="none">No tasks handed to this subagent.</p>
        </template>
    </div>
</template>

<style scoped>
.tasks {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.progress {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
}

.task {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.task:hover {
    background: var(--hover);
}

.dot {
    flex: none;
    width: 7px;
    height: 7px;
    border: 1.5px solid var(--text-3);
    border-radius: 50%;
}

.doing .dot {
    border-color: var(--accent);
    background: var(--accent);
}

.done .dot {
    border-color: var(--green, #5fb37a);
    background: var(--green, #5fb37a);
}

.done .task-title {
    color: var(--text-3);
    text-decoration: line-through;
}

.task-title {
    flex: 1;
    min-width: 0;
}

.task-state {
    color: var(--text-3);
    font-size: 11.5px;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}
</style>
