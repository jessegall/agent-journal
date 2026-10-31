<script setup>
import {computed} from "vue";
import {useScope} from "../composables/scope.js";
import WorkerPoints from "../agents/WorkerPoints.vue";
import WorkerTodos from "../agents/WorkerTodos.vue";

const props = defineProps({task: {type: Object, required: true}});
const {api} = useScope();
const work = computed(() => props.task.work || {task_id: null, points: [], todos: [], proofs: []});
const shown = computed(() => work.value.proofs.length > 0 || work.value.todos.length > 0);
</script>

<template>
    <template v-if="shown">
        <section class="work">
            <h4>Points</h4>
            <WorkerPoints :task="work" :worker="task.worker_id || 0" :api="api" />
            <template v-if="work.todos.length">
                <h4>The worker's tasks</h4>
                <WorkerTodos :todos="work.todos" />
            </template>
        </section>
    </template>
</template>

<style scoped>
.work {
    margin: 0 -16px 18px;
}

.work h4 {
    margin: 0 16px 2px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}
</style>
