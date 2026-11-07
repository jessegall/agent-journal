<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import {Btn, Dialog, Icon, Segmented, HostedInspector, peekRef, steppedItem, useWindow} from "@journal/window-kit";
import NewTask from "./NewTask.vue";
import TaskGraphView from "./TaskGraphView.vue";
import TaskGroups from "./TaskGroups.vue";
import TasksMenus from "./TasksMenus.vue";

// the place to manage tasks, as version 4's dialog: the groups of tasks on the left, the one selected in the inspector on the right, and keys for all of it
const TYPING = "input,textarea,select,[contenteditable],.menu-panel";
const emit = defineEmits(["close"]);
const view = useWindow();
const open = ref(true);
const list = ref(null);
const inspector = ref(null);
const selected = ref(0);
const inspecting = ref(false);
const drafting = ref(false);
const changes = ref(0);
const VIEWS = [
    {key: "list", label: "List"},
    {key: "graph", label: "Graph"},
];
view.state.tab = "list";
const tab = computed({get: () => view.state.tab, set: (value) => (view.state.tab = value)});
const states = ref([]);
const display = ref({grouping: "state", number: true, reason: false, showDone: false});
const searched = computed(() => list.value?.query ?? "");
const filtered = computed(() => tab.value === "list" && Boolean(states.value.length || searched.value || list.value?.tag));
const name = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);

function clearFilter() {
    states.value = [];
    if (list.value) {
        list.value.query = "";
        list.value.tag = "";
    }
}

function deleted() {
    inspecting.value = false;
    selected.value = 0;
}
const stopFollowing = view.follow(["task.*", "task_log.*", "task_tag.*"], () => (changes.value += 1));
onUnmounted(() => stopFollowing?.());

const order = computed(() => (list.value?.groups ?? []).flatMap(({tasks}) => tasks.map((task) => task.id)));
const standing = computed(() => {
    const going = (list.value?.board ?? []).filter((group) => group.state !== "completed" && group.state !== "cancelled");
    const blocked = going.find((group) => group.state === "blocked")?.total;
    return `${going.reduce((total, group) => total + group.total, 0)} not done${blocked ? `, ${blocked} blocked` : ""}`;
});

function select(id) {
    selected.value = id;
    inspecting.value = true;
}

function step(by) {
    if (!order.value.length) return;
    selected.value = steppedItem(order.value, selected.value, by);
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
    c: () => ((tab.value = "list"), (drafting.value = true)),
    v: () => (tab.value = tab.value === "list" ? "graph" : "list"),
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
    view.state.tab = "list";
});
</script>

<template>
    <Dialog wide tall bare title="Tasks" :open="open" @dismiss="open = false" @close="emit('close')">
        <div class="tasks-dialog" data-tasks-dialog>
            <header class="tasks-head">
                <h2>Tasks</h2>
                <span class="standing" data-tasks-standing>{{ standing }}</span>
                <span class="grow" />
                <Segmented :options="VIEWS" :value="tab" @pick="tab = $event" />
                <TasksMenus :states="states" :display="display" :selected="selected" @states="states = $event" @display="display = $event" @deleted="deleted" />
                <Btn small title="New task (C)" data-new-task @click="drafting = true">
                    <Icon name="plus" :size="12" />
                    New task
                </Btn>
                <Btn small aria-label="Close the tasks (Esc)" data-tasks-close @click="open = false"><Icon name="close" :size="13" /></Btn>
            </header>
            <template v-if="filtered">
                <div class="filters" data-task-filters>
                    <template v-if="states.length">
                        <span class="chip">
                            Status: {{ states.map(name).join(" or ") }}
                            <button type="button" title="Remove this filter" aria-label="Remove this filter" @click="states = []">×</button>
                        </span>
                    </template>
                    <template v-if="searched">
                        <span class="chip">
                            Search: “{{ searched }}”
                            <button type="button" title="Clear the search" aria-label="Clear the search" @click="list.query = ''">×</button>
                        </span>
                    </template>
                    <button type="button" class="clear" data-clear-filters @click="clearFilter">Clear all</button>
                </div>
            </template>
            <div class="tasks-body">
                <div class="tasks-list">
                    <template v-if="drafting">
                        <NewTask @filed="filed" @cancel="drafting = false" />
                    </template>
                    <template v-if="tab === 'graph'">
                        <TaskGraphView :selected="selected" @select="select" />
                    </template>
                    <div v-show="tab === 'list'">
                        <TaskGroups ref="list" selectable :selected="selected" :states="states" :display="display" @select="select" />
                    </div>
                </div>
                <template v-if="inspecting && selected">
                    <HostedInspector noun="task" stepped embedded :id="selected" :read="view.run" :environment="view.environment" @step="step" @open="(row) => peekRef(`${row.table}:${row.id}`)" />
                </template>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    padding: 6px 16px;
    border-bottom: 1px solid var(--border);
}

.chip {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 1px 4px 1px 8px;
    border-radius: 99px;
    background: var(--hover);
    color: var(--text-2);
    font-size: 12px;
}

.chip button,
.clear {
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

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
    padding: 0;
}
</style>
