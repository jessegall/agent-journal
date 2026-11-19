<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {Btn, Dialog, OutputLines, Segmented, TimeAgo, useWindow} from "@journal/window-kit";
import CheckRunBar from "./CheckRunBar.vue";

// one check's output in a terminal view: the latest run's, or the run picked from its runs, and the button that runs it
const VIEWS = [
    {key: "output", label: "Output"},
    {key: "runs", label: "Runs"},
];
const props = defineProps({row: {type: Object, required: true}, running: Boolean});
const emit = defineEmits(["close", "run"]);
const view = useWindow();
const tab = ref("output");
const chosenRun = ref(null);
const key = `runs.${props.row.id}`;
const {rows: runs, failure} = view.props[key];
const shownOutput = computed(() => chosenRun.value?.output ?? props.row.last_output);
const shownLines = computed(() => (shownOutput.value ? shownOutput.value.split("\n") : []));

function showRun(run) {
    chosenRun.value = run;
    tab.value = "output";
}

const readRuns = () => { if (tab.value === "runs") return view.reload(key); };
watch(tab, readRuns);
const stopFollowing = view.follow(["check.*"], readRuns);
onUnmounted(() => stopFollowing?.());
</script>

<template>
    <Dialog padded :title="`Check ${row.id}: ${row.title}`" wide data-check-dialog @close="emit('close')">
        <div class="check-tools">
            <Segmented :options="VIEWS" :value="tab" @pick="tab = $event" />
            <span class="check-space" />
            <template v-if="!row.stopped">
                <Btn small bordered data-check-run :disabled="running" @click="emit('run', row)">{{ running ? "Running" : "Run" }}</Btn>
            </template>
        </div>
        <code class="check-command">{{ row.command }}</code>
        <template v-if="row.run_percent !== null && row.run_percent !== undefined">
            <CheckRunBar :percent="row.run_percent" />
        </template>
        <template v-if="failure">
            <p class="check-note">{{ failure }}</p>
        </template>
        <template v-if="tab === 'output'">
            <div class="check-output" data-check-output>
                <OutputLines :lines="shownLines" />
            </div>
        </template>
        <template v-else>
            <template v-if="runs.length">
                <ul class="check-runs" data-check-runs>
                    <template v-for="run in runs" :key="run.run_at">
                        <li>
                            <button type="button" class="check-run-row" @click="showRun(run)">
                                <span :class="['check-verdict', {failing: !run.passed}]">{{ run.passed ? "Passed" : "Failed" }}</span>
                                <span class="check-space" />
                                <TimeAgo :at="run.run_at" />
                            </button>
                        </li>
                    </template>
                </ul>
            </template>
            <template v-else>
                <p class="check-note">No runs yet</p>
            </template>
        </template>
    </Dialog>
</template>

<style scoped>
.check-tools {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.check-space {
    flex: 1;
}

.check-command {
    display: block;
    margin-bottom: 10px;
    overflow-wrap: anywhere;
    color: var(--text-2);
    font-size: 12px;
}

.check-output {
    border-radius: 8px;
    background: #111418;
    color: #d7dce2;
}

.check-output :deep(.output-lines) {
    max-height: 60vh;
    margin: 0;
    padding: 10px 12px;
    font: 12px/1.5 var(--mono, ui-monospace, monospace);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.check-runs {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.check-run-row {
    display: flex;
    width: 100%;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
}

.check-run-row:hover {
    background: var(--hover);
}

.check-verdict {
    color: var(--accent-text);
}

.check-verdict.failing {
    color: var(--danger);
}

.check-note {
    margin: 0;
    color: var(--text-3);
}
</style>
