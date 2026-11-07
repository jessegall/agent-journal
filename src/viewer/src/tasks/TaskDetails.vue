<script setup>
import TimeAgo from "../../kit/TimeAgo.vue";
import {updatedAt} from "../domain/row.js";
import {statusIcon} from "../domain/taskStatus.js";
import TaskFacts from "./TaskFacts.vue";
import TaskChain from "./TaskChain.vue";
import TaskBlockRenewals from "./TaskBlockRenewals.vue";
import TaskSections from "./TaskSections.vue";
import TaskStatusIcon from "./TaskStatusIcon.vue";

defineProps({task: {type: Object, required: true}, place: {type: Object, default: null}, graph: {type: Object, default: null}, refusal: {type: String, default: ""}});
const emit = defineEmits(["status", "priority", "complexity", "select"]);
const label = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
</script>

<template>
    <div class="task-details" data-task-details>
        <div :class="['state-line', statusIcon(task.state)]">
            <button type="button" class="state" data-task-state title="Change the status (S)" @click="emit('status', $event.currentTarget)">
                <TaskStatusIcon :status="statusIcon(task.state)" />
                {{ label(task.state) }}
            </button>
            <span class="since">
                since
                <TimeAgo :at="updatedAt(task)" />
            </span>
        </div>
        <template v-if="task.state === 'blocked'">
            <section class="reason" data-task-reason>
                <span class="label">Blocked, waiting on</span>
                <p class="text">{{ task.reason || "Other tasks" }}</p>
                <template v-if="task.openers?.length">
                    <p class="note" data-task-openers>Opens by itself when {{ task.openers.join(" or ") }}.</p>
                </template>
                <template v-else>
                    <p class="note">Nothing opens this task automatically. Unblock it when it is ready to continue.</p>
                </template>
            </section>
        </template>
        <template v-else-if="task.state === 'cancelled' && task.reason">
            <section class="reason" data-task-reason>
                <span class="label">Why it was cancelled</span>
                <p class="text">{{ task.reason }}</p>
            </section>
        </template>
        <template v-if="graph">
            <TaskChain :task="task" :graph="graph" @select="emit('select', $event)" />
        </template>
        <TaskFacts :task="task" :place="place" :refusal="refusal" @priority="emit('priority', $event)" @complexity="emit('complexity', $event)" />
        <TaskSections :task="task" @select="emit('select', $event)" />
        <TaskBlockRenewals :renewals="task.block_renewals" />
    </div>
</template>

<style scoped>
.task-details {
    flex: 1;
    overflow: auto;
    padding: 18px 20px 28px;
    scrollbar-width: thin;
}
.state-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}
.state {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    margin: -1px 0 -1px -7px;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text);
    font: 12.5px var(--font);
    cursor: pointer;
}
.state:hover {
    background: var(--hover);
}
.since {
    color: var(--text-3);
    font-size: 12px;
}
.reason {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 18px;
    padding-left: 12px;
    border-left: 2px solid var(--tone-warn);
}
.label {
    color: var(--text-4);
    font-size: 11.5px;
}
.text {
    margin: 0;
    color: var(--text-2);
    white-space: pre-wrap;
    text-wrap: pretty;
}
.note {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
