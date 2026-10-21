<script setup>
import {subagentsOf} from "../domain/subagents.js";
import {computed} from "vue";
import AgentInspector from "../agents/AgentInspector.vue";
import {stopAgentNamed} from "../actions/agents.js";
import {useScope} from "../composables/scope.js";
import {loadedSkills, modelFamily, providerName} from "../domain/agents.js";
import {ending, heldTask} from "../domain/agentState.js";
import {createdAt, updatedAt} from "../domain/row.js";
import {project} from "../state/identity.js";
import {store} from "../state/store.js";
import {span} from "../format/time.js";
import {route, showSession} from "../route.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const {env, api} = useScope();
const environment = computed(() => env || route.value.env);
const subagents = computed(() => subagentsOf(props.resource.id).filter((r) => r.session));
const picked = computed(() => subagents.value.find((r) => r.session === route.value.sub) || null);
const skills = computed(() => loadedSkills(props.resource));
const family = computed(() => modelFamily(props.resource.model));

const STATES = {
    working: {word: "Working", dot: "running"},
    busy: {word: "Working", dot: "running"},
    idle: {word: "Idle", dot: "queued"},
    compacting: {word: "Compacting its context", dot: "running"},
};
const stateKey = computed(() => (props.resource.status in STATES || props.resource.status === "stopped" ? props.resource.status : "busy"));
const task = computed(() => heldTask(store.summary, environment.value)?.title || props.resource.doing || "Waiting: next task");

const facts = computed(() => {
    const a = props.resource;
    return [
        family.value ? `${providerName(a.provider)} · ${family.value}` : providerName(a.provider),
        `agent ${a.id}`,
        `session ${a.session}`,
        environment.value,
        ...(a.branch ? [a.branch] : []),
        `running for ${span(Date.now() / 1000 - createdAt(a))}`,
        ...(a.context === null ? [] : [`context ${Math.round(Number(a.context))}% full`]),
    ];
});

const mainInfo = computed(() => ({
    kind: "Main agent",
    name: project.value,
    title: task.value,
    state: {key: stateKey.value, ...(stateKey.value === "stopped" ? ending("stopped", updatedAt(props.resource)) : STATES[stateKey.value])},
    facts: facts.value,
    counts: {subagents: subagents.value.length, skills: skills.value.length},
    link: null,
    actions:
        stateKey.value === "stopped"
            ? []
            : [
                  {
                      key: "stop",
                      label: "Stop its agent",
                      title: "It stops at once. Its chat, commits and files stay here.",
                      danger: true,
                      confirm: {
                          text: "Stop this agent now? It stops in the middle of what it is doing. Its chat, its commits and its files stay here.",
                          button: "Stop now",
                          cancel: "Keep it running",
                      },
                  },
              ],
}));

const subagentInfo = computed(() => ({
    kind: "Subagent",
    name: picked.value.type || "general",
    back: "Main agent",
    state: picked.value.running
        ? {key: "working", word: "Working", dot: "running"}
        : {key: "idle", ...ending(picked.value.status, picked.value.time)},
    facts: [picked.value.model || "its parent's model", `subagent of agent ${props.resource.id}`, environment.value],
    actions: [],
}));

const ACTIONS = {stop: () => stopAgentNamed(api, environment.value)};
</script>

<template>
    <template v-if="picked">
        <AgentInspector
            :key="picked.session"
            kind="subagent"
            :info="subagentInfo"
            :env="env"
            :agent="resource"
            :session="picked.session"
            :chat-session="picked.session"
            @back="showSession('')"
            @close="emit('close')"
        />
    </template>
    <template v-else>
        <AgentInspector
            key="main"
            kind="main"
            :info="mainInfo"
            :env="env"
            :agent="resource"
            :subagents="subagents"
            :skills="skills"
            :run="(key) => ACTIONS[key]()"
            @open-subagent="showSession"
            @close="emit('close')"
        />
    </template>
</template>
