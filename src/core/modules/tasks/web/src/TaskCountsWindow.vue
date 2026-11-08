<script setup>
import {computed, watch} from "vue";
import {WindowRoom, useWindow} from "@journal/window-kit";

// four counts: the tasks started, blocked and delegated now, and the tasks completed in the period chosen in the window's menu: the last hours,
// or after the moment the reader chose "From now"; the menu also chooses how many columns the counts take
const NOW = "now";
const COUNTS = [["started", "Started"], ["blocked", "Blocked"], ["delegated", "Delegated"], ["completed", "Completed"]];
const view = useWindow();
const columns = view.option("columns");
const period = view.option("completed");
const since = view.option("since");
const {data, failure} = view.props.counts;

const clockOf = (text) => new Date(text).toLocaleString([], {dateStyle: "medium", timeStyle: "short"});
const rangeText = computed(() => {
    if (period.value === NOW) return since.value ? `since ${clockOf(since.value)}` : "";
    return `in the last ${period.value} ${Number(period.value) === 1 ? "hour" : "hours"}`;
});

// the key reads the period through its own arguments: set before the window's first read, and read again when the period changes;
// choosing "From now" keeps that moment on the pane
function askFor(chosen) {
    if (chosen === NOW) {
        const moment = since.value ?? new Date().toISOString();
        view.setOption("since", moment);
        view.state["counts.since"] = moment;
        delete view.state["counts.hours"];
        return;
    }
    if (since.value) view.setOption("since", null);
    view.state["counts.hours"] = chosen;
    delete view.state["counts.since"];
}

askFor(period.value);
watch(period, (chosen) => {
    askFor(chosen);
    view.reload("counts");
});
</script>

<template>
    <WindowRoom>
        <div class="task-counts" data-task-counts>
            <template v-if="failure">
                <p class="task-counts-failure" role="alert">{{ failure }}</p>
            </template>
            <div class="task-counts-grid" :style="{'--task-count-columns': columns}">
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
    grid-template-columns: repeat(var(--task-count-columns), minmax(0, 1fr));
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

.task-counts-failure {
    margin: 0;
    color: var(--danger);
}
</style>
