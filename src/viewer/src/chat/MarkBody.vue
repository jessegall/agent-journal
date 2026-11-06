<script setup>
import {peekRef} from "../route.js";
import {readOutputProp, useOutputPages} from "../composables/outputPages.js";
import {STOPPED_VARIANTS} from "../domain/markLook.js";
import {computed, ref, watch} from "vue";
import {usePoll} from "../../kit/usePoll.js";
import OutputLines from "../kit/OutputLines.vue";
import ModuleBody from "../windows/ModuleBody.vue";
import {useWindow} from "../../kit/windowContextKey.js";

// what an opened mark shows: its module's own body where the declaration names one, else version 4's lines, summary and output
const props = defineProps({
    declaration: {type: Object, required: true},
    mark: {type: Object, required: true},
    shown: Boolean,
    head: {type: Object, default: null},
    foot: {type: Object, default: null},
    actions: {type: Object, default: null},
    time: {type: Object, default: null},
    folded: Boolean,
});

const window = useWindow();
const lines = computed(() =>
    String(props.mark.lines || "")
        .split("\n")
        .filter(Boolean)
);
const RUN_MODEL = "process";
const TASK_MODEL = "task";
const stopReason = computed(() => (STOPPED_VARIANTS.has(props.mark.variant) ? props.mark.detail || "" : ""));
const taskId = computed(() => (props.mark.target_model === TASK_MODEL ? props.mark.target_id : 0));
const pages = useOutputPages(
    readOutputProp(window),
    () => props.mark.target_id
);
const outputLines = pages.lines;
const outputLoaded = ref(false);
const outputFailure = ref("");
const hasOutput = computed(() => !props.declaration.body_url && props.mark.target_model === RUN_MODEL && Boolean(props.mark.target_id));
async function readOutput(step = pages.follow) {
    const answer = await step();
    outputLoaded.value = true;
    outputFailure.value = answer.ok ? "" : answer.error;
}
const reading = computed(() => props.shown && hasOutput.value);
// the first read comes with the poll's start, a later opening reads at once, and a run that ended is read once more to its newest page
watch(reading, (now) => now && readOutput());
usePoll(() => reading.value && readOutput(), () => reading.value && !props.mark.ended_at);
watch(
    () => props.mark.ended_at,
    (ended) => ended && reading.value && readOutput(pages.newest)
);
</script>

<template>
    <div :class="['mark-more', {open: shown}]" @click.stop>
        <div class="mark-more-inner">
            <template v-if="declaration.body_url">
                <ModuleBody
                    :declaration="declaration"
                    :row="mark"
                    :head="head"
                    :foot="foot"
                    :actions="actions"
                    :time="time"
                    :folded="folded"
                />
            </template>
            <template v-else>
                <template v-if="stopReason">
                    <p class="mark-label">Why it stopped</p>
                    <p class="mark-lines" data-mark-reason>{{ stopReason }}</p>
                </template>
                <template v-if="hasOutput && outputFailure">
                    <p class="mark-lines" role="alert">{{ outputFailure }}</p>
                </template>
                <template v-else-if="hasOutput && outputLoaded">
                    <p class="mark-label">Output</p>
                    <OutputLines class="mark-terminal" :lines="outputLines" @older="pages.loadEarlier" />
                </template>
                <template v-else-if="lines.length">
                    <p class="mark-lines">{{ lines.join("\n") }}</p>
                </template>
                <template v-if="taskId">
                    <button type="button" class="mark-proofs" data-mark-task @click.stop="peekRef(`${TASK_MODEL}:${taskId}`)">
                        Open task {{ taskId }} and its proofs
                    </button>
                </template>
            </template>
        </div>
    </div>
</template>

<style scoped>
.mark-proofs {
    margin-top: 6px;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.mark-proofs:hover {
    background: var(--hover);
}

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
