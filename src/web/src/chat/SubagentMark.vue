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
    report: {type: Number, default: 0},
    agent: {type: Number, default: 0},
    session: {type: String, default: ""},
    at: {type: Number, required: true},
});

const open = () => (props.report ? peek("report", props.report) : peek("agent", props.agent, 0, props.session));
const label = computed(() => (!props.finished ? "Dispatched" : props.stopped ? "Subagent stopped" : "Subagent finished"));
const detail = computed(() => (props.report ? `${props.task} · report ${props.report}` : props.task));
const hover = computed(() => (props.report ? `Open report ${props.report}, which it left` : "Open the subagent"));
const name = computed(() => [props.kind || "subagent", props.model].filter(Boolean).join(" · "));
</script>

<template>
    <template v-if="session || report">
        <ChatMark icon="agents" :color="stopped ? '' : '#e2c55c'" :tone="stopped ? 'warn' : ''" :label="label" :name="name" :at="at" :detail="detail" :title="hover" @click="open" />
    </template>
    <template v-else>
        <ChatMark icon="agents" color="#e2c55c" :label="label" :name="name" :at="at" :detail="detail" />
    </template>
</template>
