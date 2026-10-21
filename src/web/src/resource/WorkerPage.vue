<script setup>
import {computed} from "vue";
import AgentInspector from "../agents/AgentInspector.vue";
import {useScope} from "../composables/scope.js";
import {ending} from "../domain/agentState.js";
import {isWorking, stateAt, WORKER_WORDS, workerActions, workerEnding, workerLine, workerName, workerReport, workerReuses, workerState} from "../domain/workers.js";
import {seconds} from "../domain/row.js";
import {ago} from "../format/time.js";
import {route} from "../route.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const {env, api} = useScope();
const environment = computed(() => env || route.value.env);

const ACTIONS = {
    send: (id, brief) => api.act("workers", id, "send", {brief}),
    stop: (id) => api.act("workers", id, "stop"),
    complete: (id) => api.act("workers", id, "complete"),
};

function standing(row) {
    if (isWorking(row)) return {key: "working", word: WORKER_WORDS.running, dot: "running"};
    if (workerState(row) === "reported") return {key: "idle", word: WORKER_WORDS.reported, dot: "reported"};
    return {key: "idle", ...ending("stopped", stateAt(row)), word: `${workerEnding(row)} ${ago(stateAt(row))}`};
}

// The worker's own conversation, read from its transcript: the inspector asks it as it asks an agent's.
const transcripts = {env: () => api.env(), transcript: (_agent, _session, fields) => api.workerTranscript(props.resource.id, fields)};

const info = computed(() => {
    const row = props.resource;
    return {
        kind: "Worker",
        name: workerName(row),
        state: standing(row),
        facts: [workerLine(row), `worker ${row.id}`, row.worktree ? "in a worktree of its own" : "in the project", environment.value, workerReuses(row), row.retire_reason && `Why it was retired: ${row.retire_reason}`].filter(Boolean),
        brief: {text: row.brief, at: seconds(row.created_at)},
        report: workerReport(row) ? {text: workerReport(row)} : null,
        actions: workerActions(row),
    };
});
</script>

<template>
    <AgentInspector
        :key="`worker:${resource.id}`"
        kind="worker"
        :info="info"
        :env="env"
        :transcripts="transcripts"
        :run="(key, answer) => ACTIONS[key](resource.id, answer)"
        @close="emit('close')"
    />
</template>
