<script setup>
import {ListTools, RowList, WindowRoom, stateLabel, useListTools, useWindow} from "@journal/window-kit";
import {computed} from "vue";
import RunButtons from "./RunButtons.vue";

const context = useWindow();
if (context.agent != null) context.state["runs.session-agent-id"] = context.agent;
const {rows, failure, loaded} = context.props.runs;
const marks = context.props.marks.rows;
const standingMarks = computed(() => (marks.value ?? []).filter((mark) => !mark.lifted_at));
const tools = useListTools(rows, {title: (row) => row.line, isOpen: (row) => row.state === "running"});

const isRunning = (row) => row.state === "running" || row.state === "background";
</script>

<template>
    <WindowRoom>
        <ListTools :tools="tools" />
        <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No commands yet" hint="Commands run by an agent appear here with their output." :searching="tools.filtering.value">
            <template #default="{row}">
                <div class="run">
                    <span :class="['state', row.state]">{{ stateLabel('process', row.state) }}</span>
                    <span class="line">{{ row.line }}</span>
                    <template v-if="isRunning(row)">
                        <RunButtons :process-id="row.id" />
                    </template>
                </div>
            </template>
        </RowList>
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
    </WindowRoom>
</template>

<style scoped>
.run {
    display: flex;
    flex: 1;
    align-items: baseline;
    gap: 8px;
    font-size: 12px;
}

.state {
    flex: none;
    min-width: 64px;
    color: var(--text-3);
}

.state.failed,
.state.lost {
    color: var(--red, #d4574b);
}

.line {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.marks {
    padding: 8px 12px;
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
.who,
.note {
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
