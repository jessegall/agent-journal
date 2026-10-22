<script setup>
import {computed, nextTick, onMounted, ref} from "vue";
import Dialog from "../kit/Dialog.vue";
import Toast from "../kit/Toast.vue";
import {boardLines, shownTasks, STATUS_WORDS} from "../domain/taskBoard.js";
import {select, useTaskActs} from "../composables/taskActs.js";
import {useWindowEvent} from "../composables/windowEvent.js";
import {narrow} from "../platform/view.js";
import {go, route} from "../route.js";
import {rows} from "../sync/rows.js";
import {taskBoard} from "../state/taskBoard.js";
import TaskGraph from "./TaskGraph.vue";
import TaskInspector from "./TaskInspector.vue";
import TaskList from "./TaskList.vue";
import TaskMenus from "./TaskMenus.vue";
import TasksHead from "./TasksHead.vue";

const TYPING = "input,textarea,select,[contenteditable],.menu-panel";
const open = ref(true);
const head = ref(null);
const menu = ref(null);
const acts = useTaskActs();
const {toast, asking} = acts;
const tasks = computed(() => rows("tasks"));
const plans = computed(() => [...rows("plans")].sort((a, b) => a.id - b.id));
const shown = computed(() => shownTasks(tasks.value, taskBoard));
const lines = computed(() =>
    boardLines(taskBoard.display.grouping, {shown: shown.value, all: tasks.value, plans: plans.value, folded: taskBoard.folded})
);
const order = computed(() => lines.value.filter((line) => line.type === "row").map((line) => line.task.id));
const selected = computed(() => tasks.value.find((t) => t.id === taskBoard.selected) || null);
const inspecting = computed(() => taskBoard.inspecting && Boolean(selected.value));
const listShown = computed(() => !narrow.value || !inspecting.value);
const filtered = computed(() => taskBoard.view === "list" && (taskBoard.statuses.length || taskBoard.words));

onMounted(() => route.value.n && select(route.value.n));

function step(by) {
    const ids = order.value;
    if (!ids.length) return;
    const at = ids.indexOf(taskBoard.selected);
    taskBoard.selected = at < 0 ? ids[0] : ids[Math.max(0, Math.min(ids.length - 1, at + by))];
    nextTick(() => document.querySelector(`.task-row[data-task="${taskBoard.selected}"]`)?.scrollIntoView({block: "nearest"}));
}

function draft() {
    taskBoard.view = "list";
    if (narrow.value) taskBoard.inspecting = false;
    taskBoard.draft ||= {title: "", brief: "", plan: selected.value?.plan_id || 0};
}

async function file(fields) {
    const made = await acts.file(fields);
    if (made && !shown.value.some((t) => t.id === made.id)) clearFilter();
}

function clearFilter() {
    taskBoard.statuses = [];
    taskBoard.words = "";
}

const showMenu = (kind, task, el) => (menu.value = {kind, task, el});
const answer = (question) => (asking.value = {kind: "answer", question});

function anchorOf(task) {
    return document.querySelector(`.task-row[data-task="${task.id}"] .status`) || document.querySelector(".task-inspector .status");
}

const KEYS = {
    ArrowDown: () => step(1),
    j: () => step(1),
    ArrowUp: () => step(-1),
    k: () => step(-1),
    Enter: () => selected.value && (taskBoard.inspecting = true),
    " ": () => selected.value && (taskBoard.inspecting = !taskBoard.inspecting),
    c: draft,
    v: () => (taskBoard.view = taskBoard.view === "list" ? "graph" : "list"),
    s: () => selected.value && anchorOf(selected.value) && showMenu("status", selected.value, anchorOf(selected.value)),
    ".": () => selected.value && anchorOf(selected.value) && showMenu("more", selected.value, anchorOf(selected.value)),
    "/": () => head.value?.focusSearch(),
};

function pressed(e) {
    const key = KEYS[e.key];
    if (!key || menu.value || asking.value || e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.(TYPING)) return;
    e.preventDefault();
    key();
}

function escaped(e) {
    if (e.key !== "Escape" || e.defaultPrevented || menu.value || asking.value || e.target.closest?.(TYPING)) return;
    if (inspecting.value) taskBoard.inspecting = false;
    else open.value = false;
}

// the dialog's keys are read before the viewer's own, so Space opens the task here and not the quick menu
useWindowEvent("keydown", pressed, true);
useWindowEvent("keydown", escaped);
</script>

<template>
    <Dialog wide tall bare title="Tasks" :open="open" @dismiss="open = false" @close="go()">
        <div :class="['tasks-dialog', {single: narrow}]">
            <TasksHead ref="head" :tasks="tasks" :single="narrow" @new="draft" @close="open = false" />
            <template v-if="filtered && listShown">
                <div class="filters">
                    <template v-if="taskBoard.statuses.length">
                        <span class="chip">
                            Status: {{ taskBoard.statuses.map((s) => STATUS_WORDS[s]).join(" or ") }}
                            <button type="button" title="Remove this filter" @click="taskBoard.statuses = []">×</button>
                        </span>
                    </template>
                    <template v-if="taskBoard.words">
                        <span class="chip">
                            Search: “{{ taskBoard.words }}”
                            <button type="button" title="Clear the search" @click="taskBoard.words = ''">×</button>
                        </span>
                    </template>
                    <button type="button" class="clear" @click="clearFilter">Clear all</button>
                </div>
            </template>
            <div class="body">
                <template v-if="listShown">
                    <Transition name="view" mode="out-in">
                        <TaskList
                            v-if="taskBoard.view === 'list'"
                            :lines="lines"
                            :tasks="tasks"
                            @select="select"
                            @act="acts.run"
                            @status="(task, el) => showMenu('status', task, el)"
                            @more="(task, el) => showMenu('more', task, el)"
                            @file="file"
                            @new="draft"
                            @clear="clearFilter"
                        />
                        <TaskGraph v-else :tasks="tasks" @select="select" @answer="answer" @list="taskBoard.view = 'list'" />
                    </Transition>
                </template>
                <Transition name="inspector">
                    <template v-if="inspecting">
                        <TaskInspector
                            :task="selected"
                            :tasks="tasks"
                            :single="narrow"
                            :back="taskBoard.view"
                            @close="taskBoard.inspecting = false"
                            @step="step"
                            @act="(name) => acts.run(selected, name)"
                            @status="(el) => showMenu('status', selected, el)"
                            @more="(el) => showMenu('more', selected, el)"
                            @select="select"
                            @answer="answer"
                        />
                    </template>
                </Transition>
            </div>
            <Toast :toast="toast" :lasts="5000" @done="toast = null" />
        </div>
    </Dialog>
    <TaskMenus :menu="menu" :tasks="tasks" :acts="acts" @close="menu = null" @show="showMenu" @run="acts.run" />
</template>

<style scoped>
.tasks-dialog {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.filters {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-bottom: 1px solid var(--border);
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 3px 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.chip button,
.clear {
    border: 0;
    background: none;
    color: var(--text-3);
    font: 12px var(--font);
    cursor: pointer;
}

.chip button {
    width: 18px;
    height: 18px;
    padding: 0;
    border-radius: 4px;
}

.chip button:hover,
.clear:hover {
    background: var(--hover);
    color: var(--text);
}

.clear {
    height: 24px;
    padding: 0 8px;
    border-radius: 6px;
}

.body {
    display: flex;
    flex: 1;
    min-height: 0;
}

.view-enter-active {
    transition: opacity 0.18s var(--ease);
}

.view-enter-from {
    opacity: 0;
}

.inspector-enter-active,
.inspector-leave-active {
    transition:
        opacity 0.2s var(--ease),
        transform 0.2s var(--ease);
}

.inspector-enter-from,
.inspector-leave-to {
    opacity: 0;
    transform: translateX(28px);
}

@media (prefers-reduced-motion: reduce) {
    .view-enter-active,
    .inspector-enter-active,
    .inspector-leave-active {
        transition: none;
    }
}
</style>
