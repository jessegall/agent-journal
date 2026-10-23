<script setup>
import {computed} from "vue";
import {updatedAt} from "../domain/row.js";
import {STATUS_WORDS, statusOf, waitOf} from "../domain/taskBoard.js";
import {ago} from "../format/time.js";
import TaskChain from "./TaskChain.vue";
import TaskStatusIcon from "./TaskStatusIcon.vue";

const props = defineProps({task: {type: Object, required: true}, tasks: {type: Array, required: true}});
const emit = defineEmits(["status", "select", "answer"]);
const status = computed(() => statusOf(props.task));
const reasonOnly = computed(() => waitOf(props.task)?.kind === "reason");
</script>

<template>
    <div :class="['state-line', status]">
        <button type="button" class="state" title="Change the status (S)" @click="emit('status', $event.currentTarget)">
            <TaskStatusIcon :status="status" />
            {{ STATUS_WORDS[status] }}
        </button>
        <span class="since">since {{ ago(updatedAt(task)) || "just now" }}</span>
    </div>
    <template v-if="status === 'parked'">
        <section :class="['reason', status]">
            <span class="label">Parking reason</span>
            <p class="text">{{ task.suspension_reason }}</p>
            <p class="note">The journal stops reminding the agent about it until it is resumed.</p>
        </section>
    </template>
    <template v-if="status === 'delegated'">
        <section :class="['reason', status]">
            <span class="label">With a worker</span>
            <p class="note">A worker holds it: merging its work finishes it, and releasing the worker opens it again.</p>
        </section>
    </template>
    <template v-if="status === 'blocked'">
        <section :class="['reason', status]">
            <span class="label">Blocked, waiting on</span>
            <template v-if="reasonOnly">
                <p class="text">{{ task.block_reason }}</p>
                <p class="note">Nothing opens it by itself. Unblock it when that is done.</p>
            </template>
            <template v-else>
                <TaskChain :task="task" :tasks="tasks" @select="emit('select', $event)" @answer="emit('answer', $event)" />
            </template>
        </section>
    </template>
</template>

<style scoped>
.state-line {
    --tone: var(--text-3);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}

.state-line.started {
    --tone: var(--accent-text);
}

.state-line.blocked {
    --tone: var(--tone-warn);
}

.state-line.parked {
    --tone: var(--tone-helper);
}

.state-line.delegated {
    --tone: var(--delegated);
}

.state-line.done {
    --tone: var(--tone-good);
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
    transition: background-color 0.12s ease;
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

.reason.parked {
    border-left-color: var(--tone-helper);
}

.reason .label {
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
