<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, TextDisplay, useWindow} from "@journal/window-kit";
import StepCards from "./StepCards.vue";

const props = defineProps({sequence: {type: Object, required: true}, runs: {type: Array, required: true}});
const context = useWindow();
const draft = ref(null);
const refusal = ref("");
const inHand = computed(() => new Set(props.runs.map((run) => run.step_number)));
const problem = computed(() => (draft.value?.some((step) => !step.trim()) ? "Every step needs its text." : ""));

async function save() {
    const answer = await context.run(["sequence", "edit", String(props.sequence.id), "--steps", ...draft.value.map((step) => step.trim())]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) draft.value = null;
}
</script>

<template>
    <section class="sequence-steps">
        <header class="steps-head">
            <span class="steps-title">Steps</span>
            <span class="steps-count">{{ (draft || sequence.steps).length }}</span>
            <template v-if="!draft">
                <Btn small data-sequence-edit @click="draft = [...sequence.steps]"><Icon name="pencil" :size="12" /> Edit steps</Btn>
            </template>
        </header>
        <template v-if="!draft">
            <ol class="track">
                <li class="stop start">
                    <span class="node"><Icon name="bolt" :size="11" /></span>
                    <div class="stop-body">
                        <span class="stop-title">Starts</span>
                        <span class="stop-text">Only when you or the agent start it</span>
                    </div>
                </li>
                <template v-for="(step, index) in sequence.steps" :key="index">
                    <li :class="['stop', {now: inHand.has(index + 1)}]">
                        <span class="node">{{ index + 1 }}</span>
                        <div class="stop-body">
                            <TextDisplay class="stop-text" :text="step" />
                            <template v-if="inHand.has(index + 1)">
                                <span class="now-label">In progress</span>
                            </template>
                        </div>
                    </li>
                </template>
                <li class="stop end">
                    <span class="node" />
                    <span class="end-label">Done</span>
                </li>
            </ol>
        </template>
        <template v-else>
            <StepCards :steps="draft" @steps="draft = $event" />
            <div class="editor-foot">
                <Btn kind="primary" small :disabled="Boolean(problem)" data-sequence-save @click="save">Save steps</Btn>
                <Btn small @click="draft = null">Cancel</Btn>
                <span class="editor-note" role="status">{{ refusal || problem }}</span>
            </div>
        </template>
    </section>
</template>

<style scoped>
.steps-head {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 14px;
}

.steps-title {
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
}

.steps-count {
    flex: 1;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.track {
    margin: 0;
    padding: 0;
    list-style: none;
}

.stop {
    --node: 24px;

    position: relative;
    display: flex;
    gap: 14px;
    padding-bottom: 18px;
}

.stop::before {
    content: "";
    position: absolute;
    top: var(--node);
    bottom: 0;
    left: calc(var(--node) / 2 - 0.5px);
    width: 1px;
    background: var(--border-2);
}

.stop.end {
    align-items: center;
    padding-bottom: 0;
}

.stop.end::before {
    display: none;
}

.node {
    display: inline-grid;
    flex: none;
    place-items: center;
    box-sizing: border-box;
    width: var(--node);
    height: var(--node);
    border: 1px solid var(--border-2);
    border-radius: 50%;
    background: var(--bg);
    color: var(--text-2);
    font-size: 11.5px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.stop.start .node {
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    background: color-mix(in srgb, var(--accent) 14%, var(--bg));
    color: var(--accent-text);
}

.stop.now .node {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
}

.stop.end .node {
    --node: 12px;

    margin: 0 6px;
    background: var(--border-2);
}

.stop-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    padding-top: 2px;
}

.stop-title {
    color: var(--accent-text);
    font-size: 12px;
    font-weight: 600;
}

.stop-text {
    color: var(--text-2);
}

.now-label {
    align-self: flex-start;
    padding: 0 7px;
    border-radius: 99px;
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--accent-text);
    font-size: 10.5px;
    font-weight: 500;
    line-height: 17px;
}

.end-label,
.editor-note {
    color: var(--text-3);
    font-size: 12px;
}

.editor-foot {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 12px;
}
</style>
