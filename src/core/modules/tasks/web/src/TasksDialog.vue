<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import {Btn, Dialog, Icon, TaskInspector, useWindow} from "@journal/window-kit";
import NewTask from "./NewTask.vue";
import TaskGroups from "./TaskGroups.vue";

// the place to manage tasks, as version 4's dialog: the groups of tasks on the left, the one selected in the inspector on the right, and keys for all of it
const TYPING = "input,textarea,select,[contenteditable],.menu-panel";
const emit = defineEmits(["close"]);
const context = useWindow();
const open = ref(true);
const list = ref(null);
const inspector = ref(null);
const selected = ref(0);
const inspecting = ref(false);
const drafting = ref(false);
const changes = ref(0);
context.follow(["task.*"], () => (changes.value += 1));

const order = computed(() => (list.value?.groups ?? []).flatMap(({tasks}) => tasks.map((task) => task.id)));
const standing = computed(() => {
    const going = (list.value?.groups ?? []).filter(({group}) => group.state !== "completed" && group.state !== "cancelled");
    const blocked = going.find(({group}) => group.state === "blocked")?.group.total;
    return `${going.reduce((total, {group}) => total + group.total, 0)} not done${blocked ? `, ${blocked} blocked` : ""}`;
});

function select(id) {
    selected.value = id;
    inspecting.value = true;
}

function step(by) {
    if (!order.value.length) return;
    const at = order.value.indexOf(selected.value);
    selected.value = at < 0 ? order.value[0] : order.value[Math.max(0, Math.min(order.value.length - 1, at + by))];
    nextTick(() => document.querySelector(`.tasks-dialog [data-row="${selected.value}"]`)?.scrollIntoView({block: "nearest"}));
}

function filed(id) {
    drafting.value = false;
    select(id);
}

const KEYS = {
    ArrowDown: () => step(1),
    j: () => step(1),
    ArrowUp: () => step(-1),
    k: () => step(-1),
    Enter: () => selected.value && (inspecting.value = true),
    " ": () => selected.value && (inspecting.value = !inspecting.value),
    c: () => (drafting.value = true),
    s: () => inspecting.value && inspector.value?.openStatus(document.querySelector(".tasks-dialog [data-task-state]")),
    "/": () => list.value?.focusSearch(),
};

function pressed(event) {
    const key = KEYS[event.key];
    if (!key || event.metaKey || event.ctrlKey || event.altKey || event.target.closest?.(TYPING)) return;
    event.preventDefault();
    key();
}

function escaped(event) {
    if (event.key !== "Escape" || event.defaultPrevented || event.target.closest?.(TYPING)) return;
    if (inspecting.value) inspecting.value = false;
    else open.value = false;
}

onMounted(() => {
    window.addEventListener("keydown", pressed, true);
    window.addEventListener("keydown", escaped);
});
onUnmounted(() => {
    window.removeEventListener("keydown", pressed, true);
    window.removeEventListener("keydown", escaped);
});
</script>

<template>
    <Dialog wide tall bare title="Tasks" :open="open" @dismiss="open = false" @close="emit('close')">
        <div class="tasks-dialog" data-tasks-dialog>
            <header class="tasks-head">
                <h2>Tasks</h2>
                <span class="standing" data-tasks-standing>{{ standing }}</span>
                <span class="grow" />
                <Btn small title="New task (C)" data-new-task @click="drafting = true">
                    <Icon name="plus" :size="12" />
                    New task
                </Btn>
                <Btn small aria-label="Close the tasks (Esc)" data-tasks-close @click="open = false"><Icon name="close" :size="13" /></Btn>
            </header>
            <div class="tasks-body">
                <div class="tasks-list">
                    <template v-if="drafting">
                        <NewTask @filed="filed" @cancel="drafting = false" />
                    </template>
                    <TaskGroups ref="list" selectable :selected="selected" @select="select" />
                </div>
                <template v-if="inspecting && selected">
                    <TaskInspector ref="inspector" stepped :id="selected" :read="context.run" :changes="changes" @close="inspecting = false" @step="step" @select="select" />
                </template>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.tasks-dialog {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    height: 100%;
}

.tasks-head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 52px;
    padding: 0 12px 0 18px;
    border-bottom: 1px solid var(--border);
}

h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
}

.standing {
    color: var(--text-3);
    font-size: 12px;
}

.grow {
    flex: 1;
}

.tasks-body {
    display: flex;
    flex: 1;
    min-height: 0;
}

.tasks-list {
    flex: 1;
    min-width: 0;
    overflow: auto;
    padding: 14px 16px;
}
</style>
