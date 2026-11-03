<script setup>
import {computed, ref, watch} from "vue";
import {Btn, peekRef, RowList, SearchBar, Segmented, useRows, useWindow} from "@journal/window-kit";
import AgentCard from "./AgentCard.vue";

const SHOWS = [
    {key: "running", label: "Running"},
    {key: "closed", label: "Closed"},
    {key: "all", label: "All"},
];
// `texts` is what the window says when it is empty on each tab, {running, closed, all}, each {title, hint}: what is empty in its own terms and what brings rows
const props = defineProps({line: {type: String, required: true}, empty: {type: String, required: true}, texts: {type: Object, default: () => ({})}});
const {rows: facts} = useRows("usage agents --closed", ["agent.*", "task.*"]);
const {rows: workerWaits} = useRows("worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]);
const {rows: workerProgress} = useRows("worker progress", ["task.*", "worker_worktree.*"]);
const progressOf = (row) => workerProgress.value.find((progress) => progress.agent_id === row.id) ?? null;
const waitReasonOf = (row) => workerWaits.value.find((wait) => wait.agent_id === row.id)?.reason ?? "";
// Proof tests waiting in the process queue, counted on the button that opens the inspector.
const {rows: proofs} = useRows("proof list --limit 50", ["proof.*"]);
const WAITING = new Set(["queued", "running"]);
const waiting = computed(() => proofs.value.filter((proof) => WAITING.has(proof.state)).length);
const show = ref("running");
const words = ref("");

const context = useWindow();
const rows = ref([]);
const failure = ref("");
const loaded = ref(false);
const more = ref(false);
const limit = ref(25);
let latestRead = 0;
async function load() {
    const turn = ++latestRead;
    const answer = await context.read(`${props.line} --show ${show.value} --search ${JSON.stringify(words.value)} --limit ${limit.value}`);
    if (turn !== latestRead) return;
    rows.value = answer.ok ? answer.value.rows : [];
    failure.value = answer.ok ? "" : answer.error;
    more.value = answer.ok && answer.value.page * answer.value.size < answer.value.total;
    loaded.value = true;
}
async function older() {
    limit.value += 25;
    await load();
    return true;
}
watch([show, words], () => {
    limit.value = 25;
    load();
});
context.follow(["agent.*", "task.*", "worker_worktree.*"], load);
load();
const factsOf = (row) => facts.value.find((fact) => fact.id === row.id) ?? null;
const shown = rows;
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
            <SearchBar v-model="words" data-agents-search>
                <Segmented :options="SHOWS" :value="show" @pick="show = $event" />
                <Btn small bordered title="Open the process queue" data-agents-queue @click="peekRef('test_queue:0')">Process queue <span class="agents-queue-count" data-agents-queue-count>{{ waiting }}</span></Btn>
            </SearchBar>
        <RowList :rows="visible" :failure="failure" :loaded="loaded" :more="more" :older="older" :empty="emptyText.title" :hint="emptyText.hint" :searching="searching">
            <template #default="{row}">
                <div class="agent-row" :data-agent-row="row.id">
                    <AgentCard :row="row" :facts="factsOf(row)" :progress="progressOf(row)" :wait-reason="waitReasonOf(row)" :open="row.id === openId" @toggle="toggle(row)" />
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

.agents-queue-count {
    margin-left: 4px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

</style>
