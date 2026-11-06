<script setup>
import {computed, ref, watch} from "vue";
import {READ_RATES, WindowRoom, usePoll, useWindow} from "@journal/window-kit";
import {toggleFeedPause} from "./toggleFeedPause.js";

const context = useWindow();
const source = ref("");
const level = ref("");
const page = ref(1);
const paused = ref(false);
const listing = ref({rows: [], total: 0, size: 50});
const failure = ref("");
const pages = computed(() => Math.max(1, Math.ceil(listing.value.total / listing.value.size)));
let readNumber = 0;
async function load() {
    const number = ++readNumber;
    const flags = [`--page ${page.value}`];
    if (source.value) flags.push(`--source ${source.value}`);
    if (level.value) flags.push(`--level ${level.value}`);
    const answer = await context.read(`developer system-logs ${flags.join(" ")}`, {unbatched: true});
    if (paused.value || number !== readNumber) return;
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) listing.value = answer.value;
}
watch([source, level], () => {
    if (page.value !== 1) { page.value = 1; return; }
    if (!paused.value) load();
});
watch(page, () => { if (!paused.value) load(); });
function togglePause() {
    toggleFeedPause(paused, load);
}
usePoll(load, () => !paused.value, READ_RATES.systemLogs);
</script>

<template>
    <WindowRoom padding="0">
        <section class="logs" data-system-logs aria-label="System logs">
            <div class="toolbar">
                <label>Source <select v-model="source" data-log-source><option value="">All sources</option><template v-for="name in ['server', 'error', 'journal']" :key="name"><option :value="name">{{ name }}</option></template></select></label>
                <label>Level <select v-model="level" data-log-level><option value="">All levels</option><template v-for="name in ['debug', 'info', 'warning', 'error', 'critical']" :key="name"><option :value="name">{{ name }}</option></template></select></label>
                <button type="button" data-log-pause :aria-pressed="paused" @click="togglePause">{{ paused ? 'Resume' : 'Pause' }}</button>
            </div>
            <template v-if="failure"><p role="alert">{{ failure }}</p></template>
            <div class="scroll">
                <table>
                    <thead><tr><template v-for="column in ['Time (UTC)', 'Source', 'Level', 'Message']" :key="column"><th>{{ column }}</th></template></tr></thead>
                    <tbody><template v-for="line in listing.rows" :key="line.id"><tr data-log-line :data-level="line.level"><td><time :datetime="line.recorded_at" title="Lines without a time use the preceding line's time, or the file's modified time.">{{ line.recorded_at }}</time></td><td>{{ line.source }}</td><td>{{ line.level }}</td><td class="message">{{ line.text }}</td></tr></template></tbody>
                </table>
                <template v-if="!listing.rows.length && !failure"><p class="empty">No log lines found.</p></template>
            </div>
            <nav aria-label="Log pages"><button type="button" data-log-previous :disabled="page <= 1 || paused" @click="page--">Previous</button><span>Page {{ page }} of {{ pages }}</span><button type="button" data-log-next :disabled="page >= pages || paused" @click="page++">Next</button></nav>
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
