<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";
import {workerName} from "../domain/workers.js";

// The mark of a task that is with a worker, beside the task's own state: a small worker icon, the worker's name in its tip
const props = defineProps({task: {type: Object, required: true}});
const scope = useScope();
const worker = computed(() => (scope.rows("workers") || []).find((row) => row.id === props.task.worker_id) || null);
const words = computed(() => (worker.value ? `With ${workerName(worker.value)}` : "With a worker"));
</script>

<template>
    <span class="task-worker" :title="words" :aria-label="words"><Icon name="bot" :size="12" /></span>
</template>

<style scoped>
.task-worker {
    display: inline-grid;
    flex: none;
    place-items: center;
    color: var(--delegated);
}
</style>
