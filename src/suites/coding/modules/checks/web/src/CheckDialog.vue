<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, Segmented, ago, useReadLine, useWindow} from "@journal/window-kit";
import CheckRunBar from "./CheckRunBar.vue";

// one check opened: its latest output and its runs, picked at the top, and the button that runs it
const VIEWS = [
    {key: "output", label: "Output"},
    {key: "runs", label: "Runs"},
];
const props = defineProps({row: {type: Object, required: true}, running: Boolean});
const emit = defineEmits(["close", "run"]);
const context = useWindow();
const view = ref("output");
const chosenRun = ref(null);
const {value: history, failure, load: readRuns} = useReadLine(() => `check runs ${props.row.id}`);
const runs = computed(() => history.value?.rows ?? []);
const shownOutput = computed(() => chosenRun.value?.output ?? props.row.last_output);

function showRun(run) {
    chosenRun.value = run;
    view.value = "output";
}

context.follow(["check.*"], readRuns);
readRuns();
</script>

<template>
    <Dialog :title="`Check ${row.id}: ${row.title}`" wide data-check-dialog @close="emit('close')">
        <div class="check-tools">
            <Segmented :options="VIEWS" :value="view" @pick="view = $event" />
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
        <template v-if="view === 'output'">
            <template v-if="shownOutput">
                <pre class="check-output" data-check-output>{{ shownOutput }}</pre>
            </template>
            <template v-else>
                <p class="check-note">No output yet</p>
            </template>
        </template>
        <template v-else>
            <template v-if="runs.length">
                <ul class="check-runs" data-check-runs>
                    <template v-for="run in runs" :key="run.run_at">
                        <li>
                            <button type="button" class="check-run-row" @click="showRun(run)">
                                <span :class="['check-verdict', {failing: !run.passed}]">{{ run.passed ? "Passed" : "Failed" }}</span>
                                <span class="check-space" />
                                <time :title="run.run_at">{{ ago(Date.parse(run.run_at) / 1000) }}</time>
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
    overflow: auto;
    max-height: 50vh;
    margin: 0;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--raised);
    font-size: 12px;
    white-space: pre-wrap;
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
