<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {Btn, ordered, peekRef, RowList, SearchBar, Segmented, useRows, useWindow} from "@journal/window-kit";
import AgentCard from "./AgentCard.vue";

const SHOWS = [
    {key: "running", label: "Running"},
    {key: "closed", label: "Closed"},
    {key: "all", label: "All"},
];
// `texts` is what the window says when it is empty on each tab, {running, closed, all}, each {title, hint}: what is empty in its own terms and what brings rows
const props = defineProps({line: {type: String, required: true}, empty: {type: String, required: true}, texts: {type: Object, default: () => ({})}, only: {type: Function, default: () => true}});
const {rows, failure, loaded, more, older} = useRows(props.line, ["agent.*"], {incremental: true});
const {rows: runningRows} = useRows("agent running", ["agent.*"]);
const {rows: facts} = useRows("usage agents --closed", ["agent.*", "task.*"]);
// the tests of proofs that wait in the journal's test queue, counted on the button that opens the queue inspector
const {rows: proofs} = useRows("proof list --limit 50", ["proof.*"]);
const WAITING = new Set(["queued", "running"]);
const waiting = computed(() => proofs.value.filter((proof) => WAITING.has(proof.state)).length);
const show = ref("running");
const words = ref("");

// an agent that ended stays in the running tab for ten seconds with a faint bar running down along its foot, which pauses while the pointer is over its row
const LINGER_MS = 10000;
const TICK_MS = 250;
const now = ref(Date.now());
const lingering = ref(new Map());
const held = ref(new Set());
let lastTick = Date.now();
let lastRunning = new Map();
const tick = setInterval(() => {
    const at = Date.now();
    const next = new Map(lingering.value);
    for (const [id, linger] of next) {
        if (held.value.has(id)) next.set(id, {...linger, leavesAt: linger.leavesAt + (at - lastTick)});
        else if (at >= linger.leavesAt) next.delete(id);
    }
    lastTick = at;
    now.value = at;
    if (next.size !== lingering.value.size || [...next].some(([id, linger]) => linger !== lingering.value.get(id))) lingering.value = next;
}, TICK_MS);
onUnmounted(() => clearInterval(tick));
watch(runningRows, (current) => {
    const ids = new Set(current.map((row) => row.id));
    const next = new Map(lingering.value);
    for (const [id, row] of lastRunning) {
        if (!ids.has(id) && !next.has(id) && !hasWorkLeft(row)) next.set(id, {row: {...row, ended_at: row.ended_at ?? new Date().toISOString()}, leavesAt: Date.now() + LINGER_MS});
    }
    for (const id of ids) next.delete(id);
    lastRunning = new Map(current.map((row) => [row.id, row]));
    lingering.value = next;
});
const lingeringFor = (row) => lingering.value.get(row.id) ?? null;
const hold = (row) => (held.value = new Set([...held.value, row.id]));
const release = (row) => (held.value = new Set([...held.value].filter((id) => id !== row.id)));
const leaveStyle = (row) => ({animationDuration: `${LINGER_MS}ms`, animationDelay: `${Math.min(0, lingeringFor(row).leavesAt - LINGER_MS - Date.now())}ms`});

// a worker runs one turn at a time: stopped with tasks left it is not finished, so it stays with the running ones
const UNFINISHED_STATES = new Set(["open", "started", "testing"]);
const hasWorkLeft = (row) => row.role === "worker" && (factsOf(row)?.tasks ?? []).some((task) => UNFINISHED_STATES.has(task.state));
const isRunning = (row) => !row.ended_at || hasWorkLeft(row);
const kept = (row) => show.value === "all" || (show.value === "running") === isRunning(row) || (show.value === "running" && lingering.value.has(row.id));
const factsOf = (row) => facts.value.find((fact) => fact.id === row.id) ?? null;
const found = (row) => `${row.id} ${row.session} ${row.program} ${row.role} ${factsOf(row)?.profile ?? ""} ${factsOf(row)?.given_name ?? ""}`.toLowerCase().includes(words.value.trim().toLowerCase());
// the running tab reads every running agent, however old, and those that ended a moment ago; the others page through all agents
const stoppedWithWork = computed(() => rows.value.filter((row) => row.ended_at && hasWorkLeft(row) && !lingering.value.has(row.id)));
const listed = computed(() => (show.value === "running" ? [...runningRows.value, ...stoppedWithWork.value, ...[...lingering.value.values()].map((linger) => linger.row)] : rows.value));
const searched = computed(() => listed.value.filter((row) => props.only(row) && kept(row) && found(row)));

// the pane menu's order, and an agent as the order reads it: the state its card shows, its role, the number, and when it was last heard of
const order = useWindow().option("order");
const stateOf = (row) => (row.ended_at ? "stopped" : factsOf(row)?.state === "blocked" ? "waiting" : factsOf(row)?.state === "waiting" || row.paused_at ? "idle" : "working");
const entryOf = (row) => ({key: String(row.id), kind: row.role, n: row.id, time: Date.parse(row.updated_at ?? row.created_at ?? 0) / 1000 || 0, card: {state: stateOf(row)}, row});
const shown = computed(() => ordered(searched.value.map(entryOf), order.value ?? "number").map((entry) => entry.row));
// a search is what makes an empty list mean nothing matches; the tab alone does not
const searching = computed(() => Boolean(words.value.trim()));
const emptyText = computed(() => props.texts[show.value] ?? {title: props.empty, hint: ""});

// one card is open at a time and takes the whole window: the others are held back, counted on a band at the foot, until it closes or a search starts
const openId = ref(null);
const openRow = computed(() => shown.value.find((row) => row.id === openId.value) ?? null);
const visible = computed(() => (openRow.value ? [openRow.value] : shown.value));
const heldBack = computed(() => shown.value.length - visible.value.length);
const toggle = (row) => (openId.value = openId.value === row.id ? null : row.id);
watch(words, (typed) => typed.trim() && (openId.value = null));
</script>

<template>
    <div :class="['agents', {focused: openRow}]">
        <div class="agents-bar">
            <SearchBar v-model="words" class="agents-search" data-agents-search>
                <Segmented :options="SHOWS" :value="show" @pick="show = $event" />
                <Btn small bordered title="Open the test queue" data-agents-queue @click="peekRef('test_queue:0')">Test queue <span class="agents-queue-count" data-agents-queue-count>{{ waiting }}</span></Btn>
            </SearchBar>
        </div>
        <RowList :rows="visible" :failure="failure" :loaded="loaded" :more="more && show !== 'running'" :older="older" :empty="emptyText.title" :hint="emptyText.hint" :searching="searching">
            <template #default="{row}">
                <div class="agent-row" :data-agent-row="row.id" @mouseenter="hold(row)" @mouseleave="release(row)">
                    <AgentCard :row="row" :facts="factsOf(row)" :open="row.id === openId" @toggle="toggle(row)" />
                    <template v-if="lingeringFor(row)">
                        <span class="agent-leave" data-agent-leave aria-hidden="true"><i :style="leaveStyle(row)" /></span>
                    </template>
                </div>
            </template>
        </RowList>
        <template v-if="openRow && heldBack">
            <button type="button" class="agents-held" data-agents-held @click="openId = null">{{ heldBack }} more</button>
        </template>
    </div>
</template>

<style scoped>
.agents {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 400px;
    min-height: 0;
}

.agents :deep(.row-list) {
    gap: 0;
}

.agents :deep(.row-list-row) {
    padding: 0;
}

/* with a card open the list, its row and the card stretch down to the band at the foot */
.agents.focused :deep(.row-list) {
    flex: 1;
    min-height: 0;
}

.agents.focused :deep(.row-list-row) {
    flex: 1;
    min-height: 0;
    align-items: stretch;
}

.agents.focused .agent-row {
    display: flex;
    min-height: 0;
}

.agent-row {
    position: relative;
    flex: 1;
    min-width: 0;
}

.agents-held {
    flex: none;
    padding: 7px 12px;
    border: 0;
    border-top: 1px solid var(--border);
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
}

.agents-held:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-leave {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    overflow: hidden;
    pointer-events: none;
}

.agent-leave i {
    display: block;
    height: 100%;
    background: color-mix(in srgb, var(--text-3) 45%, transparent);
    transform-origin: left center;
    animation: agent-leave-run-down linear forwards;
}

.agent-row:hover .agent-leave i {
    animation-play-state: paused;
}

@keyframes agent-leave-run-down {
    from {
        transform: scaleX(1);
    }

    to {
        transform: scaleX(0);
    }
}

.agents-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

.agents-search {
    flex: 1;
    min-width: 0;
}

.agents-queue-count {
    margin-left: 4px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

</style>
