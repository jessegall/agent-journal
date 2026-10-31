<script setup>
import {computed, reactive} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {rows} from "../sync/rows.js";
import SequenceTriggers from "./SequenceTriggers.vue";
import StepCards from "./StepCards.vue";
import {stepBody, stepCard, stepGuards, stepHeading, stepsProblem} from "../domain/sequenceSteps.js";

const props = defineProps({resource: {type: Object, required: true}});
const steps = computed(() => props.resource.steps || []);
const inHand = computed(() => new Set(rows("agents").filter((a) => a.sequence?.sequence_id === props.resource.id).map((a) => a.sequence.step)));

const draft = reactive({open: false, steps: [], error: "", busy: false});
const problem = computed(() => stepsProblem(draft.steps));

function edit() {
    Object.assign(draft, {open: true, steps: steps.value.map((step, i) => stepCard(step, i)), error: "", busy: false});
}

async function save() {
    if (problem.value) return;
    draft.busy = true;
    draft.error = "";
    try {
        await api.setSteps(props.resource.id, draft.steps.map(stepBody));
        draft.open = false;
    } catch (e) {
        draft.error = e.message;
    } finally {
        draft.busy = false;
    }
}
</script>

<template>
    <section class="sequence-steps">
        <header class="steps-head">
            <span class="steps-title">Steps</span>
            <span class="steps-count">{{ draft.open ? draft.steps.length : steps.length }}</span>
            <span class="grow" />
            <template v-if="resource.locked">
                <span class="locked" title="This sequence comes with the journal and cannot be changed or deleted">
                    <Icon name="lock" :size="12" />
                    Locked, comes with the journal
                </span>
            </template>
            <template v-else-if="!draft.open">
                <Btn small @click="edit">
                    <Icon name="pencil" :size="12" />
                    Edit steps
                </Btn>
            </template>
        </header>
        <template v-if="!draft.open">
            <ol class="track">
                <li class="stop start">
                    <span class="node">
                        <Icon name="bolt" :size="11" />
                    </span>
                    <div class="stop-body">
                        <span class="stop-title">Starts</span>
                        <SequenceTriggers :resource="resource" />
                    </div>
                </li>
                <template v-for="(step, i) in steps" :key="`${i}-${step.instructions}`">
                    <li :class="['stop', {now: inHand.has(i + 1)}]">
                        <span class="node">{{ i + 1 }}</span>
                        <div class="stop-body">
                            <span class="stop-title">
                                {{ stepHeading(step) }}
                                <template v-if="inHand.has(i + 1)">
                                    <span class="now-label">In progress</span>
                                </template>
                            </span>
                            <TextDisplay class="stop-text" :text="step.instructions" />
                            <span class="guards">
                                <template v-for="guard in stepGuards(step)" :key="guard">
                                    <span class="guard">{{ guard }}</span>
                                </template>
                            </span>
                        </div>
                    </li>
                </template>
                <template v-if="!steps.length">
                    <li class="stop">
                        <span class="node empty" />
                        <p class="none">No steps yet.</p>
                    </li>
                </template>
                <li class="stop end">
                    <span class="node" />
                    <span class="end-label">Done</span>
                </li>
            </ol>
        </template>
        <template v-else>
            <StepCards :cards="draft.steps" />
            <div class="editor-foot">
                <Btn kind="primary" small :busy="draft.busy" :disabled="!!problem" @click="save">Save steps</Btn>
                <Btn small @click="draft.open = false">Cancel</Btn>
                <template v-if="draft.error || problem">
                    <span class="editor-note">{{ draft.error || problem }}</span>
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>
.locked {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.sequence-steps {
    margin-top: 24px;
}

.steps-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}

.steps-title {
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.steps-count {
    padding: 0 6px;
    border-radius: 99px;
    background: var(--hover);
    color: var(--text-3);
    font-size: 11px;
    line-height: 17px;
    font-variant-numeric: tabular-nums;
}

.grow {
    flex: 1;
}

.steps-locked {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-3);
    font-size: 11.5px;
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
    padding-bottom: 22px;
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
    flex: none;
    display: inline-grid;
    place-items: center;
    width: var(--node, 24px);
    height: var(--node, 24px);
    box-sizing: border-box;
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
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 22%, transparent);
}

.stop.end .node {
    --node: 12px;

    width: 12px;
    height: 12px;
    margin: 0 6px;
    background: var(--border-2);
}

.node.empty {
    border-style: dashed;
}

.stop-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    padding-top: 2px;
}

.stop-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
}

.stop.start .stop-title {
    color: var(--accent-text);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.stop-from {
    align-self: flex-start;
    margin-top: 2px;
    color: var(--text-3);
}

.now-label {
    padding: 0 7px;
    border-radius: 99px;
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--accent-text);
    font-size: 10.5px;
    font-weight: 500;
    line-height: 17px;
}

.stop-text {
    color: var(--text-2);
}

.end-label,
.none {
    margin: 0;
    color: var(--text-4);
    font-size: 12px;
}
.guards {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.guard {
    padding: 0 7px;
    border-radius: 99px;
    background: var(--hover);
    color: var(--text-3);
    font-size: 11px;
    line-height: 18px;
}

.editor-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
}

.editor-note {
    color: var(--text-3);
    font-size: 12px;
}

</style>
