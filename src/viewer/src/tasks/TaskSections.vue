<script setup>
import {ref} from "vue";
import TaskStatusIcon from "./TaskStatusIcon.vue";
import {statusIcon as iconOf} from "../domain/taskStatus.js";

// what a task says at length: what it waits on, how it was done, its brief and its log
const LONG_BRIEF = 180;
defineProps({task: {type: Object, required: true}});
const emit = defineEmits(["select"]);
const briefWhole = ref(false);
</script>

<template>
    <template v-if="task.waits.length">
        <section class="part" data-resource-waits>
            <h4>Waits on</h4>
            <template v-for="wait in task.waits" :key="wait.id">
                <button type="button" class="wait" @click="emit('select', wait.id)">
                    <TaskStatusIcon :status="iconOf(wait.state)" :size="12" />
                    <span class="wait-id">{{ wait.id }}</span>
                    <span class="wait-title">{{ wait.title }}</span>
                </button>
            </template>
        </section>
    </template>
    <template v-if="task.state === 'completed' && task.outcome">
        <section class="part" data-task-outcome>
            <h4>How it was done</h4>
            <p class="text">{{ task.outcome }}</p>
        </section>
    </template>
    <template v-if="task.brief">
        <section class="part" data-task-brief>
            <h4>The brief</h4>
            <p :class="['text', {clamped: !briefWhole}]">{{ task.brief }}</p>
            <template v-if="task.brief.length > LONG_BRIEF && !briefWhole">
                <button type="button" class="more" @click="briefWhole = true">Show the whole brief</button>
            </template>
        </section>
    </template>
    <template v-if="task.logs.length">
        <section class="part" data-resource-logs>
            <h4>Log</h4>
            <template v-for="log in task.logs" :key="log.id">
                <p class="log">{{ log.line }}</p>
            </template>
        </section>
    </template>
</template>

<style scoped>
.text {
    margin: 0;
    color: var(--text-2);
    white-space: pre-wrap;
    text-wrap: pretty;
}

.part {
    margin-bottom: 18px;
}

.part h4 {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.text.clamped {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.more {
    margin-top: 4px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: 12px var(--font);
    cursor: pointer;
}

.more:hover {
    color: var(--text);
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

.log {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.45;
    overflow-wrap: anywhere;
}
</style>
