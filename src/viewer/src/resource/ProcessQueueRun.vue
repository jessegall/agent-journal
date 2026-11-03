<script setup>
import {computed, ref} from "vue";
import {useSharedNow} from "../composables/now.js";
import {useResourceEvents} from "./resourceEvents.js";
import {peek} from "../route.js";
import FoldSign from "../kit/FoldSign.vue";

const props = defineProps({
    run: {type: Object, required: true},
    environment: {type: String, required: true},
    position: {type: Number, required: true},
    read: {type: Function, required: true},
});
const expanded = ref(false);
const lines = ref([]);
const now = useSharedNow();
const STATES = {running: "Running", waiting: "Waiting", finished: "Passed", failed: "Failed", stopped: "Stopped", orphaned: "Lost"};
const state = computed(() => (props.run.section === "recent" ? STATES[props.run.state] : STATES[props.run.section]));
const duration = computed(() => {
    const start = props.run.section === "waiting" ? props.run.created_at : props.run.started_at;
    if (!start) return "";
    const end = props.run.ended_at ? new Date(props.run.ended_at).getTime() : now.value * 1000;
    const seconds = Math.max(0, Math.floor((end - new Date(start).getTime()) / 1000));
    if (seconds < 60) return `${seconds} s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} m ${seconds % 60} s`;
    return `${Math.floor(seconds / 3600)} h ${Math.floor(seconds / 60) % 60} m`;
});

async function refresh() {
    if (!expanded.value) return;
    const answer = await props.read(["output", "peek", String(props.run.id), "--lines", "1-10"]);
    lines.value = answer.ok ? answer.value.lines : [answer.error];
}
async function toggle() {
    expanded.value = !expanded.value;
    if (expanded.value) await refresh();
}
useResourceEvents(["output.*"], refresh);
</script>

<template>
    <div :class="['run', run.section]" :data-queue-row="run.section" :data-queue-process="run.id">
        <div class="run-line">
            <template v-if="run.section === 'waiting'">
                <span class="position" data-queue-position>{{ position }}</span>
            </template>
            <template v-else><span :class="['marker', run.state, {used: run.uses_slot}]">{{ run.section === 'recent' ? (run.state === 'finished' ? '✓' : '×') : '▤' }}</span></template>
            <code class="command" :title="run.line">{{ run.line }}</code>
            <span class="time"><small>{{ run.section === 'recent' ? 'ran' : run.section }}</small><span data-queue-time>{{ duration }}</span></span>
        </div>
        <div class="details">
            <span class="kind" data-queue-kind>{{ run.category }}</span>
            <span class="state" data-queue-state>{{ run.state === 'failed' ? `Failed, exit ${run.exit_code}` : state }}</span>
            <template v-if="run.worker_id">
                <button type="button" class="link" data-queue-worker @click="peek('agents', run.worker_id)">
                    Worker {{ run.worker_id }}
                </button>
            </template>
            <template v-else-if="run.is_main"><span>Main agent</span></template>
            <template v-if="run.task_id">
                <button type="button" class="link" data-queue-task @click="peek('tasks', run.task_id)">Task {{ run.task_id }}</button>
            </template>
            <template v-if="run.uses_slot"><span class="spot">Takes a spot</span></template>
        </div>
        <div class="output-links">
            <button type="button" class="output-toggle" :aria-expanded="expanded" data-queue-output @click="toggle">
                Output {{ run.id }}
                <FoldSign :open="expanded" />
            </button>
            <a class="link" :href="`?page=processes.output&output=${run.id}&environment=${encodeURIComponent(environment)}`" target="_blank" rel="noopener">Open in its own window</a>
        </div>
        <template v-if="expanded">
            <div class="output"><div class="output-heading">Output {{ run.id }}<span>10 lines from start</span></div><pre data-queue-output-body>{{ lines.join("\n") }}</pre></div>
        </template>
    </div>
</template>

<style scoped>
.run {
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 8px;
    padding: 13px 14px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--surface);
}
.queue-run-move,
.queue-run-enter-active,
.queue-run-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.queue-run-enter-from,
.queue-run-leave-to { opacity: 0; transform: translateY(6px); }
.queue-run-leave-active { position: absolute; }
@media (prefers-reduced-motion: reduce) {
    .queue-run-move,
    .queue-run-enter-active,
    .queue-run-leave-active { transition: none; }
    .queue-run-enter-from,
    .queue-run-leave-to { transform: none; }
}
.run-line {
    display: flex;
    align-items: baseline;
    gap: 10px;
}
.command {
    flex: 1;
    min-width: 0;
    color: var(--text);
    font-family: var(--font-mono, monospace);
    font-size: 11.5px;
    line-height: 1.6;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.time { display: flex; flex-direction: column; gap: 4px; text-align: right; }
.time small { color: var(--text-4); font-size: 10px; }
.marker { display: grid; place-items: center; flex: none; width: 20px; height: 20px; border: 1px solid var(--border-2); border-radius: 4px; color: var(--accent); }
.marker.used { background: var(--accent); color: white; }
.marker.finished { color: var(--tone-good, #268a60); }
.marker.failed, .marker.orphaned, .marker.stopped { color: var(--danger); }
.output-links { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 10px; font-size: 10.5px; color: var(--text-3); }
.output-links .output-toggle { margin-left: 0; border: 1px solid var(--border); border-radius: 5px; padding: 4px 6px; }
.output-links a { text-decoration: none; }
.output-heading { display: flex; justify-content: space-between; color: var(--text-3); font: 11px var(--font-mono, monospace); }
.output pre { max-height: 176px; overflow: auto; margin-bottom: 0; white-space: pre-wrap; }
@media (max-width: 520px) { .run-line { flex-wrap: wrap; } .time { flex-direction: row; flex-basis: 100%; margin-left: 30px; text-align: left; } }
.time {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}
.dot {
    flex: none;
    align-self: center;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--tone-good, var(--accent));
}
.dot.failed,
.dot.orphaned {
    background: var(--danger);
}
.position {
    flex: none;
    min-width: 14px;
    color: var(--text-4);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}
.details {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 7px;
    padding-left: 15px;
    color: var(--text-4);
    font-size: 10.5px;
}
.kind {
    padding: 2px 5px;
    border-radius: 4px;
    background: var(--hover);
    color: var(--text-3);
}
.link,
.output-toggle {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
}
.link:hover,
.output-toggle:hover {
    color: var(--accent-text);
}
.output-toggle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
}
.spot {
    color: var(--accent-text);
}
.output {
    max-height: 240px;
    margin: 12px 0 0;
    padding: 12px;
    overflow: auto;
    border-top: 1px solid var(--border);
    color: var(--text-2);
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    line-height: 1.6;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    background: #141519;
    color: #ddd;
    border-radius: 6px;
}
</style>
