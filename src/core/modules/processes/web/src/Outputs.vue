<script setup>
import {ListTools, RowList, WindowRoom, stateLabel, useListTools, useWindow} from "@journal/window-kit";
import RunButtons from "./RunButtons.vue";

const context = useWindow();
if (context.agent != null) context.state["runs.session-agent-id"] = context.agent;
const {rows, failure, loaded} = context.props.runs;
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

button {
    flex: none;
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}
</style>
