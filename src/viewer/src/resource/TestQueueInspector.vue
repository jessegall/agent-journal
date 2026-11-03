<script setup>
import {computed, ref} from "vue";
import {usePoll} from "../../kit/usePoll.js";
import {peek} from "../route.js";
import BackButton from "../kit/BackButton.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import Skeleton from "../kit/Skeleton.vue";

// what the journal's test queue holds and what it ran lately: each test of a proof with the worker that made the proof, its task, its state and the output of its run
const WAITING = new Set(["queued", "running"]);
const RECENT_COUNT = 10;
const PROOF_LIMIT = 50;
const props = defineProps({read: {type: Function, required: true}, backed: Boolean});
const emit = defineEmits(["close", "back"]);
const proofs = ref([]);
const workers = ref({});
const failure = ref("");
const loaded = ref(false);

async function load() {
    const [listed, worktrees] = await Promise.all([props.read(["proof", "list", "--limit", String(PROOF_LIMIT)]), props.read(["worker-worktree", "list"])]);
    failure.value = listed.ok ? "" : listed.error;
    loaded.value = true;
    if (!listed.ok) return;
    proofs.value = listed.value.rows;
    workers.value = Object.fromEntries((worktrees.ok ? worktrees.value.rows : []).map((worktree) => [worktree.id, worktree.agent_id]));
}

const byRecency = (one, other) => String(other.updated_at ?? "").localeCompare(String(one.updated_at ?? "")) || other.id - one.id;
const queued = computed(() => proofs.value.filter((proof) => WAITING.has(proof.state)).sort((one, other) => one.id - other.id));
const recent = computed(() => proofs.value.filter((proof) => !WAITING.has(proof.state) && proof.process_id).sort(byRecency).slice(0, RECENT_COUNT));
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
                <p class="label">In the queue <span>{{ queued.length }}</span></p>
                <template v-for="proof in queued" :key="proof.id">
                    <div class="run" data-queue-row="queued">
                        <button v-if="workerOf(proof)" type="button" class="link" data-queue-worker @click="peek('agents', workerOf(proof))">Worker {{ workerOf(proof) }}</button>
                        <button type="button" class="link" data-queue-task @click="peek('tasks', proof.task_id)">Task {{ proof.task_id }}</button>
                        <span class="state" data-queue-state>{{ proof.state }}</span>
                        <button v-if="proof.process_id" type="button" class="link" data-queue-output @click="peek('processes', proof.process_id)">Output {{ proof.process_id }}</button>
                        <span class="command">{{ proof.test_command }}</span>
                    </div>
                </template>
                <template v-if="!queued.length">
                    <p class="note" data-queue-empty>No test waits.</p>
                </template>
                <p class="label">Ran recently <span>{{ recent.length }}</span></p>
                <template v-for="proof in recent" :key="proof.id">
                    <div class="run" data-queue-row="recent">
                        <button v-if="workerOf(proof)" type="button" class="link" data-queue-worker @click="peek('agents', workerOf(proof))">Worker {{ workerOf(proof) }}</button>
                        <button type="button" class="link" data-queue-task @click="peek('tasks', proof.task_id)">Task {{ proof.task_id }}</button>
                        <span class="state" data-queue-state>{{ proof.state }}</span>
                        <button type="button" class="link" data-queue-output @click="peek('processes', proof.process_id)">Output {{ proof.process_id }}</button>
                        <span class="command">{{ proof.test_command }}</span>
                    </div>
                </template>
                <template v-if="!recent.length">
                    <p class="note">Nothing ran yet.</p>
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
    margin: 16px 0 6px;
    color: var(--text-3);
    font-size: 11.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.run {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    align-items: baseline;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
    font-size: 12.5px;
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
    color: var(--text-3);
}

.command {
    flex-basis: 100%;
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
