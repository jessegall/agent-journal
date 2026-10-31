<script setup>
import {RowList, useRows, useWindow} from "@journal/window-kit";

const context = useWindow();
const {rows, failure, loaded} = useRows("process list", ["process.*", "output.*"]);

const isRunning = (row) => row.state === "running" || row.state === "background";
const stop = (row) => context.run(`output stop ${row.id}`);
const watch = (row) => context.run(`output watch ${row.id}`);
</script>

<template>
    <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No commands yet">
        <template #default="{row}">
            <div class="run">
                <span :class="['state', row.state]">{{ row.state }}</span>
                <span class="line">{{ row.line }}</span>
                <template v-if="isRunning(row)">
                    <button class="stop" type="button" @click="stop(row)">Stop</button>
                    <button class="watch" type="button" @click="watch(row)">Watch</button>
                </template>
            </div>
        </template>
    </RowList>
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
