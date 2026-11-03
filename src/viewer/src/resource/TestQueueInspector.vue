<script setup>
import {computed, ref} from "vue";
import {usePoll} from "../../kit/usePoll.js";
import {peek} from "../route.js";
import BackButton from "../kit/BackButton.vue";
import CloseButton from "../kit/CloseButton.vue";
import FoldSign from "../kit/FoldSign.vue";
import Icon from "../kit/Icon.vue";
import Skeleton from "../kit/Skeleton.vue";

// what the journal's test queue holds and what it ran lately: each test of a proof with the worker that made the proof, its task, its state and the output of its run
const WAITING = new Set(["queued", "running"]);
// what a row says of its proof: the test waits, runs, passed or failed; a passed test is not a checked proof, which the main agent decides
const STATES = {queued: "Waiting", running: "Running", checked: "Passed", short: "Failed"};
const RECENT_COUNT = 10;
const PROOF_LIMIT = 50;
const props = defineProps({read: {type: Function, required: true}, backed: Boolean});
const emit = defineEmits(["close", "back"]);
const proofs = ref([]);
const workers = ref({});
const failure = ref("");
const loaded = ref(false);
// the output of each run the person opened, by process, kept in place under its row
const outputs = ref({});

async function loadOutput(processId) {
    const answer = await props.read(["output", "peek", String(processId), "--all"]);
    outputs.value = {...outputs.value, [processId]: answer.ok ? answer.value.lines : [answer.error]};
}

async function toggleOutput(processId) {
    if (processId in outputs.value) {
        const {[processId]: closed, ...rest} = outputs.value;
        outputs.value = rest;
        return;
    }
    await loadOutput(processId);
}

async function load() {
    const [listed, worktrees] = await Promise.all([props.read(["proof", "list", "--limit", String(PROOF_LIMIT)]), props.read(["worker-worktree", "list"])]);
    failure.value = listed.ok ? "" : listed.error;
    loaded.value = true;
    if (!listed.ok) return;
    proofs.value = listed.value.rows;
    workers.value = Object.fromEntries((worktrees.ok ? worktrees.value.rows : []).map((worktree) => [worktree.id, worktree.agent_id]));
    await Promise.all(Object.keys(outputs.value).map(loadOutput));
}

const byRecency = (one, other) => String(other.updated_at ?? "").localeCompare(String(one.updated_at ?? "")) || other.id - one.id;
const queued = computed(() => proofs.value.filter((proof) => WAITING.has(proof.state)).sort((one, other) => one.id - other.id));
const recent = computed(() => proofs.value.filter((proof) => !WAITING.has(proof.state) && proof.process_id).sort(byRecency).slice(0, RECENT_COUNT));
const sections = computed(() => [
    {kind: "queued", heading: "Queue", proofs: queued.value, empty: "No test waits."},
    {kind: "recent", heading: "Recent", proofs: recent.value, empty: "Nothing ran yet."},
]);
const workerOf = (proof) => workers.value[proof.worktree_id] ?? null;
usePoll(load, () => true);
</script>

<template>
    <article class="test-queue" data-test-queue>
        <header class="top">
            <template v-if="backed">
                <BackButton @back="emit('back')" />
            </template>
            <span class="kind"><Icon name="check" :size="13" /> Test queue</span>
            <span class="grow" />
            <CloseButton title="Close the test queue" data-resource-close @click="emit('close')" />
        </header>
        <div class="scroll">
            <template v-if="failure">
                <p class="failure" role="alert" data-resource-failure>{{ failure }}</p>
            </template>
            <template v-else-if="!loaded">
                <Skeleton />
            </template>
            <template v-else>
                <template v-for="section in sections" :key="section.kind">
                    <p class="label" :data-queue-heading="section.kind">{{ section.heading }} <span>{{ section.proofs.length }}</span></p>
                    <template v-for="proof in section.proofs" :key="proof.id">
                        <div class="run" :data-queue-row="section.kind">
                            <div class="run-head">
                                <span :class="['state', proof.state]" data-queue-state>{{ STATES[proof.state] ?? proof.state }}</span>
                                <template v-if="workerOf(proof)">
                                    <button type="button" class="link" data-queue-worker @click="peek('agents', workerOf(proof))">Worker {{ workerOf(proof) }}</button>
                                </template>
                                <button type="button" class="link" data-queue-task @click="peek('tasks', proof.task_id)">Task {{ proof.task_id }}</button>
                                <span class="grow" />
                                <template v-if="proof.process_id">
                                    <button type="button" class="link" data-queue-open title="Open the output in its own window" @click="peek('processes', proof.process_id)">Open</button>
                                    <button type="button" class="output-toggle" data-queue-output :aria-expanded="proof.process_id in outputs" @click="toggleOutput(proof.process_id)">Output {{ proof.process_id }} <FoldSign :open="proof.process_id in outputs" /></button>
                                </template>
                            </div>
                            <span class="command">{{ proof.test_command }}</span>
                            <template v-if="proof.process_id in outputs">
                                <pre class="output" data-queue-output-body>{{ outputs[proof.process_id].join("\n") }}</pre>
                            </template>
                        </div>
                    </template>
                    <template v-if="!section.proofs.length">
                        <p class="note" :data-queue-empty="section.kind === 'queued' ? '' : undefined">{{ section.empty }}</p>
                    </template>
                </template>
            </template>
        </div>
    </article>
</template>

<style scoped>
.test-queue {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.top {
    display: flex;
    flex: none;
    align-items: center;
    gap: 12px;
    padding: 14px 12px 8px 24px;
    color: var(--text-3);
    font-size: 11.5px;
}

.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
    font-size: 12px;
}

.grow {
    flex: 1;
}

.scroll {
    flex: 1;
    overflow: auto;
    padding: 0 24px 28px;
    scrollbar-width: thin;
}

.label {
    margin: 18px 0 8px;
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.label span {
    margin-left: 4px;
    color: var(--text-4);
    font-weight: 400;
}

.run {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    font-size: 12.5px;
}

.run-head {
    display: flex;
    gap: 12px;
    align-items: center;
}

.output-toggle {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}

.output-toggle:hover {
    color: var(--text);
}

.output {
    max-height: 240px;
    margin: 0;
    padding: 8px 10px;
    overflow: auto;
    border-radius: 8px;
    background: var(--code-bg);
    color: var(--text-2);
    font-family: var(--mono, monospace);
    font-size: 11.5px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    scrollbar-width: thin;
}

.link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}

.link:hover {
    color: var(--text);
}

.state {
    padding: 1px 9px;
    border-radius: 9px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 11.5px;
    line-height: 1.5;
}

.state.running {
    background: var(--accent-dim);
    color: var(--accent-text);
}

.state.checked {
    background: color-mix(in srgb, var(--tone-good) 18%, transparent);
    color: var(--tone-good);
}

.state.short {
    background: color-mix(in srgb, var(--tone-bad) 18%, transparent);
    color: var(--tone-bad);
}

.command {
    color: var(--text-3);
    font-family: var(--mono, monospace);
    font-size: 11.5px;
    overflow-wrap: anywhere;
}

.note,
.failure {
    margin: 6px 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.failure {
    color: var(--danger);
}
</style>
