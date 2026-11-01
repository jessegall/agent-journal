<script setup>
import {computed, ref} from "vue";
import {Skeleton, peekRef, useWindow} from "@journal/window-kit";

// tasks as version 4 drew them: a search box, and the tasks in a group for each state; one read brings the going groups and the count of the finished ones,
// and each group pages on its own
const PAGE_ROWS = 25;
const FINISHED = new Set(["completed", "cancelled"]);
const context = useWindow();
const board = ref([]);
const failure = ref("");
const loaded = ref(false);
const pages = ref({});
const query = ref("");

async function load() {
    const answer = await context.read(context.shared ? `${context.shared.model} show ${context.shared.id}` : "task board");
    failure.value = answer.ok ? "" : answer.error;
    loaded.value = true;
    if (!answer.ok) return;
    if (context.shared) return void (board.value = [{state: answer.value.state, total: 1, rows: [answer.value]}]);
    const held = new Map(board.value.map((group) => [group.state, group]));
    board.value = answer.value.groups.map((group) => {
        const extra = pages.value[group.state] > (FINISHED.has(group.state) ? 0 : 1) ? held.get(group.state)?.rows ?? [] : [];
        const first = new Set(group.rows.map((row) => row.id));
        return {...group, rows: [...group.rows, ...extra.filter((row) => !first.has(row.id))]};
    });
}

async function more(group) {
    const page = (pages.value[group.state] ?? (FINISHED.has(group.state) ? 0 : 1)) + 1;
    const answer = await context.read(`task board --state ${group.state} --page ${page}`);
    if (!answer.ok) return void (failure.value = answer.error);
    pages.value = {...pages.value, [group.state]: page};
    group.rows = [...group.rows, ...answer.value.groups[0].rows];
}

const groups = computed(() => {
    const wanted = query.value.trim().toLowerCase();
    return board.value
        .map((group) => ({group, tasks: group.rows.filter((row) => !wanted || `${row.title} ${row.id}`.toLowerCase().includes(wanted))}))
        .filter(({group}) => group.total);
});
const name = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
context.follow(["task.*"], load);
load();
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
            <input v-model="query" class="tasks-search" type="search" placeholder="Search the tasks" aria-label="Search the tasks" />
            <template v-if="!groups.length">
                <p class="tasks-note">{{ query ? "No task matches" : "No tasks yet" }}</p>
            </template>
            <template v-for="{group, tasks} in groups" :key="group.state">
                <section class="tasks-group" :data-state="group.state">
                    <h3 class="tasks-group-head">{{ name(group.state) }} <span class="tasks-count">{{ group.total }}</span></h3>
                    <template v-for="row in tasks" :key="row.id">
                        <div class="task" :data-row="row.id" role="button" tabindex="0" @click="peekRef(`tasks:${row.id}`)" @keydown.enter="peekRef(`tasks:${row.id}`)">
                            <span :class="['task-mark', row.state]" />
                            <span class="task-id">{{ row.id }}</span>
                            <span class="task-title">{{ row.title }}</span>
                            <template v-if="row.priority && row.priority !== 'normal'">
                                <span class="task-priority">{{ row.priority }}</span>
                            </template>
                        </div>
                    </template>
                    <template v-if="group.rows.length < group.total">
                        <button type="button" class="tasks-more" :data-more="group.state" @click="more(group)">Show {{ group.rows.length ? "more" : "them" }}</button>
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
}

.tasks-search {
    max-width: 320px;
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

.task-mark {
    flex: none;
    width: 12px;
    height: 12px;
    border: 1.5px solid var(--text-4);
    border-radius: 50%;
}

.task-mark.started,
.task-mark.testing {
    border-color: var(--accent);
    background: linear-gradient(90deg, var(--accent) 50%, transparent 50%);
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

.task-priority,
.tasks-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
