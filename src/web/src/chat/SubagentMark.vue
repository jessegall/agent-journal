<script setup>
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import {peek} from "../route.js";

const props = defineProps({
    task: {type: String, required: true},
    kind: {type: String, default: ""},
    model: {type: String, default: ""},
    finished: {type: Boolean, default: false},
    stopped: {type: Boolean, default: false},
    refusal: {type: String, default: ""},
    report: {type: Number, default: 0},
    agent: {type: Number, default: 0},
    session: {type: String, default: ""},
    at: {type: Number, required: true},
});

const open = () => peek("agent", props.agent, 0, props.session);
const label = computed(() => {
    if (props.refusal) return "Dispatch stopped";
    if (!props.finished) return "Dispatched";
    return props.stopped ? "Subagent stopped" : "Subagent finished";
});
const tone = computed(() => (props.refusal ? "danger" : props.stopped ? "warn" : ""));
const color = computed(() => (tone.value ? "" : "#e2c55c"));
const detail = computed(() => (props.refusal ? `${props.task}: ${props.refusal}` : props.task));
const card = computed(() => (props.report ? `report ${props.report}` : ""));
const name = computed(() => [props.kind || "subagent", props.model].filter(Boolean).join(" · "));
</script>

<template>
    <template v-if="session && !report">
        <ChatMark
            icon="agents"
            :color="color"
            :tone="tone"
            :label="label"
            :name="name"
            :at="at"
            :detail="detail"
            title="Open the subagent"
            @click="open"
        />
    </template>
    <template v-else>
        <ChatMark icon="agents" :color="color" :tone="tone" :label="label" :name="name" :at="at" :detail="detail" :card="card" />
    </template>
</template>
