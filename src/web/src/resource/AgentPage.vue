<script setup>
import {computed} from "vue";
import AgentInspector from "../agents/AgentInspector.vue";
import {stopAgentNamed} from "../actions/agents.js";
import {useAgentLinks} from "../composables/agentLinks.js";
import {usePoll} from "../composables/poll.js";
import {useScope} from "../composables/scope.js";
import {modelFamily, providerName} from "../domain/agents.js";
import {project} from "../state/identity.js";
import {span} from "../format/time.js";
import {route, showSession} from "../route.js";
import {PAGE} from "../sync/rows.js";
import CommentToggle from "./CommentToggle.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const {env, api, rows, recent} = useScope();
const ELSEWHERE_EVERY = 5000;
if (env)
    usePoll(
        `agent-elsewhere:${env}`,
        () => Promise.all(["work", "nudge", "notice", "message"].map((type) => recent(type, PAGE))),
        ELSEWHERE_EVERY
    );
const data = computed(() => props.resource.data);
const environment = computed(() => env || route.value.env);
const subagents = computed(() => (data.value.subagent_rows || []).filter((r) => r.session));
const picked = computed(() => subagents.value.find((r) => r.session === route.value.sub) || null);
const skills = computed(() => (picked.value ? picked.value.skills : data.value.skills) || []);
const links = useAgentLinks(api, () => [props.resource.n, picked.value ? picked.value.session : ""]);
const sessionLink = computed(() => links.value.find((href) => /claude\.ai\/code\/(?!artifact)/.test(href)) || "");
const family = computed(() => modelFamily(data.value.model));
const running = computed(() =>
    rows("work").some((w) => !w.completed && !w.data.agent && (w.data.session === props.resource.title || !w.data.session))
);

const STATES = {
    working: {word: "Working", dot: "running"},
    busy: {word: "Working", dot: "running"},
    idle: {word: "Idle", dot: "queued"},
    compacting: {word: "Summarising its context", dot: "running"},
    stopped: {word: "Stopped", dot: ""},
    paused: {word: "Paused", dot: "queued"},
};
const stateKey = computed(() => {
    const reported = data.value.status;
    if (data.value.paused) return "paused";
    if (["stopped", "idle", "compacting"].includes(reported)) return reported;
    return running.value ? "working" : "busy";
});

const task = computed(() => {
    const open = rows("work").find((w) => !w.completed && !w.data.agent && (w.data.session === props.resource.title || !w.data.session));
    return open ? open.title : "Waiting for its next task";
});

const factsOf = computed(() => {
    const d = data.value;
    return [
        family.value ? `${providerName(d.provider)} · ${family.value}` : providerName(d.provider),
        `agent ${props.resource.n}`,
        `session ${props.resource.title}`,
        environment.value,
        ...(d.branch ? [d.branch] : []),
        d.started ? `running for ${span(Date.now() / 1000 - d.started)}` : "just started",
        `context ${Math.round(Number(d.context || 0))}% full`,
    ];
});

const mainInfo = computed(() => ({
    kind: "Main agent",
    name: project.value,
    title: task.value,
    state: {key: stateKey.value, ...STATES[stateKey.value]},
    facts: factsOf.value,
    counts: {subagents: data.value.subagents || 0, skills: (data.value.skills || []).length},
    link: sessionLink.value ? {href: sessionLink.value, label: "Open its session on claude.ai"} : null,
    actions: [
        data.value.paused
            ? {key: "resume", label: "Resume its agent", title: "It carries on from where it waited."}
            : {key: "pause", label: "Pause its agent", title: "It finishes the step it is on, then waits until you resume it."},
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
    title: picked.value.task,
    back: "Main agent",
    state: picked.value.running
        ? {key: "working", word: "Working", dot: "running"}
        : {
              key: "idle",
              word: picked.value.status ? picked.value.status[0].toUpperCase() + picked.value.status.slice(1) : "Closed",
              dot: "done",
          },
    facts: [picked.value.model || "its parent's model", `subagent of agent ${props.resource.n}`, environment.value],
    actions: [],
}));

const ACTIONS = {
    pause: () => api.pauseAgent(props.resource.title),
    resume: () => api.resumeAgent(props.resource.title),
    stop: () => stopAgentNamed(api, environment.value),
};
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
            :provider="data.provider"
            :run="(key) => ACTIONS[key]()"
            @open-subagent="showSession"
            @close="emit('close')"
        >
            <template #tools>
                <CommentToggle :resource="resource" />
            </template>
        </AgentInspector>
    </template>
</template>
