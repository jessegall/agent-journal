<script setup>
import {computed, ref, watch} from "vue";
import {Btn, DropList, READ_RATES, WindowRoom, dated, usePoll, useWindow, wordLabel} from "@journal/window-kit";
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
            <div class="scroll">
                <table>
                    <thead><tr><template v-for="column in ['Time', 'Source', 'Level', 'Message']" :key="column"><th>{{ column }}</th></template></tr></thead>
                    <tbody><template v-for="line in listing.rows" :key="line.id"><tr data-log-line :data-level="line.level"><td><time :datetime="line.recorded_at" title="Lines without a time use the preceding line's time, or the file's modified time.">{{ dated(line.recorded_at) }}</time></td><td>{{ labelOf(SOURCES, line.source) }}</td><td>{{ labelOf(LEVELS, line.level) }}</td><td class="message">{{ line.text }}</td></tr></template></tbody>
                </table>
                <template v-if="!listing.rows.length && !failure"><p class="empty">No log lines found.</p></template>
            </div>
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
.scroll { flex: 1; min-height: 0; overflow: auto; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th { position: sticky; top: 0; background: var(--surface); text-align: left; color: var(--text-3); }
th, td { padding: 8px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
time { white-space: nowrap; }
.message { white-space: pre-wrap; overflow-wrap: anywhere; width: 100%; font-family: monospace; }
[data-level="error"], [data-level="critical"] { color: var(--danger, #c53a3a); }
[data-level="warning"] { color: var(--warning, #a76a13); }
.empty { padding: 12px; color: var(--text-3); }
nav { justify-content: center; border-top: 1px solid var(--border); }
</style>
