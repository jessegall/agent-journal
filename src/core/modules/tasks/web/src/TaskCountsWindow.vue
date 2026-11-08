<script setup>
import {computed, watch} from "vue";
import {Btn, Segmented, WindowRoom, useWindow} from "@journal/window-kit";

// four counts: the tasks started, blocked and delegated now, and the tasks completed over a range the window keeps: the last hours, after a fixed time,
// or after the moment the reader chose "From now" or reset it
const DEFAULT_HOURS = 24;
const HOURS = "hours";
const TIME = "time";
const NOW = "now";
const KINDS = [{key: HOURS, label: "Last hours"}, {key: TIME, label: "From a time"}, {key: NOW, label: "From now"}];
const COUNTS = [["started", "Started"], ["blocked", "Blocked"], ["delegated", "Delegated"], ["completed", "Completed"]];
const view = useWindow();
const kept = view.option("range");
const range = computed(() => kept.value ?? {kind: HOURS, hours: DEFAULT_HOURS});
const {data, failure} = view.props.counts;

const nowText = () => new Date().toISOString();
const clockOf = (text) => new Date(text).toLocaleString([], {dateStyle: "medium", timeStyle: "short"});
const localInput = (text) => (text ? new Date(new Date(text).getTime() - new Date(text).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "");

// with no time chosen yet, "From a time" counts the default last hours
const hoursOf = ({kind, hours, since}) => (kind === HOURS ? hours : (since ? null : DEFAULT_HOURS));
const rangeText = computed(() => {
    const hours = hoursOf(range.value);
    return hours === null ? `since ${clockOf(range.value.since)}` : `in the last ${hours} ${Number(hours) === 1 ? "hour" : "hours"}`;
});

function keep(next) {
    view.setOption("range", next);
}

function pick(kind) {
    if (kind === HOURS) keep({kind, hours: range.value.hours ?? DEFAULT_HOURS});
    else keep({kind, since: kind === NOW ? nowText() : range.value.since ?? ""});
}

function setHours(event) {
    const hours = Number(event.target.value);
    if (hours > 0) keep({kind: HOURS, hours});
}

function setTime(event) {
    keep({kind: TIME, since: event.target.value ? new Date(event.target.value).toISOString() : ""});
}

// the key reads the range through its own arguments
watch(range, (chosen) => {
    const hours = hoursOf(chosen);
    if (hours === null) {
        view.state["counts.since"] = chosen.since;
        delete view.state["counts.hours"];
    } else {
        view.state["counts.hours"] = String(hours);
        delete view.state["counts.since"];
    }
    view.reload("counts");
}, {immediate: true});
</script>

<template>
    <WindowRoom>
        <div class="task-counts" data-task-counts>
            <template v-if="failure">
                <p class="task-counts-failure" role="alert">{{ failure }}</p>
            </template>
            <div class="task-counts-grid">
                <template v-for="[name, label] in COUNTS" :key="name">
                    <div class="task-count" :data-task-count="name">
                        <span class="task-count-number" data-task-count-number>{{ data?.[name] ?? "" }}</span>
                        <span class="task-count-label">{{ label }}</span>
                        <template v-if="name === 'completed'">
                            <span class="task-count-note" data-task-count-range>{{ rangeText }}</span>
                        </template>
                    </div>
                </template>
            </div>
            <div class="task-counts-range" data-task-counts-range>
                <Segmented :options="KINDS" :value="range.kind" @pick="pick" />
                <template v-if="range.kind === 'hours'">
                    <label class="task-counts-field">Hours <input type="number" min="1" :value="range.hours" data-task-counts-hours @change="setHours"></label>
                </template>
                <template v-else-if="range.kind === 'time'">
                    <label class="task-counts-field">Completed after <input type="datetime-local" :value="localInput(range.since)" data-task-counts-time @change="setTime"></label>
                </template>
                <template v-else>
                    <Btn small data-task-counts-reset @click="pick('now')">Reset to now</Btn>
                </template>
            </div>
        </div>
    </WindowRoom>
</template>

<style scoped>
.task-counts {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.task-counts-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.task-count {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
}

.task-count-number {
    font-size: 28px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.task-count-label {
    color: var(--text-2);
    font-size: 12.5px;
}

.task-count-note {
    color: var(--text-3);
    font-size: 11.5px;
}

.task-counts-range {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.task-counts-field {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    color: var(--text-2);
    font-size: 12.5px;
}

.task-counts-field input {
    padding: 4px 6px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: var(--text);
    font: inherit;
}

.task-counts-failure {
    margin: 0;
    color: var(--danger);
}
</style>
