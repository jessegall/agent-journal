<script setup>
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import {peek} from "../route.js";
import {actionLabel} from "../domain/markAction.js";

const props = defineProps({
    task: {type: String, required: true},
    kind: {type: String, default: ""},
    model: {type: String, default: ""},
    finished: {type: Boolean, default: false},
    stopped: {type: Boolean, default: false},
    failed: {type: Boolean, default: false},
    unfinished: {type: Boolean, default: false},
    reason: {type: String, default: ""},
    returned: {type: String, default: ""},
    refusal: {type: String, default: ""},
    report: {type: Number, default: 0},
    agent: {type: Number, default: 0},
    session: {type: String, default: ""},
    time: {type: Number, required: true},
});

const open = () => peek("agents", props.agent, 0, props.session);
const label = computed(() => {
    if (props.refusal) return "Dispatch stopped";
    if (props.failed) return "Dispatch failed";
    if (props.unfinished) return "Subagent could not do it";
    if (!props.finished) return "Dispatched";
    return props.stopped ? "Subagent stopped" : "Subagent finished";
});
const tone = computed(() => {
    if (props.refusal || props.failed) return "danger";
    if (props.stopped || props.unfinished) return "warn";
    return props.finished ? "good" : "work";
});
const detail = computed(() => {
    if (props.refusal) return `${props.task}: ${props.refusal}`;
    return props.failed || props.unfinished ? `${props.task}: ${props.reason || "the tool gave no reason"}` : props.task;
});
const card = computed(() => (props.report ? `report ${props.report}` : ""));
const name = computed(() => [props.kind || "subagent", props.model].filter(Boolean).join(" · "));
const mark = computed(() => ({
    icon: "agents",
    group: "agent",
    active: !props.finished,
    markIcon: "subagent",
    tone: tone.value,
    label: label.value,
    name: name.value,
    time: props.time,
    detail: detail.value,
    // a subagent that came back opens to the whole text it returned, as a message's mark opens to its words
    body: props.finished ? props.returned : "",
    bodyLabel: "What it returned",
}));
const openable = computed(() => ({...mark.value, title: "Open the subagent", action: actionLabel("agents")}));
const reported = computed(() => ({...mark.value, card: card.value}));
const reportedOpenable = computed(() => ({...reported.value, title: "Open the subagent", action: actionLabel("agents")}));
</script>

<template>
    <template v-if="session">
        <ChatMark :mark="report ? reportedOpenable : openable" @act="open" />
    </template>
    <template v-else>
        <ChatMark :mark="reported" />
    </template>
</template>
