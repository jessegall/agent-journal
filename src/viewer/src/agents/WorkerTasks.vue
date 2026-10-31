<script setup>
import {peek} from "../route.js";
import WorkerQueue from "./WorkerQueue.vue";

defineProps({worked: {type: Array, required: true}, queue: {type: Array, default: () => []}});
</script>

<template>
    <div class="tasks">
        <template v-for="task in worked" :key="task.id">
            <div :class="['worked', {done: task.state === 'done' || task.state === 'merged'}]">
                <a href="#" class="worked-task" @click.prevent="peek('tasks', task.id)">Task {{ task.id }}: {{ task.title }}</a>
                <span class="worked-state">{{ task.state }}</span>
            </div>
        </template>
        <template v-if="queue.length">
            <WorkerQueue :queue="queue" />
        </template>
    </div>
</template>
<style scoped>
.tasks {
    display: flex;
    flex-direction: column;
}

.worked {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 7px 16px;
    color: var(--text);
    text-wrap: pretty;
}

.worked.done {
    color: var(--text-4);
}

.worked-task {
    color: inherit;
    text-decoration: none;
}

.worked-task:hover {
    color: var(--text);
}

.worked-state {
    flex: none;
    color: var(--text-4);
    font-size: 11.5px;
}
</style>
