<script setup>
import {computed, onUnmounted, ref} from "vue";
import {span} from "../format/time.js";
import {store} from "../state/store.js";
import {useNow} from "../composables/now.js";
import {api} from "../api/client.js";

const props = defineProps({
    rows: {type: Array, default: () => []},
    total: {type: Number, default: 0},
    started: {type: String, default: "started"},
    heading: {type: String, default: ""},
    agent: {type: Number, default: 0},
});
const emit = defineEmits(["open"]);
const now = useNow();
const minutes = computed(() => Number(((store.settings && store.settings.agent_sessions) || {}).recent ?? 60));
const recent = computed(() => props.rows.filter((r) => r.running || now.value - (r.ended || r.at || 0) <= minutes.value * 60));
const listed = computed(() => [...recent.value.filter((r) => r.running), ...recent.value.filter((r) => !r.running).reverse()]);
const dropped = computed(() => props.rows.length - recent.value.length);
const running = computed(() => props.rows.filter((r) => r.running).length);
const summary = computed(
    () =>
        `${running.value} running, ${props.total} ${props.started} in this session` +
        (dropped.value ? `, ${dropped.value} older than ${minutes.value} minutes not shown.` : ".")
);

const asked = ref(new Set());

async function stop(row) {
    asked.value = new Set([...asked.value, row.task_id]);
    await api.act("agent", props.agent, "stop_task", {task: row.task_id, description: row.task || row.command || row.task_id});
}

function lasted(row) {
    if (!row.at) return "";
    return row.running ? `running ${span(now.value - row.at)}` : `${row.status || "finished"} · ${span((row.ended || row.at) - row.at)}`;
}

function detail(row) {
    return row.command && row.task ? row.command : row.cell || [row.type, row.model].filter(Boolean).join(" · ");
}
</script>

<template>
    <template v-if="heading">
        <h4 class="crew-heading">{{ heading }}</h4>
    </template>
    <p class="crew-none">{{ summary }}</p>
    <template v-for="row in listed" :key="row.id || row.cell || `${row.task}-${row.model}`">
        <button
            type="button"
            :class="['crew-row', {done: !row.running}]"
            :disabled="!row.session"
            :title="row.session ? 'Open this session' : ''"
            @click="emit('open', row)"
        >
            <span :class="['crew-dot', {on: row.running}]" />
            <span class="crew-what">
                {{ row.task || row.command }}
                <small>{{ detail(row) }}</small>
            </span>
            <small class="crew-when">{{ lasted(row) }}</small>
            <template v-if="row.running && row.task_id && agent">
                <span
                    role="button"
                    :class="['crew-stop', {asked: asked.has(row.task_id)}]"
                    :title="asked.has(row.task_id) ? 'The agent was asked to stop it' : 'Stop it'"
                    @click.stop="!asked.has(row.task_id) && stop(row)"
                >
                    {{ asked.has(row.task_id) ? "Stopping…" : "Stop" }}
                </span>
            </template>
        </button>
    </template>
</template>

<style scoped>
.crew-heading {
    margin: 0;
    padding: 6px 8px 0;
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
}

.crew-none {
    margin: 0;
    padding: 6px 8px;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.4;
}

.crew-row {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 8px 10px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font-size: 12px;
    text-align: left;
}

.crew-stop {
    flex: none;
    padding: 1px 7px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 11px;
    cursor: pointer;
}

.crew-stop:hover:not(.asked) {
    border-color: var(--danger);
    color: var(--danger);
}

.crew-stop.asked {
    cursor: default;
    opacity: 0.7;
}

.crew-row:not(:disabled) {
    cursor: pointer;
}

.crew-row:not(:disabled):hover {
    background: var(--hover);
}

.crew-row.done {
    opacity: 0.6;
}

.crew-dot {
    flex: none;
    margin-top: 5px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-3);
}

.crew-dot.on {
    background: var(--created);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--created) 25%, transparent);
}

.crew-what {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.crew-what small {
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-3);
    font-size: 11px;
}

.crew-when {
    flex: none;
    align-self: flex-start;
    color: var(--text-3);
    font-size: 10.5px;
    line-height: 1.5;
    font-variant-numeric: tabular-nums;
}

.crew-heading {
    margin: 0;
    padding: 6px 8px 0;
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
}

.crew-none {
    padding-bottom: 8px;
}
</style>
