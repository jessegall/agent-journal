<script setup>
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import {STATUS_ORDER, STATUS_WORDS} from "../domain/taskBoard.js";
import {taskBoard} from "../state/taskBoard.js";
import TaskStatusIcon from "./TaskStatusIcon.vue";

defineProps({counts: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const tick = (status) =>
    (taskBoard.statuses = taskBoard.statuses.includes(status)
        ? taskBoard.statuses.filter((s) => s !== status)
        : [...taskBoard.statuses, status]);

function clear() {
    taskBoard.statuses = [];
    emit("close");
}
</script>

<template>
    <MenuLabel>Show tasks that are</MenuLabel>
    <template v-for="s in STATUS_ORDER" :key="s">
        <MenuItem :on="taskBoard.statuses.includes(s)" @click="tick(s)">
            <TaskStatusIcon :status="s" />
            {{ STATUS_WORDS[s] }}
            <span class="count">{{ counts[s] }}</span>
        </MenuItem>
    </template>
    <MenuItem @click="clear">Show every task that is not done</MenuItem>
</template>

<style scoped>
.count {
    margin-left: auto;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}
</style>
