<script setup>
import {computed, ref, watch} from "vue";
import {Icon, SearchBar, Skeleton, Switch, useWindow} from "@journal/window-kit";
import {readPlanPlaces} from "./planPlaces.js";
import TaskRow from "./TaskRow.vue";

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
const view = useWindow();
view.state.tab ??= view.shared ? "shared" : "list";
const search = ref(null);
const board = ref([]);
const pageFailure = ref("");
const failure = computed(() => pageFailure.value || view.props.board.failure.value);
const loaded = computed(() => view.shared ? view.props[`task.${view.shared.id}`].loaded.value : view.props.board.loaded.value);
const extended = ref(new Set());
const query = ref("");
const tag = ref(view.state["board.tag"] || "");
const tags = computed(() => view.props.tags.rows.value);
// each section can leave out the tasks that belong to a plan, which the server does so the pages and the count follow; the sections that do are kept on the pane, as their states in one word with commas
const hidingPlanTasks = ref(new Set((view.state["board.hide-plan-tasks"] || "").split(",").filter(Boolean)));
function showPlanTasks(state, shown) {
    const next = new Set(hidingPlanTasks.value);
    if (shown) next.delete(state);
    else next.add(state);
    hidingPlanTasks.value = next;
    extended.value = new Set();
    if (next.size) view.state["board.hide-plan-tasks"] = [...next].join(",");
    else delete view.state["board.hide-plan-tasks"];
    view.reload("board");
}
function groupFlags(state) {
    const flags = {state};
    if (tag.value) flags.tag = tag.value;
    if (hidingPlanTasks.value.size) flags["hide-plan-tasks"] = [...hidingPlanTasks.value].join(",");
    return flags;
}
// the rows each group shows on a page, chosen in the window's menu and kept on the pane
const pageRows = view.option("rows");
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
watch(() => view.props.board.data.value, readBoard, {immediate: true});

// a group shown past its first page reads again as many rows as it shows, so a task that moved leaves it
async function withHeldRows(group, held) {
    if (!extended.value.has(group.state) || !held?.rows.length) return group;
    const answer = await view.readKey("group", {...groupFlags(group.state), limit: String(Math.max(1, held.rows.length))});
    return answer.ok ? answer.value.groups[0] : group;
}

async function more(group) {
    const flags = groupFlags(group.state);
    if (pageLimit.value) flags.limit = pageLimit.value;
    if (group.rows.length) {
        flags["before-id"] = String(FINISHED.has(group.state) ? group.rows.at(-1).id : Math.min(...group.rows.map((row) => row.id)));
        if (FINISHED.has(group.state)) flags["before-closed-at"] = group.rows.at(-1).closed_at;
    }
    const answer = await view.readKey("group", flags);
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
const stateGroups = computed(() => {
    const wanted = query.value.trim().toLowerCase();
    return board.value
        .filter(shownGroup)
        .map((group) => ({group, tasks: group.rows.filter((row) => !wanted || `${row.title} ${row.id}`.toLowerCase().includes(wanted))}))
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
    if (grouping === "plan") places.value = await readPlanPlaces(view);
}, {immediate: true});
const name = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
watch(pageRows, () => {
    extended.value = new Set();
    if (pageLimit.value) view.state["board.limit"] = pageLimit.value;
    else delete view.state["board.limit"];
    if (view.props.board.data.value) view.reload("board");
}, {immediate: true});
watch(tag, () => {
    extended.value = new Set();
    if (tag.value) view.state["board.tag"] = tag.value;
    else delete view.state["board.tag"];
    view.reload("board");
});
if (view.shared) {
    const name = `task.${view.shared.id}`;
    view.reload(name).then(() => {
        const row = view.props[name].data.value;
        pageFailure.value = view.props[name].failure.value;
        if (row) board.value = [{state: row.state, total: 1, rows: [row]}];
    });
}
defineExpose({board, groups, query, tag, focusSearch: () => search.value?.focus()});
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
                    <select v-model="tag" aria-label="Filter by tag" data-task-tag-filter>
                        <option value="">All tags</option>
                        <template v-for="item in tags" :key="item.word"><option :value="item.word">{{ item.word }} ({{ item.count }})</option></template>
                    </select>
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
                            <template v-if="display.grouping !== 'plan'">
                                <Switch class="tasks-plan-switch" small :on="!hidingPlanTasks.has(group.state)" word="Show tasks in plans" title="Show the tasks of this section that belong to a plan" :data-plan-switch="group.state" @change="showPlanTasks(group.state, $event)" />
                            </template>
                        </h3>
                    </template>
                    <template v-for="row in folded.has(group.state) ? [] : tasks" :key="row.id">
                        <TaskRow :row="row" :selectable="selectable" :selected="row.id === selected" :display="display" @select="emit('select', $event)" />
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
    display: flex;
    align-items: center;
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

.tasks-plan-switch {
    flex-direction: row-reverse;
    margin-left: auto;
    font-size: 11px;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
}

.tasks-group[data-state="testing"] .tasks-fold {
    color: var(--tone-sequence);
}

.tasks-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
