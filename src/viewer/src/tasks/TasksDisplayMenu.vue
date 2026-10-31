<script setup>
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import {taskBoard} from "../state/taskBoard.js";

const GROUPINGS = [
    {key: "plan", label: "Plan and phase"},
    {key: "status", label: "Status"},
    {key: "none", label: "Nothing"},
];
const SHOWN = [
    {key: "number", label: "The task's number"},
    {key: "wait", label: "What blocks the task"},
];
const display = taskBoard.display;
</script>

<template>
    <MenuLabel>Group the list by</MenuLabel>
    <template v-for="g in GROUPINGS" :key="g.key">
        <MenuItem :on="display.grouping === g.key" @click="display.grouping = g.key">{{ g.label }}</MenuItem>
    </template>
    <MenuLabel>Show on each task</MenuLabel>
    <template v-for="s in SHOWN" :key="s.key">
        <MenuItem :on="display[s.key]" @click="display[s.key] = !display[s.key]">{{ s.label }}</MenuItem>
    </template>
    <MenuItem :on="display.showDone" @click="display.showDone = !display.showDone">Show completed tasks</MenuItem>
</template>
