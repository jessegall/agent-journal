<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import OutputLines from "../kit/OutputLines.vue";
import ModuleBody from "../windows/ModuleBody.vue";
import {api} from "../api/client.js";
import {lineResult} from "../windows/windowContext.js";

// what an opened mark shows: its module's own body where the declaration names one, else version 4's lines, summary and output
const props = defineProps({declaration: {type: Object, required: true}, mark: {type: Object, required: true}, shown: Boolean, head: {type: Object, default: null}});

const lines = computed(() => String(props.mark.lines || "").split("\n").filter(Boolean));
const RUN_MODEL = "process";
const POLL_MILLISECONDS = 2000;
const outputLines = ref([]);
const outputLoaded = ref(false);
const outputFailure = ref("");
const hasOutput = computed(() => props.mark.target_model === RUN_MODEL && Boolean(props.mark.target_id));
async function readOutput() {
    const answer = await lineResult("messages.chat", ["output", "peek", String(props.mark.target_id), "--all"], api.env());
    outputLoaded.value = true;
    outputFailure.value = answer.ok ? "" : answer.error;
    if (answer.ok) outputLines.value = answer.value.lines;
}
let poll = null;
const stopPoll = () => clearInterval(poll);
watch(() => props.shown && hasOutput.value, (reading) => {
    stopPoll();
    if (!reading) return;
    readOutput();
    if (!props.mark.ended_at) poll = setInterval(readOutput, POLL_MILLISECONDS);
}, {immediate: true});
watch(() => props.mark.ended_at, (ended) => ended && props.shown && hasOutput.value && (stopPoll(), readOutput()));
onUnmounted(stopPoll);
</script>

<template>
    <div :class="['mark-more', {open: shown}]" @click.stop>
        <div class="mark-more-inner">
            <template v-if="declaration.body_url">
                <ModuleBody :declaration="declaration" :row="mark" :head="head" />
            </template>
            <template v-else>
                <template v-if="hasOutput && outputFailure">
                    <p class="mark-lines" role="alert">{{ outputFailure }}</p>
                </template>
                <template v-else-if="hasOutput && outputLoaded">
                    <p class="mark-label">Output</p>
                    <OutputLines class="mark-terminal" :lines="outputLines" />
                </template>
                <template v-else-if="lines.length">
                    <p class="mark-lines">{{ lines.join("\n") }}</p>
                </template>
            </template>
        </div>
    </div>
</template>

<style scoped>
.mark-more {
    grid-column: 1 / -1;
    contain: inline-size;
}

.mark-more:not(.open) {
    display: none;
}

.mark-lines {
    margin: 0;
    padding: 2px 0 0 20px;
    text-align: left;
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.45;
    white-space: pre-line;
    overflow-wrap: anywhere;
}

.mark-label {
    margin: 8px 0 2px 20px;
    color: var(--text-4);
    font-size: 10.5px;
}

.mark-terminal {
    max-height: 150px;
    margin: 0 0 2px 20px;
    padding: 8px 10px;
    overflow: auto;
    border-radius: 6px;
    background: var(--term);
    color: #d6d6d6;
    font:
        11px/1.55 ui-monospace,
        "SF Mono",
        Menlo,
        monospace;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
