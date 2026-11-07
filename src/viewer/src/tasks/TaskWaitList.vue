<script setup>
import TaskStatusIcon from "./TaskStatusIcon.vue";
import {statusIcon as iconOf} from "../domain/taskStatus.js";

// one titled list of the tasks a task depends on; a click opens the task
defineProps({title: {type: String, required: true}, waits: {type: Array, required: true}});
const emit = defineEmits(["select"]);
</script>

<template>
    <section class="part" data-resource-waits>
        <h4>{{ title }}</h4>
        <template v-for="wait in waits" :key="wait.id">
            <button type="button" class="wait" @click="emit('select', wait.id)">
                <TaskStatusIcon :status="iconOf(wait.state)" :size="12" />
                <span class="wait-id">{{ wait.id }}</span>
                <span class="wait-title">{{ wait.title }}</span>
            </button>
        </template>
    </section>
</template>

<style scoped>
.part {
    margin-bottom: 18px;
}

.part h4 {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.wait {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    padding: 5px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.wait:hover {
    background: var(--hover);
    color: var(--text);
}

.wait-id {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.wait-title {
    min-width: 0;
    overflow-wrap: anywhere;
}
</style>
