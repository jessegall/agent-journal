<script setup>
import {FoldGroup, peekRef, TaskStatusIcon} from "@journal/window-kit";

defineProps({section: {type: Object, required: true}, open: Boolean});
const emit = defineEmits(["toggle"]);
</script>

<template>
    <FoldGroup :label="section.label" :count="section.tasks.length" :open="open" :data-agent-section="section.state" @toggle="emit('toggle')">
        <template v-for="task in section.tasks" :key="task.id">
            <button type="button" class="agent-task" :data-agent-delegated="task.id" @click="peekRef(`tasks:${task.id}`)">
                <TaskStatusIcon :status="task.state" />
                <span class="agent-task-number">{{ task.id }}</span>
                <span class="agent-task-title">{{ task.title }}</span>
                <template v-if="task.plan_id">
                    <span class="agent-task-plan" data-agent-task-plan :title="`Plan ${task.plan_id}: ${task.plan_title}`">Plan {{ task.plan_id }}</span>
                </template>
            </button>
        </template>
    </FoldGroup>
</template>

<style scoped>
.agent-task {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
    padding: 3px 4px;
    border: 0;
    border-radius: 4px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.agent-task:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-task-number {
    flex: none;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.agent-task-title {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.agent-task-plan {
    flex: 0 2 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 11px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.agent-task { width: 100%; padding: 7px 14px; border-radius: 0; }

.agent-task-number { min-width: 30px; }
</style>
