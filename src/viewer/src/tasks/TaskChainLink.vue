<script setup>
import TaskStatusIcon from "./TaskStatusIcon.vue";

defineProps({
    status: {type: String, required: true},
    number: {type: Number, required: true},
    title: {type: String, required: true},
    word: {type: String, required: true},
    current: Boolean,
});
const emit = defineEmits(["select"]);
</script>

<template>
    <component :is="current ? 'div' : 'button'" :type="current ? undefined : 'button'" :class="['task-chain-link', {current}]" @click="emit('select', number)">
        <TaskStatusIcon :status="status" />
        <span class="number">{{ number }}</span>
        <span class="title">{{ title }}</span>
        <span class="word">{{ word }}</span>
    </component>
</template>

<style scoped>
.task-chain-link {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: none;
    color: var(--text);
    font: 12.5px var(--font);
    text-align: left;
    cursor: pointer;
    transition: background-color 0.12s ease;
}
.task-chain-link:hover {
    background: var(--hover);
}
.task-chain-link.current {
    border-color: var(--border-3);
    background: var(--sel);
    cursor: default;
}
.number {
    flex: none;
    color: var(--text-4);
    font: 11.5px var(--mono);
}
.title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.word {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}
</style>
