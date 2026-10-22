<script setup>
import {computed} from "vue";
import {useScope} from "../composables/scope.js";
import WorkerShift from "./WorkerShift.vue";

const props = defineProps({task: {type: Object, required: true}});
const {api} = useScope();
const work = computed(() => props.task.work || {task_id: null, points: [], todos: [], proofs: []});
const worker = computed(() => ({id: props.task.worker_id, state: "", task: work.value}));
const shown = computed(() => work.value.proofs.length > 0 || work.value.todos.length > 0);
</script>

<template>
    <template v-if="shown">
        <WorkerShift :worker="worker" :api="api" />
    </template>
</template>
