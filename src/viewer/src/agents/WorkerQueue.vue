<script setup>
import {peek} from "../route.js";

defineProps({queue: {type: Array, required: true}});
</script>

<template>
    <div class="queued" data-worker-queue>
        <span class="queued-label">Queued next</span>
        <template v-for="queued in queue" :key="queued.id">
            <a href="#" class="queued-task" @click.prevent="peek('tasks', queued.id)">Task {{ queued.id }}: {{ queued.title }}</a>
        </template>
    </div>
</template>
<style scoped>
.queued {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 16px 10px;
}

.queued-label {
    color: var(--text-4);
    font-size: 11.5px;
}

.queued-task {
    color: var(--accent-text);
    font-size: 12.5px;
    text-decoration: none;
    text-wrap: pretty;
}

.queued-task:hover {
    color: var(--text);
}
</style>
