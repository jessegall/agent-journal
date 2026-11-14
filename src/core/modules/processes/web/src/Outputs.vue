<script setup>
import {computed} from "vue";
import {PageHeader, TableLayout, WindowRoom, ago, optionsOf, stateLabel, useWindow} from "@journal/window-kit";
import RunButtons from "./RunButtons.vue";

// the commands agents ran as a table with the filter chips State, Agent and Task: a row opens its output, and a run that is still going has Stop and Watch above the table
const context = useWindow();
if (context.agent != null) context.state["runs.session-agent-id"] = context.agent;
const {rows, failure, loaded} = context.props.runs;
const marks = context.props.marks.rows;
const standingMarks = computed(() => (marks.value ?? []).filter((mark) => !mark.lifted_at));
const isRunning = (row) => row.state === "running" || row.state === "background";
const COLUMNS = [{key: "id", label: "Output"}, {key: "line", label: "Command"}, {key: "agent", label: "Agent"}, {key: "task", label: "Task"}, {key: "state", label: "State"}, {key: "took", label: "Duration"}, {key: "when", label: "When"}];
const took = (row) => {
    if (!row.started_at) return "";
    const seconds = Math.max(0, Math.floor(((row.ended_at ? new Date(row.ended_at) : new Date()) - new Date(row.started_at)) / 1000));
    return seconds < 60 ? `${seconds} s` : `${Math.floor(seconds / 60)} m ${seconds % 60} s`;
};
const lines = computed(() => rows.value.map((row) => ({
    ref: `output:${row.id}`,
    id: row.id,
    line: row.line,
    agent: row.session_agent_id ? `Agent ${row.session_agent_id}` : "",
    task: row.task_id ? `Task ${row.task_id}` : "",
    state: stateLabel("process", row.state),
    status: row.state,
    took: took(row),
    when: row.created_at ? ago(row.created_at) : "",
    tone: row.state === "failed" || row.state === "lost" ? "danger" : "",
    row,
})));
const fields = computed(() => [
    {key: "state", label: "State", options: optionsOf(lines.value, (line) => [line.status], (state) => stateLabel("process", state)), get: (line) => line.status},
    {key: "agent", label: "Agent", options: optionsOf(lines.value, (line) => [line.agent].filter(Boolean)), get: (line) => line.agent},
    {key: "task", label: "Task", options: optionsOf(lines.value, (line) => [line.task].filter(Boolean)), get: (line) => line.task},
]);
const running = computed(() => rows.value.filter(isRunning));
</script>

<template>
    <WindowRoom padding="0">
        <div class="outputs" data-outputs>
            <PageHeader title="Output" :count="rows.length" />
            <template v-if="failure"><p class="note failure" role="alert">{{ failure }}</p></template>
            <template v-for="row in running" :key="row.id">
                <p class="running" data-running-run><span class="line">{{ row.line }}</span><RunButtons :process-id="row.id" /></p>
            </template>
            <TableLayout :columns="COLUMNS" :rows="lines" :fields="fields" :empty="loaded ? 'No commands yet' : 'Loading'" data-outputs-table />
            <template v-if="standingMarks.length">
                <section class="marks" data-unreadable-marks>
                    <h3>Commands no reader can read</h3>
                    <template v-for="mark in standingMarks" :key="mark.id">
                        <p class="mark" data-unreadable-mark>
                            <span class="line">{{ mark.words }}</span>
                            <span class="why">Why: {{ stateLabel('unreadable_mark', mark.reason) }}</span>
                            <span class="who">Marked by: {{ mark.creator_id }}</span>
                            <template v-if="mark.note"><span class="note">{{ mark.note }}</span></template>
                        </p>
                    </template>
                </section>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.outputs {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.note {
    margin: 0;
    padding: 0 var(--inset);
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    color: var(--danger);
}

.running {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin: 0;
    padding: 4px var(--inset);
    font-size: 12px;
}

.line {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.marks {
    padding: 8px var(--inset);
    font-size: 12px;
}

.marks h3 {
    margin: 0 0 4px;
    font-size: 12px;
    color: var(--text-2);
}

.mark {
    display: flex;
    gap: 8px;
    margin: 2px 0;
}

.why,
.who {
    flex: none;
    color: var(--text-3);
}

button {
    flex: none;
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}
</style>
