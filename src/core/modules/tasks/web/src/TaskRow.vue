<script setup>
import {TaskStatusIcon, copying, peekRef, short, useWindow, vContext} from "@journal/window-kit";
import MarkIcon from "../../../../../viewer/src/kit/MarkIcon.vue";
import TaskRowIcons from "./TaskRowIcons.vue";

// one task as the Tasks window, its dialog and a plan's phases draw it; a selectable row reports the pick, any other opens the task in the inspector
const props = defineProps({
    row: {type: Object, required: true},
    selectable: Boolean,
    selected: Boolean,
    display: {type: Object, default: () => ({number: true, reason: false})},
});
const emit = defineEmits(["select"]);
const view = useWindow();
const pick = () => (props.selectable ? emit("select", props.row.id) : peekRef(`tasks:${props.row.id}`));
const setPriority = (priority) => view.run(["task", "edit", String(props.row.id), "--priority", String(priority)]);
// the menu of a right click on the task: open it, copy its number or title, cancel it with an Undo that reopens it
const OPEN_STATES = new Set(["open", "started", "blocked", "testing"]);
const place = () => ({
    head: `Task ${props.row.id}`,
    items: [
        {label: "Open", group: "open", run: () => peekRef(`tasks:${props.row.id}`)},
        {label: "Copy number", group: "copy", run: ({say}) => copying(`task ${props.row.id}`, "the number", say)},
        {label: "Copy title", group: "copy", run: ({say}) => copying(props.row.title, short(props.row.title, 30), say)},
        {label: "Cancel task", danger: true, disabled: !OPEN_STATES.has(props.row.state), reason: "Already closed", run: async ({say}) => {
            const answer = await view.run(["task", "cancel", String(props.row.id), "--reason", "Cancelled from the task list"]);
            say(answer.ok ? `Task ${props.row.id} cancelled` : answer.error, answer.ok ? {line: ["task", "reopen", String(props.row.id)]} : null);
        }},
    ],
});
</script>

<template>
    <div v-context="place" :class="['task', {selected: selectable && selected}]" :data-row="row.id" role="button" tabindex="0" @click="pick" @keydown.enter="pick">
        <TaskStatusIcon :status="row.state" />
        <template v-if="display.number">
            <span class="task-id">{{ row.id }}</span>
        </template>
        <span class="task-what">
            <span class="task-title">{{ row.title }}</span>
            <template v-if="row.tags?.length">
                <span class="task-tags"><template v-for="word in row.tags" :key="word"><span class="task-tag" data-task-tag>{{ word }}</span></template></span>
            </template>
        </span>
        <template v-if="display.reason && row.reason">
            <span class="task-reason" data-task-reason>{{ row.reason }}</span>
        </template>
        <template v-if="row.state === 'blocked' && !row.automatic"><MarkIcon name="warning" class="task-warning" data-task-warning title="Does not open by itself: needs a user" /></template>
        <TaskRowIcons :row="row" @priority="setPriority" />
    </div>
</template>

<style scoped>
.task-what { display: flex; flex: 1; flex-wrap: wrap; gap: 3px 8px; align-items: baseline; min-width: 0; }
.task-tags { display: flex; flex: none; gap: 4px; }
.task-tag { padding: 0 6px; border: 1px solid var(--border-2); border-radius: 99px; color: var(--text-3); font-size: 11px; line-height: 16px; }
.task-warning { color: var(--danger); flex: none; }

.task-reason {
    overflow: hidden;
    min-width: 0;
    max-width: 40%;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.task {
    cursor: pointer;
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 6px 8px;
    border-radius: 6px;
}

.task:hover {
    background: var(--hover);
}

.task.selected {
    background: var(--raised);
}

.task-id {
    flex: none;
    width: 40px;
    color: var(--text-3);
    font-size: 12px;
}

.task-title {
    flex: 0 1 auto;
    min-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
