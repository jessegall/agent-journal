<script setup>
import {computed} from "vue";
import {TextDisplay} from "@journal/window-kit";
import {progress} from "./sequenceWords.js";

// the steps of a sequence in order, each with what it lets the agent do, and while it runs a bar of how far the run is and a quiet badge on each step it has done or is on
const props = defineProps({sequence: {type: Object, required: true}, runs: {type: Array, required: true}});
const guards = computed(() => JSON.parse(props.sequence.step_guards || "[]"));
const guardOf = (index) => guards.value[index] ?? {file_edits_allowed: true, allowed_commands: []};
const guardWords = (index) => [guardOf(index).file_edits_allowed ? "File edits allowed" : "File edits wait", ...guardOf(index).allowed_commands].join(", ");
const furthest = computed(() => (props.runs.length ? progress(props.runs.reduce((far, run) => (run.step_number > far.step_number ? run : far))) : null));
const reached = computed(() => (props.runs.length ? Math.min(...props.runs.map((run) => run.step_number)) : 0));
const stateOf = (index) => {
    if (props.runs.some((run) => run.step_number === index + 1)) return "In progress";
    return props.runs.length && index + 1 < reached.value ? "Done" : "";
};
</script>

<template>
    <section class="sequence-steps" data-sequence-steps>
        <template v-if="furthest">
            <div class="progress" data-step-progress>
                <span class="bar" role="progressbar" :aria-valuenow="furthest.done" aria-valuemin="0" :aria-valuemax="furthest.total"><i :style="{width: `${(furthest.done / furthest.total) * 100}%`}" /></span>
                <span class="progress-words">{{ furthest.done }} of {{ furthest.total }} done</span>
            </div>
        </template>
        <ol class="steps">
            <template v-for="(step, index) in sequence.steps" :key="index">
                <li class="step" data-step>
                    <span class="step-number">{{ index + 1 }}</span>
                    <div class="step-body">
                        <TextDisplay class="step-text" :text="step" />
                        <span class="step-guard" data-step-guard>{{ guardWords(index) }}</span>
                    </div>
                    <template v-if="stateOf(index)">
                        <span class="badge-quiet" data-step-state>{{ stateOf(index) }}</span>
                    </template>
                </li>
            </template>
        </ol>
    </section>
</template>

<style scoped>
.progress {
    display: flex;
    align-items: center;
    gap: var(--s3);
    margin: 4px 0 14px;
}

.bar {
    flex: 1;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--border-2);
}

.bar i {
    display: block;
    height: 100%;
    background: var(--accent);
}

.progress-words {
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.steps {
    margin: 0;
    padding: 0;
    list-style: none;
}

.step {
    display: flex;
    align-items: flex-start;
    gap: var(--s3);
    padding: 8px 0;
    border-bottom: 1px solid var(--border-inner);
}

.step-number {
    flex: none;
    width: 18px;
    color: var(--text-3);
    font-size: 12px;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.step-body {
    flex: 1;
    min-width: 0;
}

.step-text {
    color: var(--text-2);
}

.step-guard {
    display: block;
    color: var(--text-3);
    font-size: 12px;
}
</style>
