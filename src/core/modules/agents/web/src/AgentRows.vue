<script setup>
import {computed, nextTick, onUnmounted, ref, watch} from "vue";
import {RowList, SearchBar, Segmented, useDeclaredRows, useRows, useWindow} from "@journal/window-kit";
import AgentCard from "./AgentCard.vue";

const SHOWS = [
    {key: "running", label: "Running"},
    {key: "idle", label: "Idle"},
    {key: "retired", label: "Retired"},
    {key: "all", label: "All"},
];
// `texts` is what the window says when it is empty on each tab, {running, closed, all}, each {title, hint}: what is empty in its own terms and what brings rows
const props = defineProps({line: {type: String, required: true}, empty: {type: String, required: true}, texts: {type: Object, default: () => ({})}});
const {rows: facts} = useRows("usage agents --closed", ["agent.*", "task.*", "hook_call.*"]);
const {rows: waits} = useDeclaredRows("waits");
const {rows: progress} = useDeclaredRows("progress");
const progressOf = (row) => progress.value.find((progress) => progress.agent_id === row.id) ?? null;
const waitReasonOf = (row) => waits.value.find((wait) => wait.agent_id === row.id)?.reason ?? "";
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
const list = ref(null);
const openRow = computed(() => shown.value.find((row) => row.id === openId.value) ?? null);
const visible = computed(() => (openRow.value ? [openRow.value] : shown.value));
const heldBack = computed(() => shown.value.length - visible.value.length);
const easing = "cubic-bezier(0.2, 0.9, 0.25, 1)";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let changing = false;
let scrollTop = 0;
async function open(row) {
    if (changing) return;
    changing = true;
    scrollTop = list.value.scrollTop;
    const card = agents.value.querySelector(`[data-agent-open="${row.id}"]`);
    if (!reduced()) {
        const others = [...agents.value.querySelectorAll(".agent-row")].filter((element) => !element.contains(card));
        await Promise.all(others.map((element) => element.animate([{opacity: 1}, {opacity: 0}], {duration: 140, fill: "forwards"}).finished));
    }
    const bands = [...card.querySelectorAll(".agent-head, .agent-line")];
    const elements = [...bands, ...card.querySelectorAll("[data-agent-motion]")];
    const before = elements.map((element) => element.getBoundingClientRect());
    openId.value = row.id;
    await nextTick();
    if (!reduced()) {
        const after = elements.map((element) => element.getBoundingClientRect());
        elements.forEach((element, index) => {
            const parent = bands.indexOf(element.parentElement);
            const x = before[index].left - after[index].left - (parent < 0 ? 0 : before[parent].left - after[parent].left);
            const y = before[index].top - after[index].top - (parent < 0 ? 0 : before[parent].top - after[parent].top);
            element.animate([{transform: `translate(${x}px, ${y}px)`}, {transform: "none"}], {duration: 280, easing});
        });
        agents.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((element) => {
            element.animate([{opacity: 0, transform: "translateY(6px)"}, {opacity: 1, transform: "none"}], {duration: 240, delay: 60, easing, fill: "backwards"});
        });
    }
    changing = false;
}
async function close() {
    if (changing || !openRow.value) return;
    changing = true;
    const card = agents.value.querySelector(`[data-agent-open="${openId.value}"]`);
    const parts = [...card.children, ...agents.value.querySelectorAll(".agents-held")];
    const fades = reduced() ? [] : parts.map((element) => element.animate([{opacity: 1}, {opacity: 0}], {duration: 120, fill: "forwards"}));
    await Promise.all(fades.map((animation) => animation.finished));
    openId.value = null;
    await nextTick();
    list.value.scrollTop = scrollTop;
    fades.forEach((animation) => animation.cancel());
    if (!reduced()) {
        card.animate([{transform: "translateY(-12px)"}, {transform: "none"}], {duration: 280, easing});
        agents.value.querySelectorAll(".agent-row").forEach((element) => {
            if (element.contains(card)) return;
            element.animate([{opacity: 0}, {opacity: 1}], {duration: 160, easing});
        });
    }
    changing = false;
}
const toggle = (row) => { if (openId.value === row.id) return close(); return open(row); };
watch(words, (typed) => typed.trim() && (openId.value = null));
watch(show, () => { openId.value = null; });
const closeOnEscape = (event) => { if (event.key === "Escape") close(); };
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <div ref="agents" :class="['agents', {focused: openRow}]">
        <SearchBar v-model="words" placeholder="Search agents" data-agents-search>
                <Segmented :options="SHOWS" :value="show" @pick="show = $event" />
        </SearchBar>
        <div ref="list" :class="['agents-view', {'agents-view-open': openRow}]">
        <RowList :rows="visible" :failure="failure" :loaded="loaded" :more="!openRow && more" :older="older" :empty="emptyText.title" :hint="emptyText.hint" :searching="searching">
            <template #default="{row}">
                <div class="agent-row" :data-agent-row="row.id">
                    <AgentCard :row="row" :facts="factsOf(row)" :progress="progressOf(row)" :wait-reason="waitReasonOf(row)" :open="row.id === openId" @toggle="toggle(row)" />
                </div>
            </template>
        </RowList>
        </div>
        <template v-if="openRow && heldBack">
            <button type="button" class="agents-held" data-agents-held @click="close">{{ heldBack }} more</button>
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

.agents-view {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

/* with a card open the list, its row and the card stretch down to the band at the foot */
.agents.focused .agents-view {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
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

</style>
