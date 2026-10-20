<script setup>
import {computed} from "vue";
import AgentInspector from "../agents/AgentInspector.vue";
import {useScope} from "../composables/scope.js";
import {ending} from "../domain/agentState.js";
import {isWorking, stateAt, workerLine, workerName, workerReport, workerState} from "../domain/workers.js";
import {seconds} from "../domain/row.js";
import {route} from "../route.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const {env, api} = useScope();
const environment = computed(() => env || route.value.env);

const ENDED = {reported: "returned", finished: "stopped"};

// The worker's own conversation, read from its transcript: the inspector asks it as it asks an agent's.
const transcripts = {env: () => api.env(), transcript: (_agent, _session, fields) => api.workerTranscript(props.resource.id, fields)};

const info = computed(() => {
    const row = props.resource;
    return {
        kind: "Worker",
        name: workerName(row),
        state: isWorking(row) ? {key: "working", word: "Working", dot: "running"} : {key: "idle", ...ending(ENDED[workerState(row)], stateAt(row))},
        facts: [workerLine(row), `worker ${row.id}`, row.worktree ? "in a worktree of its own" : "in the project", environment.value].filter(Boolean),
        brief: {text: row.brief, at: seconds(row.created_at)},
        report: workerReport(row) ? {text: workerReport(row)} : null,
        actions: [],
    };
});
</script>

<template>
    <AgentInspector :key="`worker:${resource.id}`" kind="worker" :info="info" :env="env" :transcripts="transcripts" @close="emit('close')" />
</template>
