<script setup>
import {computed, ref} from "vue";
import Toast from "../kit/Toast.vue";
import {boardLines, shownTasks, waitOf} from "../domain/taskBoard.js";
import {useTaskActs} from "../composables/taskActs.js";
import {go} from "../route.js";
import {rows} from "../sync/rows.js";
import {taskBoard} from "../state/taskBoard.js";
import TaskList from "./TaskList.vue";
import TaskMenus from "./TaskMenus.vue";

// The chat's Tasks tab: the tasks dialog's list grouped by status, a task opened in the dialog's inspector.
const menu = ref(null);
const acts = useTaskActs();
const tasks = computed(() => rows("tasks"));
const lines = computed(() => boardLines("status", {shown: shownTasks(tasks.value, taskBoard), folded: taskBoard.folded}));
const inspect = (id) => go("tasks", id);
const showMenu = (kind, task, el) => (menu.value = {kind, task, el});
const run = (task, name) => (name === "goto" ? inspect(waitOf(task).id) : acts.run(task, name));

function draft() {
    taskBoard.view = "list";
    taskBoard.draft ||= {title: "", brief: "", plan: 0};
    go("tasks");
}

function clearFilter() {
    taskBoard.statuses = [];
    taskBoard.words = "";
}
</script>

<template>
    <div class="tasks-tab">
        <TaskList
            :lines="lines"
            :tasks="tasks"
            @select="inspect"
            @act="run"
            @status="(task, el) => showMenu('status', task, el)"
            @more="(task, el) => showMenu('more', task, el)"
            @file="acts.file"
            @new="draft"
            @clear="clearFilter"
        />
        <TaskMenus :menu="menu" :tasks="tasks" :acts="acts" @close="menu = null" @show="showMenu" @run="run" />
        <Toast :toast="acts.toast.value" :lasts="5000" @done="acts.toast.value = null" />
    </div>
</template>

<style scoped>
.tasks-tab {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}
</style>
