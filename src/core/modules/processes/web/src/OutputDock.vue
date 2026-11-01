<script setup>
import {ref} from "vue";
import {usePoll, useWindow} from "@journal/window-kit";

// the card of a docked process, as version 4 drew it: where the run stands and the last lines its reader summarises, read again
// every two seconds while the run is going
const context = useWindow();
const item = context.option("row");
const run = ref(null);
const lines = ref([]);

const isRunning = () => run.value === null || run.value.state === "running" || run.value.state === "background";

async function load() {
    const id = item.value?.target_id;
    if (!id) return;
    const shown = await context.read(`process show ${id}`);
    run.value = shown.ok ? shown.value : null;
    const text = await context.read(`output peek ${id} --summary`);
    lines.value = text.ok ? text.value.lines : [];
}

usePoll(load, isRunning);
</script>

<template>
    <div class="output-dock" data-output-dock>
        <template v-if="run">
            <span :class="['output-dock-state', run.state]">{{ run.state }}</span>
            <span class="output-dock-line">{{ run.line }}</span>
        </template>
        <template v-if="lines.length">
            <pre class="output-dock-lines">{{ lines.join("\n") }}</pre>
        </template>
    </div>
</template>

<style scoped>
.output-dock {
    display: flex;
    margin: 0 14px 10px 36px;
    flex-wrap: wrap;
    gap: 4px 8px;
    font-size: 12px;
    line-height: 1.45;
}

.output-dock-state {
    color: var(--text-3);
}

.output-dock-state.running,
.output-dock-state.background {
    color: var(--accent-text);
}

.output-dock-line {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.output-dock-lines {
    flex-basis: 100%;
    margin: 0;
    color: var(--text-2);
    font-size: 11.5px;
    white-space: pre-wrap;
}
</style>
