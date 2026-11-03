<script setup>
import {computed, ref} from "vue";
import {useSharedNow} from "../composables/now.js";
import {useResourceEvents} from "./resourceEvents.js";
import {peek} from "../route.js";
import FoldSign from "../kit/FoldSign.vue";

const props = defineProps({
    run: {type: Object, required: true},
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
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds / 60) % 60}m`;
});

async function refresh() {
    if (!expanded.value) return;
    const answer = await props.read(["output", "peek", String(props.run.id), "--all"]);
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
            <template v-else><span :class="['dot', run.state]" /></template>
            <code class="command">{{ run.line }}</code>
            <span class="time" data-queue-time>{{ duration }}</span>
        </div>
        <div class="details">
            <span class="kind" data-queue-kind>{{ run.category }}</span>
            <span class="state" data-queue-state>{{ state }}</span>
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
            <button type="button" class="output-toggle" :aria-expanded="expanded" data-queue-output @click="toggle">
                Output {{ run.id }}
                <FoldSign :open="expanded" />
            </button>
        </div>
        <template v-if="expanded">
            <pre class="output" data-queue-output-body>{{ lines.join("\n") }}</pre>
        </template>
    </div>
</template>

<style scoped>
.run {
    margin-bottom: 8px;
    padding: 13px 14px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--surface);
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
}
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
}
</style>
