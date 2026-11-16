<script setup>
import {computed, ref, watch} from "vue";
import {Btn, DropList, READ_RATES, TableLayout, WindowRoom, dated, usePoll, useWindow, wordLabel} from "@journal/window-kit";
import {toggleFeedPause} from "./toggleFeedPause.js";
import {usePausedProp} from "./usePausedProp.js";

const choices = (all, names) => [{key: "", label: all}, ...names.map((name) => ({key: name, label: wordLabel(name)}))];
const SOURCES = choices("All sources", ["server", "journal", "bypass"]);
const LEVELS = choices("All levels", ["debug", "info", "warning", "error", "critical"]);
const labelOf = (items, key) => items.find((item) => item.key === key).label;
const view = useWindow();
const source = ref("");
const level = ref("");
const page = ref(1);
const paused = ref(false);
const {data: listing, failure, loaded, reload} = usePausedProp(view, "logs", paused, {rows: [], total: 0, size: 50});
const COLUMNS = [{key: "time", label: "Time", width: "11rem"}, {key: "source", label: "Source", width: "6rem"}, {key: "level", label: "Level", width: "6rem"}, {key: "message", label: "Message", width: "1fr"}];
const TONES = {error: "danger", critical: "danger", warning: "warn"};
const lines = computed(() => listing.value.rows.map((line) => ({mark: line.id, time: dated(line.recorded_at), source: labelOf(SOURCES, line.source), level: labelOf(LEVELS, line.level), message: line.text, tone: TONES[line.level] ?? ""})));
// a click on a line shows it whole under the table
const picked = ref("");
const pickedLine = computed(() => listing.value.rows.find((line) => String(line.id) === picked.value) ?? null);
const pages = computed(() => Math.max(1, Math.ceil(listing.value.total / listing.value.size)));
function setFlags() {
    view.state["logs.page"] = String(page.value);
    for (const [name, value] of [["source", source.value], ["level", level.value]]) {
        if (value) view.state[`logs.${name}`] = value;
        else delete view.state[`logs.${name}`];
    }
}
setFlags();
async function load() {
    setFlags();
    await reload();
}
watch([source, level], () => {
    if (page.value !== 1) { page.value = 1; return; }
    if (!paused.value) load();
});
watch(page, () => { if (!paused.value) load(); });
function togglePause() {
    toggleFeedPause(paused, load);
}
usePoll(() => loaded.value && load(), () => !paused.value && view.visible.value, READ_RATES.systemLogs);
</script>

<template>
    <WindowRoom padding="0">
        <section class="logs" data-system-logs aria-label="System logs">
            <div class="toolbar">
                <span class="field">Source <DropList :label="labelOf(SOURCES, source)" :items="SOURCES" :picked="source" data-log-source @pick="source = $event.key" /></span>
                <span class="field">Level <DropList :label="labelOf(LEVELS, level)" :items="LEVELS" :picked="level" data-log-level @pick="level = $event.key" /></span>
                <Btn small data-log-pause :aria-pressed="paused" @click="togglePause">{{ paused ? 'Resume' : 'Pause' }}</Btn>
            </div>
            <template v-if="failure"><p role="alert">{{ failure }}</p></template>
            <TableLayout class="scroll" :columns="COLUMNS" :rows="lines" :empty="failure ? '' : 'No log lines found.'" :pick="(mark) => (picked = mark)" :active="pickedLine ? pickedLine.id : ''" data-log-table />
            <template v-if="pickedLine"><pre class="picked" data-log-line>{{ pickedLine.text }}</pre></template>
            <nav aria-label="Log pages"><Btn small data-log-previous :disabled="page <= 1 || paused" @click="page--">Previous</Btn><span>Page {{ page }} of {{ pages }}</span><Btn small data-log-next :disabled="page >= pages || paused" @click="page++">Next</Btn></nav>
        </section>
    </WindowRoom>
</template>

<style scoped>
.logs { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.toolbar, nav { display: flex; align-items: center; gap: 12px; padding: 10px 12px; flex: none; }
.toolbar { border-bottom: 1px solid var(--border); }
.toolbar label { display: flex; align-items: center; gap: 6px; }
.toolbar button { margin-left: auto; }
.scroll { flex: 1; min-height: 0; }
.picked { flex: none; max-height: 40%; overflow: auto; margin: 0; padding: 10px 12px; border-top: 1px solid var(--border); white-space: pre-wrap; word-break: break-word; font: 12px var(--mono, monospace); }
nav { justify-content: center; border-top: 1px solid var(--border); }
</style>
