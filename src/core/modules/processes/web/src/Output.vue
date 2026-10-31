<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {EmptyState, useWindow} from "@journal/window-kit";

const POLL_MILLISECONDS = 2000;
const context = useWindow();
const outputId = ref(0);
const run = ref(null);
const lines = ref([]);
const isWhole = ref(false);
let timer = null;

const isRunning = () => run.value !== null && (run.value.state === "running" || run.value.state === "background");

async function load() {
    outputId.value = outputId.value || (await context.setting("output", 0));
    if (!outputId.value) {
        const listed = await context.read("process list --limit 1");
        outputId.value = listed.ok && listed.value.rows.length ? listed.value.rows[0].id : 0;
    }
    if (!outputId.value) return;
    const shown = await context.read(`process show ${outputId.value}`);
    run.value = shown.ok ? shown.value : null;
    const text = await context.read(`output peek ${outputId.value} ${isWhole.value ? "--all" : "--summary"}`);
    lines.value = text.ok ? text.value.lines : [text.error];
}

function poll() {
    timer = setTimeout(async () => {
        if (isRunning()) await load();
        poll();
    }, POLL_MILLISECONDS);
}

async function toggle() {
    isWhole.value = !isWhole.value;
    await load();
}

context.follow(["process.*", "output.*"], load);
onMounted(async () => {
    await load();
    poll();
});
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
    <template v-if="!outputId">
        <EmptyState title="No output yet" />
    </template>
    <template v-else>
        <div class="output">
            <div class="bar">
                <span class="line">{{ run ? run.line : "" }}</span>
                <button class="whole" type="button" @click="toggle">{{ isWhole ? "Reader lines" : "Whole output" }}</button>
                <template v-if="isRunning()">
                    <button class="stop" type="button" @click="context.run(`output stop ${outputId}`)">Stop</button>
                    <button class="watch" type="button" @click="context.run(`output watch ${outputId}`)">Watch</button>
                </template>
            </div>
            <pre class="text">{{ lines.join("\n") }}</pre>
        </div>
    </template>
</template>

<style scoped>
.output {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.bar {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 8px 12px;
    font-size: 12px;
}

.line {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

button {
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}

.text {
    flex: 1;
    margin: 0;
    padding: 0 12px 12px;
    overflow: auto;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
}
</style>
