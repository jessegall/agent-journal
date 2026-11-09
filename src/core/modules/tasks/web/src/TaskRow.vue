<script setup>
import {TaskStatusIcon, peekRef, useWindow} from "@journal/window-kit";
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
</script>

<template>
    <div :class="['task', {selected: selectable && selected}]" :data-row="row.id" role="button" tabindex="0" @click="pick" @keydown.enter="pick">
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
        <template v-if="row.state === 'blocked' && !row.automatic"><MarkIcon name="warning" class="task-warning" data-task-warning title="Does not open by itself: needs a person" /></template>
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
