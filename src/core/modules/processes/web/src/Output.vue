<script setup>
import {onMounted, ref} from "vue";
import {AutoScrollPane, EmptyState, OutputLines, WindowRoom, readOutputProp, useOutputPages, useWindow} from "@journal/window-kit";
import RunButtons from "./RunButtons.vue";

const context = useWindow();
const outputId = ref(Number(new URLSearchParams(location.search).get("output")) || 0);
const run = ref(null);
const lines = ref([]);
const isWhole = ref(false);
const pages = useOutputPages(readOutputProp(context), () => outputId.value);

const isRunning = () => run.value !== null && (run.value.state === "running" || run.value.state === "background");

async function load() {
    if (!outputId.value) {
        await context.reload("selection");
        outputId.value = context.props.selection.data.value?.value || 0;
    }
    if (!outputId.value) {
        if (context.agent != null) context.state["latest.session-agent-id"] = context.agent;
        await context.reload("latest");
        outputId.value = context.props.latest.rows.value[0]?.id || 0;
    }
    if (!outputId.value) return;
    const runKey = `run.${outputId.value}`;
    const summaryKey = `summary.${outputId.value}`;
    await context.reload(isWhole.value ? runKey : [runKey, summaryKey]);
    run.value = context.props[runKey].rows.value[0] ?? null;
    if (isWhole.value) {
        await pages.follow();
        return;
    }
    const text = context.props[summaryKey];
    lines.value = text.failure.value ? [text.failure.value] : text.data.value.lines;
}

async function toggle() {
    isWhole.value = !isWhole.value;
    await load();
}

context.follow(["process.*", "output.*"], load);
onMounted(load);
</script>

<template>
    <WindowRoom>
        <template v-if="!outputId">
            <EmptyState title="No output yet" />
        </template>
        <template v-else>
            <div class="output">
                <div class="bar">
                    <span class="line">{{ run ? run.line : "" }}</span>
                    <button class="whole" type="button" @click="toggle">{{ isWhole ? "Reader lines" : "Whole output" }}</button>
                    <template v-if="isRunning()">
                        <RunButtons :process-id="outputId" />
                    </template>
                </div>
                <template v-if="isWhole">
                    <OutputLines class="text" data-output-text :lines="pages.lines.value" @older="pages.loadEarlier" />
                </template>
                <template v-else>
                    <AutoScrollPane :row-count="lines.length">
                        <pre class="text" data-output-text>{{ lines.join("\n") }}</pre>
                    </AutoScrollPane>
                </template>
            </div>
        </template>
    </WindowRoom>
</template>

<style scoped>
.output {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
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
    margin: 0;
    padding: 0 12px 12px;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
}
</style>
