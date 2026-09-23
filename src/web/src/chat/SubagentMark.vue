<script setup>
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import {peek} from "../route.js";

const props = defineProps({
    task: {type: String, required: true},
    kind: {type: String, default: ""},
    model: {type: String, default: ""},
    finished: {type: Boolean, default: false},
    agent: {type: Number, default: 0},
    session: {type: String, default: ""},
    at: {type: Number, required: true},
});

const open = () => peek("agent", props.agent, 0, props.session);
const name = computed(() => [props.kind || "subagent", props.model].filter(Boolean).join(" · "));
</script>

<template>
    <template v-if="session">
        <ChatMark icon="agents" color="#e2c55c" :label="finished ? 'Subagent finished' : 'Dispatched'" :name="name" :at="at" :detail="task" title="Open the subagent" @click="open" />
    </template>
    <template v-else>
        <ChatMark icon="agents" color="#e2c55c" :label="finished ? 'Subagent finished' : 'Dispatched'" :name="name" :at="at" :detail="task" />
    </template>
</template>
