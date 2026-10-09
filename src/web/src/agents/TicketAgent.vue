<script setup>
import {computed, ref} from "vue";
import {useEscape} from "../composables/windowEvent.js";
import {api} from "../api/client.js";
import Dialog from "../kit/Dialog.vue";
import {agentState, ticketOf} from "../domain/ticketAgents.js";
import {helperLine, helperName, helperReport, helperState} from "../domain/helpers.js";
import {href, route} from "../route.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import AgentInspector from "./AgentInspector.vue";

const props = defineProps({
    card: {type: Object, required: true},
    env: {type: String, default: ""},
    kind: {type: String, default: "ticket"},
    label: {type: String, default: ""},
    plan: {type: Number, default: 0},
    recorded: {type: Number, default: 0},
});
const emit = defineEmits(["close", "stopped"]);

const open = ref(true);
useEscape(() => (open.value = false));

const ticket = computed(() => (props.env ? null : ticketOf(props.card.n)));
const helper = computed(() => (props.kind === "helper" ? rows("helper").find((row) => row.n === props.card.n) || null : null));
const env = computed(() => props.env || (ticket.value && ticket.value.data.work_environment) || "");
const plan = computed(() => props.plan || (ticket.value && ticket.value.data.plan) || 0);
const name = computed(() => props.label || (helper.value ? helperName(helper.value) : `#${props.card.n}`));

const STOP = {
    key: "stop",
    label: "Stop its agent",
    title: "It stops at once. Its chat, commits and files stay here.",
    danger: true,
    confirm: {
        text: "Stop this agent now? It stops in the middle of what it is doing. Its chat, its commits and its files stay here.",
        button: "Stop now",
        cancel: "Keep it running",
    },
};
const HELPER_STATES = {
    running: {key: "working", word: "Working", dot: "running"},
    working: {key: "working", word: "Working", dot: "running"},
    needs: {key: "working", word: "Needs you", dot: "running"},
    reported: {key: "reported", word: "Report ready", dot: "done"},
    idle: {key: "idle", word: "Waiting for work", dot: "idle"},
    stopped: {key: "idle", word: "Closed, can take more work", dot: "done"},
    ended: {key: "idle", word: "Closed, can take more work", dot: "done"},
    finished: {key: "idle", word: "Retired", dot: "done"},
};
const filed = computed(() => {
    const there = env.value && env.value !== route.value.env;
    const reports = (there ? store.elsewhere[`${env.value}:report`] : rows("report")) || [];
    return [...reports].filter((r) => !r.deleted).sort((a, b) => b.created - a.created)[0] || null;
});
const reportLink = computed(() =>
    filed.value ? {href: href.page(env.value || route.value.env, "report", filed.value.n), label: `Open report ${filed.value.n}`} : {}
);
const state = computed(() => (helper.value ? HELPER_STATES[helperState(helper.value)] : agentState(props.card)));
const kicker = computed(() => ({plan: "Plan agent", helper: "Helper"})[props.kind] || "Ticket agent");
const actions = computed(() => {
    if (!helper.value) return state.value.key === "stopped" ? [] : [STOP];
    const phase = helperState(helper.value);
    return phase === "running" ? [STOP] : [];
});
const info = computed(() => ({
    kind: kicker.value,
    name: name.value,
    title: props.card.title,
    state: state.value,
    facts: [
        ...(helper.value ? [helperLine(helper.value) || "its model"] : []),
        ...(props.card.reason ? [props.card.reason] : []),
        env.value || "its environment",
    ],
    brief: helper.value && helper.value.brief ? {text: helper.value.brief, at: helper.value.created} : null,
    report: helper.value && helperReport(helper.value) ? {text: helperReport(helper.value), ...reportLink.value} : null,
    actions: actions.value,
}));

async function run() {
    if (helper.value) await api.act("helper", helper.value.n, "stop");
    else await api.stopTicket(props.card.n);
    emit("stopped");
}
</script>

<template>
    <Dialog large bare :open="open" :title="`${kicker} ${name}`" @dismiss="open = false" @close="emit('close')">
        <template v-if="env">
            <AgentInspector
                :key="env"
                :kind="kind"
                :info="info"
                :env="env"
                :plan="plan"
                :chat-session="card.session"
                :run="run"
                :recorded="recorded"
                @close="open = false"
            />
        </template>
    </Dialog>
</template>
