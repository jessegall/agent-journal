<script setup>
import {computed, ref} from "vue";
import {ActionsMenu, Btn, CardPage, Skeleton, copying, useWindow} from "@journal/window-kit";
import CheckDialog from "./CheckDialog.vue";
import CheckRunBar from "./CheckRunBar.vue";

// the checks as cards: its verdict is the state line, the command the line under it, and the one action that waits is Run, or Start for a check that was stopped.
// A run shows at once and the server's answer settles it, a refusal naming why
const view = useWindow();
const {rows, failure, loaded} = view.props.checks;
const openedId = ref(null);
const opened = computed(() => rows.value.find((row) => row.id === openedId.value) || null);
const runningIds = ref(new Set());
const refusal = ref("");
const verdict = (row) => (row.status === "running" ? "Running" : row.last_passed === true ? "Passing" : row.last_passed === false ? "Failing" : "Not run");
const items = computed(() => rows.value.map((row) => ({
    id: row.id,
    title: row.title,
    icon: "check",
    state: verdict(row),
    line: row.command,
    fault: row.last_passed === false ? row.last_output : "",
    status: verdict(row),
    row,
})));
const fields = [{key: "status", label: "State", options: ["Passing", "Failing", "Running", "Not run"].map((word) => [word, word]), get: (item) => item.status}];
const rhythm = (row) => (row.interval_minutes ? `Every ${row.interval_minutes} minutes` : "Only when run by hand");

async function start(row) {
    refusal.value = "";
    const answer = await view.run(["check", "start", String(row.id)]);
    if (!answer.ok) refusal.value = answer.error;
}

async function run(row) {
    refusal.value = "";
    runningIds.value = new Set([...runningIds.value, row.id]);
    const answer = await view.run(["check", "run", String(row.id)]);
    runningIds.value = new Set([...runningIds.value].filter((id) => id !== row.id));
    if (!answer.ok) refusal.value = answer.error;
}

const menuOf = (item) => [
    {label: "Open", group: "open", run: () => (openedId.value = item.id)},
    item.row.stopped ? {label: "Start", group: "own", run: () => start(item.row)} : {label: "Run now", group: "own", run: () => run(item.row)},
    {label: "Copy command", group: "copy", run: ({say}) => copying(item.row.command, "the command", say)},
];
const place = (item) => ({head: item.title, items: menuOf(item)});
</script>

<template>
    <CardPage title="Checks" :items="items" :fields="fields" :place="place" empty-title="No checks yet" data-checks>
        <template #empty>
            <template v-if="!loaded">
              <Skeleton shape="cards" />
            </template>
            <template v-else-if="failure">
              <p class="note" role="alert">{{ failure }}</p>
            </template>
            <template v-else>
              <p class="note">A check runs a command and says if it passed.</p>
            </template>
        </template>
        <template #corner="{item}">
            <span class="rhythm" data-check-rhythm>{{ rhythm(item.row) }}</span>
        </template>
        <template #card="{item}">
            <template v-if="item.row.run_percent !== null && item.row.run_percent !== undefined"><CheckRunBar :percent="item.row.run_percent" /></template>
            <template v-if="refusal"><p class="note" role="alert" data-check-refusal>{{ refusal }}</p></template>
        </template>
        <template #foot="{item}">
            <template v-if="!item.row.stopped">
              <Btn small bordered data-check-card-run :disabled="runningIds.has(item.id)" @click="run(item.row)">{{ runningIds.has(item.id) ? "Running" : "Run" }}</Btn>
            </template>
            <template v-else>
              <Btn small bordered data-check-card-start @click="start(item.row)">Start</Btn>
            </template>
        </template>
        <template #card-actions="{item}">
            <ActionsMenu :items="menuOf(item)" :head="item.title" />
        </template>
    </CardPage>
    <template v-if="opened">
        <CheckDialog :row="opened" :running="runningIds.has(opened.id)" @close="openedId = null" @run="run" />
    </template>
</template>

<style scoped>
.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.rhythm {
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}
</style>
