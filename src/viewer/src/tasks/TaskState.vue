<script setup>
import {computed} from "vue";
import {updatedAt} from "../domain/row.js";
import {STATUS_PREFIXES, statusOf, waitOf} from "../domain/taskBoard.js";
import {ago} from "../format/time.js";
import {mentionedRefs} from "../domain/mentions.js";
import {refParts} from "../domain/records.js";
import {meta} from "../domain/tables.js";
import TextDisplay from "../kit/TextDisplay.vue";
import {peek} from "../route.js";
import TaskChain from "./TaskChain.vue";
import TaskStatusIcon from "./TaskStatusIcon.vue";
import TaskWorker from "./TaskWorker.vue";

const props = defineProps({task: {type: Object, required: true}, tasks: {type: Array, required: true}});
const emit = defineEmits(["status", "select", "answer"]);
const status = computed(() => statusOf(props.task));
const reasonOnly = computed(() => waitOf(props.task)?.kind === "reason");
const named = computed(() =>
    mentionedRefs(props.task.block_reason).map((ref) => {
        const {table, id} = refParts(ref);
        return {ref, table, id, label: `Open ${meta(table).title.toLowerCase()} ${id}`};
    })
);
</script>

<template>
    <div :class="['state-line', status]">
        <button type="button" class="state" title="Change the status (S)" @click="emit('status', $event.currentTarget)">
            <TaskStatusIcon :status="status" />
            {{ STATUS_PREFIXES[status] }}
        </button>
        <template v-if="task.delegated">
            <TaskWorker :task="task" />
        </template>
        <span class="since">since {{ ago(updatedAt(task)) || "just now" }}</span>
    </div>
    <template v-if="status === 'paused'">
        <section :class="['reason', status]">
            <span class="label">Pausing reason</span>
            <p class="text">{{ task.pause_reason }}</p>
            <p class="note">The journal stops reminding the agent about it until it is resumed.</p>
        </section>
    </template>
    <template v-if="task.delegated">
        <section class="reason delegated">
            <span class="label">With a worker</span>
            <p class="note">A worker holds it: merging its work finishes it, and releasing the worker opens it again.</p>
        </section>
    </template>
    <template v-if="status === 'blocked'">
        <section :class="['reason', status]">
            <span class="label">Blocked, waiting on</span>
            <template v-if="reasonOnly">
                <TextDisplay class="text" :text="task.block_reason" />
                <template v-if="named.length">
                    <div class="named">
                        <template v-for="row in named" :key="row.ref">
                            <button type="button" class="open-named" @click="peek(row.table, row.id)">{{ row.label }}</button>
                        </template>
                    </div>
                </template>
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

.state-line.paused {
    --tone: var(--tone-helper);
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

.reason.paused {
    border-left-color: var(--tone-helper);
}

.reason.delegated {
    border-left-color: var(--delegated);
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

.named {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.open-named {
    height: 26px;
    padding: 0 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.open-named:hover {
    border-color: var(--border-2);
    background: var(--hover);
}

.note {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
