<script setup>
import {computed, ref} from "vue";
import {rows} from "../sync/rows.js";
import {peek} from "../route.js";
import {useTaskActs} from "../composables/taskActs.js";
import TaskInspector from "./TaskInspector.vue";
import TaskMenus from "./TaskMenus.vue";

const props = defineProps({task: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const acts = useTaskActs();
const menu = ref(null);
const tasks = computed(() => rows("tasks"));
const showMenu = (kind, task, el) => (menu.value = {kind, task, el});
const answer = (question) => (acts.asking.value = {kind: "answer", question});
</script>

<template>
    <TaskInspector
        lone
        :task="task"
        :tasks="tasks"
        @close="emit('close')"
        @act="(name) => acts.run(task, name)"
        @status="(el) => showMenu('status', task, el)"
        @more="(el) => showMenu('more', task, el)"
        @select="(id) => peek('tasks', id)"
        @answer="answer"
    />
    <TaskMenus :menu="menu" :tasks="tasks" :acts="acts" @close="menu = null" @show="showMenu" @run="acts.run" />
</template>
