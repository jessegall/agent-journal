<script setup>
import {computed, nextTick, reactive, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import TextInput from "../kit/TextInput.vue";
import {route} from "../route.js";
import StartsOn from "./StartsOn.vue";

const props = defineProps({resource: {type: Object, required: true}});
const steps = computed(() => props.resource.sections || []);
const own = computed(() => !props.resource.data.system && !props.resource.completed);
const inHand = computed(
    () =>
        new Set(
            Object.entries(props.resource.data.runs || {})
                .filter(([key]) => key.split("|")[0] === route.value.env)
                .map(([, run]) => run.step)
        )
);

const draft = reactive({open: false, steps: [], error: "", busy: false});
const titles = ref([]);
let made = 0;
const card = (step) => ({key: ++made, title: step.title, body: step.body || ""});
const trimmed = computed(() => draft.steps.map((s) => s.title.trim()));
const problem = computed(() => {
    if (!draft.steps.length) return "A sequence needs at least one step.";
    if (trimmed.value.some((t) => !t)) return "Every step needs a title.";
    if (new Set(trimmed.value).size !== trimmed.value.length) return "Two steps share a title; give each its own.";
    return "";
});

function edit() {
    Object.assign(draft, {open: true, steps: steps.value.map(card), error: "", busy: false});
}

async function add() {
    draft.steps.push(card({title: "", body: ""}));
    await nextTick();
    titles.value.at(-1)?.focus();
}

function move(i, by) {
    const [step] = draft.steps.splice(i, 1);
    draft.steps.splice(i + by, 0, step);
}

async function save() {
    if (problem.value) return;
    draft.busy = true;
    draft.error = "";
    try {
        const given = draft.steps.map((s, i) => ({title: trimmed.value[i], body: s.body}));
        await api.act("sequence", props.resource.n, "steps", {steps: given});
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
            <template v-if="resource.data.system">
                <span class="steps-locked" title="This sequence ships with the journal and can't be changed">
                    <Icon name="lock" :size="11" />
                    Read-only
                </span>
            </template>
            <template v-else-if="own && !draft.open">
                <Btn small @click="edit">
                    <Icon name="pencil" :size="12" />
                    Edit steps
                </Btn>
            </template>
        </header>
        <template v-if="!draft.open">
            <ol class="track">
                <template v-if="!resource.completed">
                    <li class="stop start">
                        <span class="node">
                            <Icon name="bolt" :size="11" />
                        </span>
                        <div class="stop-body">
                            <span class="stop-title">Starts</span>
                            <StartsOn :resource="resource" bare />
                        </div>
                    </li>
                </template>
                <template v-for="(s, i) in steps" :key="s.title">
                    <li :class="['stop', {now: inHand.has(i + 1)}]">
                        <span class="node">{{ i + 1 }}</span>
                        <div class="stop-body">
                            <span class="stop-title">
                                {{ s.title }}
                                <template v-if="inHand.has(i + 1)">
                                    <span class="now-label">In hand</span>
                                </template>
                            </span>
                            <template v-if="s.body">
                                <TextDisplay class="stop-text" :text="s.body" />
                            </template>
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
            <TransitionGroup tag="ol" name="step" class="editor">
                <template v-for="(s, i) in draft.steps" :key="s.key">
                    <li class="step-card">
                        <div class="step-row">
                            <span class="node">{{ i + 1 }}</span>
                            <TextInput
                                ref="titles"
                                :value="s.title"
                                class="step-title-input"
                                maxlength="80"
                                placeholder="Step title"
                                @input="s.title = $event.target.value"
                                @keydown.enter.prevent
                            />
                            <span class="step-tools">
                                <button type="button" class="step-tool" title="Move up" :disabled="i === 0" @click="move(i, -1)">
                                    <Icon name="up" :size="12" />
                                </button>
                                <button
                                    type="button"
                                    class="step-tool"
                                    title="Move down"
                                    :disabled="i === draft.steps.length - 1"
                                    @click="move(i, 1)"
                                >
                                    <Icon name="down" :size="12" />
                                </button>
                                <button type="button" class="step-tool" title="Remove this step" @click="draft.steps.splice(i, 1)">
                                    <Icon name="close" :size="12" />
                                </button>
                            </span>
                        </div>
                        <textarea v-model="s.body" rows="4" placeholder="What to do in this step. Markdown works here." />
                    </li>
                </template>
            </TransitionGroup>
            <button type="button" class="add-step" @click="add">
                <Icon name="plus" :size="12" />
                Add a step
            </button>
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

.track,
.editor {
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

.editor {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.step-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 10px 10px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.step-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.step-title-input {
    flex: 1;
    min-width: 0;
    font-weight: 600;
}

.step-tools {
    display: flex;
    gap: 2px;
}

.step-tool {
    display: inline-grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.step-tool:hover:enabled {
    background: var(--hover);
    color: var(--text);
}

.step-tool:disabled {
    opacity: 0.35;
    cursor: default;
}

textarea {
    width: 100%;
    box-sizing: border-box;
    min-height: 76px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
}

textarea:focus {
    border-color: var(--accent);
    outline: none;
}

.add-step {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    margin-top: 10px;
    padding: 9px;
    border: 1px dashed var(--border-2);
    border-radius: 10px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.add-step:hover {
    border-color: var(--accent);
    color: var(--accent-text);
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

.step-move {
    transition: transform 0.2s var(--ease, ease);
}

.step-enter-active,
.step-leave-active {
    transition:
        opacity 0.18s ease,
        transform 0.18s ease;
}

.step-enter-from,
.step-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
