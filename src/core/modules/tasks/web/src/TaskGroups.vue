<script setup>
import {computed, ref, watch} from "vue";
import {Icon, PriorityIcon, SearchBar, Skeleton, TaskStatusIcon, peekRef, priorityLabel, useWindow} from "@journal/window-kit";
import {readPlanPlaces} from "./planPlaces.js";

// tasks as version 4 drew them: a search box, and the tasks in a group for each state; one read brings the first page of each, the finished ones
// from the task closed last, and each group pages on its own
const FINISHED = new Set(["completed", "cancelled"]);
const FOLDED_KEY = "journal.tasks.folded";
const props = defineProps({
    selectable: Boolean,
    selected: {type: Number, default: 0},
    states: {type: Array, default: () => []},
    display: {type: Object, default: () => ({grouping: "state", number: true, reason: false, showDone: true})},
});
const emit = defineEmits(["select"]);
const window = useWindow();
window.state.tab ??= window.shared ? "shared" : "list";
const search = ref(null);
const board = ref([]);
const pageFailure = ref("");
const failure = computed(() => pageFailure.value || window.props.board.failure.value);
const loaded = computed(() => window.shared ? window.props[`task.${window.shared.id}`].loaded.value : window.props.board.loaded.value);
const extended = ref(new Set());
const query = ref("");
// the rows each group shows on a page, chosen in the window's menu and kept on the pane
const pageRows = window.option("rows");
const pageLimit = computed(() => (Number(pageRows.value) > 0 ? String(Number(pageRows.value)) : undefined));

// the groups folded away, kept for this browser
function keptFolded() {
    try {
        return new Set(JSON.parse(localStorage.getItem(FOLDED_KEY) || "[]"));
    } catch {
        return new Set();
    }
}

const folded = ref(keptFolded());

function toggleFold(state) {
    const next = new Set(folded.value);
    if (!next.delete(state)) next.add(state);
    folded.value = next;
    try {
        localStorage.setItem(FOLDED_KEY, JSON.stringify([...next]));
    } catch {
        // a browser that keeps nothing still folds for this page
    }
}

let loading = 0;
async function readBoard(answer) {
    if (!answer) return;
    const request = ++loading;
    const held = new Map(board.value.map((group) => [group.state, group]));
    const groups = [];
    for (const group of answer.groups) groups.push(await withHeldRows(group, held.get(group.state)));
    if (request === loading) board.value = groups;
}
watch(() => window.props.board.data.value, readBoard, {immediate: true});

// a group shown past its first page reads again as many rows as it shows, so a task that moved leaves it
async function withHeldRows(group, held) {
    if (!extended.value.has(group.state) || !held?.rows.length) return group;
    const answer = await window.readKey("group", {state: group.state, limit: String(held.rows.length)});
    return answer.ok ? answer.value.groups[0] : group;
}

async function more(group) {
    const flags = {state: group.state};
    if (pageLimit.value) flags.limit = pageLimit.value;
    if (group.rows.length) {
        flags["before-id"] = String(FINISHED.has(group.state) ? group.rows.at(-1).id : Math.min(...group.rows.map((row) => row.id)));
        if (FINISHED.has(group.state)) flags["before-closed-at"] = group.rows.at(-1).closed_at;
    }
    const answer = await window.readKey("group", flags);
    pageFailure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    extended.value = new Set([...extended.value, group.state]);
    const current = board.value.find((held) => held.state === group.state);
    const shown = new Set(current.rows.map((row) => row.id));
    current.rows = [...current.rows, ...answer.value.groups[0].rows.filter((row) => !shown.has(row.id))];
}

const shownGroup = (group) => group.total && (props.states.length ? props.states.includes(group.state) : props.display.showDone || !FINISHED.has(group.state));
const places = ref([]);
const NOT_PLACED = "Not in a plan";
// the delegated tasks in the order of the groups above them, with no heads between
const DELEGATED_ORDER = ["started", "testing", "blocked", "open"];
const orderedRows = (group) => (group.state === "delegated" ? [...group.rows].sort((one, two) => DELEGATED_ORDER.indexOf(one.state) - DELEGATED_ORDER.indexOf(two.state)) : group.rows);
const stateGroups = computed(() => {
    const wanted = query.value.trim().toLowerCase();
    return board.value
        .filter(shownGroup)
        .map((group) => ({group, tasks: orderedRows(group).filter((row) => !wanted || `${row.title} ${row.id}`.toLowerCase().includes(wanted))}))
        .filter(({tasks}) => !wanted || tasks.length);
});
// the tasks held, under the plan and phase each is placed in; the tasks of no plan come last
const planGroups = computed(() => {
    const labels = new Map(places.value.flatMap((place) => place.taskIds.map((id) => [id, place.label])));
    const byLabel = new Map();
    for (const row of stateGroups.value.flatMap(({tasks}) => tasks)) {
        const label = labels.get(row.id) ?? NOT_PLACED;
        byLabel.set(label, [...(byLabel.get(label) ?? []), row]);
    }
    const ordered = [...byLabel.keys()].sort((one, two) => (one === NOT_PLACED) - (two === NOT_PLACED) || one.localeCompare(two));
    return ordered.map((label) => ({group: {state: label, label, total: byLabel.get(label).length, rows: byLabel.get(label)}, tasks: byLabel.get(label)}));
});
const groups = computed(() => (props.display.grouping === "plan" ? planGroups.value : stateGroups.value));
watch(() => props.display.grouping, async (grouping) => {
    if (grouping === "plan") places.value = await readPlanPlaces(window);
}, {immediate: true});
const name = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
const pick = (id) => (props.selectable ? emit("select", id) : peekRef(`tasks:${id}`));
watch(pageRows, () => {
    extended.value = new Set();
    if (pageLimit.value) window.state["board.limit"] = pageLimit.value;
    else delete window.state["board.limit"];
    if (window.props.board.data.value) window.reload("board");
}, {immediate: true});
if (window.shared) {
    const name = `task.${window.shared.id}`;
    window.reload(name).then(() => {
        const row = window.props[name].data.value;
        pageFailure.value = window.props[name].failure.value;
        if (row) board.value = [{state: row.state, total: 1, rows: [row]}];
    });
}
defineExpose({board, groups, query, focusSearch: () => search.value?.focus()});
</script>

<template>
    <div class="tasks">
        <template v-if="!loaded">
            <Skeleton shape="rows" />
        </template>
        <template v-else-if="failure">
            <p class="tasks-note">{{ failure }}</p>
        </template>
        <template v-else>
                <SearchBar ref="search" v-model="query" class="tasks-tools">
                    <slot name="tools" />
                </SearchBar>
            <template v-if="!groups.length">
                <p class="tasks-note">{{ query ? "No task matches" : "No tasks yet" }}</p>
            </template>
            <template v-for="{group, tasks} in groups" :key="group.state">
                <section class="tasks-group" :data-state="group.state">
                    <template v-if="display.grouping !== 'none'">
                        <h3 class="tasks-group-head" data-group-head>
                            <button type="button" class="tasks-fold" :data-fold="group.state" :aria-expanded="!folded.has(group.state)" @click="toggleFold(group.state)">
                                <Icon name="caret" :size="12" :class="['tasks-caret', {closed: folded.has(group.state)}]" />
                                {{ group.label ?? name(group.state) }} <span class="tasks-count">{{ group.total }}</span>
                            </button>
                        </h3>
                    </template>
                    <template v-for="row in folded.has(group.state) ? [] : tasks" :key="row.id">
                        <div :class="['task', {selected: selectable && row.id === selected}]" :data-row="row.id" role="button" tabindex="0" @click="pick(row.id)" @keydown.enter="pick(row.id)">
                            <TaskStatusIcon :status="row.state" />
                            <template v-if="display.number">
                                <span class="task-id">{{ row.id }}</span>
                            </template>
                            <span class="task-title">{{ row.title }}</span>
                            <template v-if="row.delegated_name">
                                <span class="task-agent" :title="`Delegated to ${row.delegated_name}, in state ${row.state}`" data-task-agent>{{ row.delegated_name }}</span>
                            </template>
                            <template v-if="display.reason && row.reason">
                                <span class="task-reason" data-task-reason>{{ row.reason }}</span>
                            </template>
                            <span :title="`Priority: ${priorityLabel(row.priority)}`" data-task-priority><PriorityIcon :value="row.priority" /></span>
                        </div>
                    </template>
                    <template v-if="!folded.has(group.state) && group.rows.length < group.total">
                        <button type="button" class="tasks-more" :data-more="group.state" @click="more(group)">{{ group.rows.length ? "Show more" : `Show ${group.total} ${group.total === 1 ? "task" : "tasks"}` }}</button>
                    </template>
                </section>
            </template>
        </template>
    </div>
</template>

<style scoped>
.task-agent {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.task-reason {
    overflow: hidden;
    min-width: 0;
    max-width: 40%;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tasks-more {
    margin: 4px 0 0 8px;
    padding: 2px 8px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.tasks-more:hover {
    background: var(--hover);
    color: var(--text);
}

.tasks {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 0 12px 8px;
}

.tasks-tools {
    margin: 0 -12px;
}

.tasks-fold {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    cursor: pointer;
}

.tasks-fold:hover {
    color: var(--text);
}

.tasks-caret.closed {
    transform: rotate(-90deg);
}

.tasks-group-head {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.tasks-count {
    margin-left: 4px;
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

.tasks-group[data-state="testing"] .tasks-fold {
    color: var(--tone-sequence);
}

.task-id {
    flex: none;
    width: 40px;
    color: var(--text-3);
    font-size: 12px;
}

.task-title {
    flex: 1;
    min-width: 0;
}

.tasks-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
