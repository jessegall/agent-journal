<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {nextAct, STATUS_WORDS, statusOf, waitLine} from "../domain/taskBoard.js";
import {taskBoard} from "../state/taskBoard.js";
import TaskStatusIcon from "./TaskStatusIcon.vue";

const props = defineProps({task: {type: Object, required: true}, depth: {type: Number, default: 1}, selected: Boolean});
const emit = defineEmits(["select", "act", "status", "more"]);
const status = computed(() => statusOf(props.task));
const next = computed(() => nextAct(props.task));
const wait = computed(() => (taskBoard.display.wait ? waitLine(props.task) : ""));
</script>

<template>
    <div :class="['task-row', `depth-${depth}`, {selected, done: status === 'done'}]" :data-task="task.id" @click="emit('select')">
        <button
            type="button"
            class="status"
            :title="`${STATUS_WORDS[status]}. Change the status (S)`"
            @click.stop="emit('status', $event.currentTarget)"
        >
            <TaskStatusIcon :status="status" />
        </button>
        <template v-if="taskBoard.display.number">
            <span class="number">{{ task.id }}</span>
        </template>
        <span class="title">{{ task.title }}</span>
        <template v-if="wait">
            <span class="wait">{{ wait }}</span>
        </template>
        <span class="acts" @click.stop>
            <template v-if="next">
                <Btn small @click="emit('act', next.name)">{{ next.label }}</Btn>
            </template>
            <Btn small :title="`More for task ${task.id} (.)`" @click="emit('more', $event.currentTarget)">
                <Icon name="more" :size="13" />
            </Btn>
        </span>
    </div>
</template>

<style scoped>
.task-row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 36px;
    padding: 0 16px 0 34px;
    cursor: default;
    user-select: none;
    transition: background-color 0.12s ease;
}

.task-row.depth-0 {
    padding-left: 16px;
}

.task-row.depth-2 {
    padding-left: 52px;
}

.task-row:hover {
    background: var(--hover);
}

.task-row.selected {
    background: var(--sel);
}

.status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin: 0 -4px;
    padding: 0;
    border: 0;
    border-radius: 5px;
    background: none;
    cursor: pointer;
}

.status:hover {
    background: var(--border-2);
}

.number {
    flex: none;
    width: 30px;
    color: var(--text-4);
    font: 11.5px var(--mono);
    font-variant-numeric: tabular-nums;
}

.title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.done .title {
    color: var(--text-3);
}

.wait {
    flex: none;
    max-width: 46%;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.acts {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: none;
    align-items: center;
    gap: 4px;
    padding: 0 10px 0 14px;
    background: inherit;
}

.task-row:hover .acts,
.task-row.selected .acts {
    display: flex;
}
</style>
