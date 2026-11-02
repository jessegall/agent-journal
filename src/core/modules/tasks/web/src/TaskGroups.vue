<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {Icon, PriorityIcon, Skeleton, peekRef, priorityLabel, useWindow} from "@journal/window-kit";
import {readPlanPlaces} from "./planPlaces.js";

// tasks as version 4 drew them: a search box, and the tasks in a group for each state; one read brings the first page of each, the finished ones
// from the task closed last, and each group pages on its own
const PAGE_ROWS = 25;
const FINISHED = new Set(["completed", "cancelled"]);
const FOLDED_KEY = "journal.tasks.folded";
const props = defineProps({
    selectable: Boolean,
    selected: {type: Number, default: 0},
    states: {type: Array, default: () => []},
    display: {type: Object, default: () => ({grouping: "state", number: true, reason: false, showDone: true})},
});
const emit = defineEmits(["select"]);
const context = useWindow();
const search = ref(null);
const board = ref([]);
const failure = ref("");
const loaded = ref(false);
const extended = ref(new Set());
const query = ref("");

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

async function load() {
    const answer = await context.read(context.shared ? `${context.shared.model} show ${context.shared.id}` : "task board");
    failure.value = answer.ok ? "" : answer.error;
    loaded.value = true;
    if (!answer.ok) return;
    if (context.shared) return void (board.value = [{state: answer.value.state, total: 1, rows: [answer.value]}]);
    const held = new Map(board.value.map((group) => [group.state, group]));
    board.value = await Promise.all(answer.value.groups.map((group) => withHeldRows(group, held.get(group.state))));
}

// a group shown past its first page reads again as many rows as it shows, so a task that moved leaves it
async function withHeldRows(group, held) {
    if (!extended.value.has(group.state) || !held?.rows.length) return group;
    const answer = await context.read(`task board --state ${group.state} --limit ${held.rows.length}`);
    return answer.ok ? answer.value.groups[0] : group;
}

async function more(group) {
    const before = !group.rows.length ? "" : FINISHED.has(group.state) ? ` --before-closed-at ${group.rows.at(-1).closed_at}` : ` --before-id ${Math.min(...group.rows.map((row) => row.id))}`;
    const answer = await context.read(`task board --state ${group.state}${before}`);
    if (!answer.ok) return void (failure.value = answer.error);
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
        .map((group) => ({group, tasks: group.rows.filter((row) => !wanted || `${row.title} ${row.id}`.toLowerCase().includes(wanted))}));
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
    if (grouping === "plan") places.value = await readPlanPlaces(context);
}, {immediate: true});
const name = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
const pick = (id) => (props.selectable ? emit("select", id) : peekRef(`tasks:${id}`));
const stopFollowing = context.follow(["task.*"], load);
onUnmounted(() => stopFollowing?.());
load();
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
            <div class="tasks-tools">
                <input ref="search" v-model="query" class="tasks-search" type="search" placeholder="Search the tasks" aria-label="Search the tasks" />
                <slot name="tools" />
            </div>
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
                            <span :class="['task-mark', row.state]" />
                            <template v-if="display.number">
                                <span class="task-id">{{ row.id }}</span>
                            </template>
                            <span class="task-title">{{ row.title }}</span>
                            <template v-if="group.state === 'delegated'">
                                <span class="task-worker" :title="`Delegated to agent ${row.delegated_to}, in state ${row.state}`" data-task-worker>Worker {{ row.delegated_to }} · {{ row.state }}</span>
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
.task-worker {
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
}

.tasks-tools {
    position: sticky;
    z-index: 2;
    top: 0;
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 0 0 8px;
    background: var(--bg);
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

.tasks-search {
    flex: 1;
    min-width: 0;
    padding: 6px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: transparent;
    color: var(--text);
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

.task-mark {
    flex: none;
    width: 12px;
    height: 12px;
    border: 1.5px solid var(--text-4);
    border-radius: 50%;
}

.task-mark.started {
    border-color: var(--accent);
    background: linear-gradient(90deg, var(--accent) 50%, transparent 50%);
}

.task-mark.testing {
    border-color: var(--tone-sequence);
    background: linear-gradient(90deg, var(--tone-sequence) 50%, transparent 50%);
}

.tasks-group[data-state="testing"] .tasks-fold {
    color: var(--tone-sequence);
}

.task-mark.blocked {
    border-color: var(--tone-warn);
}

.task-mark.completed {
    border-color: var(--accent);
    background: var(--accent);
}

.task-mark.cancelled {
    opacity: 0.4;
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
