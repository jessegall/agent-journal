<script setup>
import {computed, watch} from "vue";
import {WindowRoom, useWindow} from "@journal/window-kit";

// four counts: the tasks started, blocked and delegated now, and the tasks completed in the period chosen in the window's menu: the last hours,
// or after the moment the reader chose "From now"; the menu also chooses how many columns the counts take, or Auto to follow the window's width
const NOW = "now";
const AUTO = "auto";
const PERIOD_WORDS = {"1": "in the last hour", "6": "in the last 6 hours", "24": "today", "168": "this week"};
const COUNTS = [["started", "Started"], ["blocked", "Blocked"], ["delegated", "Delegated"], ["completed", "Completed"]];
const view = useWindow();
const columns = view.option("columns");
const period = view.option("completed");
const since = view.option("since");
const {data, failure} = view.props.counts;

const clockOf = (text) => new Date(text).toLocaleString([], {dateStyle: "medium", timeStyle: "short"});
const periodText = computed(() => {
    if (period.value === NOW) return since.value ? `since ${clockOf(since.value)}` : "";
    return PERIOD_WORDS[period.value] ?? `in the last ${period.value} hours`;
});
const labelOf = (name, label) => (name === "completed" ? `${label} ${periodText.value}` : label);

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
            <div :class="['task-counts-grid', {'task-counts-grid-auto': columns === AUTO}]" :style="{'--task-count-columns': columns}">
                <template v-for="[name, label] in COUNTS" :key="name">
                    <div class="task-count" :data-task-count="name">
                        <span class="task-count-number" data-task-count-number>{{ data?.[name] ?? "" }}</span>
                        <span class="task-count-label" :data-task-count-label="name">{{ labelOf(name, label) }}</span>
                    </div>
                </template>
            </div>
        </div>
    </WindowRoom>
</template>

<style scoped>
.task-counts {
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.task-counts-grid {
    display: grid;
    grid-template-columns: repeat(var(--task-count-columns), minmax(0, 1fr));
    gap: 10px;
}

.task-counts-grid-auto {
    grid-template-columns: minmax(0, 1fr);
}

@container (min-width: 320px) {
    .task-counts-grid-auto {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@container (min-width: 640px) {
    .task-counts-grid-auto {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
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

.task-counts-failure {
    margin: 0;
    color: var(--danger);
}
</style>
