<script setup>
import TaskStatusIcon from "./TaskStatusIcon.vue";

defineProps({
    status: {type: String, default: ""},
    number: {type: String, default: ""},
    title: {type: String, required: true},
    word: {type: String, required: true},
    outside: Boolean,
    current: Boolean,
    still: Boolean,
    open: {type: Function, default: () => null},
});
</script>

<template>
    <component
        :is="still || current ? 'div' : 'button'"
        :type="still || current ? undefined : 'button'"
        :class="['task-chain-link', {outside, current, still}]"
        @click="open()"
    >
        <template v-if="status">
            <TaskStatusIcon :status="status" />
        </template>
        <template v-if="number">
            <span class="number">{{ number }}</span>
        </template>
        <span :class="['title', {mono: !status}]">{{ title }}</span>
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

.task-chain-link.current,
.task-chain-link.still {
    cursor: default;
}

.task-chain-link.current {
    border-color: var(--border-3);
    background: var(--sel);
}

.task-chain-link.still:hover {
    background: none;
}

.task-chain-link.outside {
    border-style: dashed;
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

.title.mono {
    font: 11.5px var(--mono);
}

.word {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}
</style>
