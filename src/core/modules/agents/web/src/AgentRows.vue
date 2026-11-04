<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {Btn, peekRef, RowList, SearchBar, Segmented, useDeclaredRows, useRows, useWindow} from "@journal/window-kit";
import AgentCard from "./AgentCard.vue";

const SHOWS = [
    {key: "running", label: "Running"},
    {key: "idle", label: "Idle"},
    {key: "retired", label: "Retired"},
    {key: "all", label: "All"},
];
// `texts` is what the window says when it is empty on each tab, {running, closed, all}, each {title, hint}: what is empty in its own terms and what brings rows
const props = defineProps({line: {type: String, required: true}, empty: {type: String, required: true}, texts: {type: Object, default: () => ({})}});
const {rows: facts} = useRows("usage agents --closed", ["agent.*", "task.*"]);
const {rows: waits} = useDeclaredRows("waits");
const {rows: progress} = useDeclaredRows("progress");
const progressOf = (row) => progress.value.find((progress) => progress.agent_id === row.id) ?? null;
const waitReasonOf = (row) => waits.value.find((wait) => wait.agent_id === row.id)?.reason ?? "";
const {rows: queue} = useDeclaredRows("queue");
const WAITING = new Set(["queued", "running"]);
const waiting = computed(() => queue.value.filter((run) => WAITING.has(run.state)).length);
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
context.follow(["agent.*", "task.*", ...context.sources.flatMap((source) => source.events)], load);
load();
const factsOf = (row) => facts.value.find((fact) => fact.id === row.id) ?? null;
const shown = rows;
// a search is what makes an empty list mean nothing matches; the tab alone does not
const searching = computed(() => Boolean(words.value.trim()));
const emptyText = computed(() => props.texts[show.value] ?? {title: props.empty, hint: ""});

// one card is open at a time and takes the whole window: the others are held back, counted on a band at the foot, until it closes or a search starts
const openId = ref(null);
const agents = ref(null);
const rowOffset = ref(0);
const openRow = computed(() => shown.value.find((row) => row.id === openId.value) ?? null);
const visible = computed(() => (openRow.value ? [openRow.value] : shown.value));
const heldBack = computed(() => shown.value.length - visible.value.length);
const toggle = (row) => {
    if (openId.value !== row.id) {
        const card = agents.value.querySelector(`[data-agent-open="${row.id}"]`);
        rowOffset.value = card.getBoundingClientRect().top - agents.value.getBoundingClientRect().top;
    }
    openId.value = openId.value === row.id ? null : row.id;
};
watch(words, (typed) => typed.trim() && (openId.value = null));
const closeOnEscape = (event) => { if (event.key === "Escape" && openId.value) openId.value = null; };
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <div ref="agents" :class="['agents', {focused: openRow}]" :style="{'--agent-row-offset': `${rowOffset}px`}">
        <template v-if="!openRow"><SearchBar v-model="words" placeholder="Search agents" data-agents-search>
                <Segmented :options="SHOWS" :value="show" @pick="show = $event" />
                <Btn small bordered title="Open the process queue" data-agents-queue @click="peekRef('test_queue:0')">Process queue <span class="agents-queue-count" data-agents-queue-count>{{ waiting }}</span></Btn>
        </SearchBar></template>
        <Transition name="agents-view" mode="out-in">
        <div :key="openRow ? 'open' : 'list'" :class="['agents-view', {'agents-view-open': openRow}]">
        <RowList :rows="visible" :failure="failure" :loaded="loaded" :more="more" :older="older" :empty="emptyText.title" :hint="emptyText.hint" :searching="searching">
            <template #default="{row}">
                <div class="agent-row" :data-agent-row="row.id">
                    <AgentCard :row="row" :facts="factsOf(row)" :progress="progressOf(row)" :wait-reason="waitReasonOf(row)" :open="row.id === openId" @toggle="toggle(row)" />
                </div>
            </template>
        </RowList>
        </div>
        </Transition>
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
    min-width: 0;
    min-height: 0;
}

.agents :deep(.row-list) {
    gap: 0;
}

.agents :deep(.row-list-row) {
    padding: 0;
}

/* with a card open the list, its row and the card stretch down to the band at the foot */
.agents.focused .agents-view {
    display: flex;
    flex: 1;
    min-height: 0;
}

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
    background: var(--side);
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

.agents-view-enter-active { transition: opacity 160ms ease; }
.agents-view-leave-active { transition: opacity 140ms ease; }
.agents-view-enter-from, .agents-view-leave-to { opacity: 0; }
.agents-view-open.agents-view-enter-active { transition-duration: 280ms; }
.agents-view-open.agents-view-enter-active :deep(.agent-head), .agents-view-open.agents-view-enter-active :deep(.agent-line) { animation: agent-band-in 280ms cubic-bezier(0.2, 0.9, 0.25, 1) both; }
.agents-view-open.agents-view-leave-active { transition-duration: 280ms; }
.agents-view-open.agents-view-leave-active :deep(.agent-head), .agents-view-open.agents-view-leave-active :deep(.agent-line) { animation: agent-band-out 280ms cubic-bezier(0.2, 0.9, 0.25, 1) both; }
.agents-view-open.agents-view-leave-active :deep(.agent-more) { animation: agent-parts-out 120ms ease both; }
@keyframes agent-band-in { from { transform: translateY(var(--agent-row-offset)); } to { transform: translateY(0); } }
@keyframes agent-band-out { from { transform: translateY(0); } to { transform: translateY(var(--agent-row-offset)); } }
@keyframes agent-parts-out { to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .agents-view-enter-active, .agents-view-leave-active { transition: none; } }
@media (prefers-reduced-motion: reduce) { .agents-view-open.agents-view-enter-active :deep(.agent-head), .agents-view-open.agents-view-enter-active :deep(.agent-line), .agents-view-open.agents-view-leave-active :deep(.agent-head), .agents-view-open.agents-view-leave-active :deep(.agent-line), .agents-view-open.agents-view-leave-active :deep(.agent-more) { animation: none; } }

</style>
