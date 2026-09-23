<script setup>
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";

const props = defineProps({
    task: {type: String, required: true},
    kind: {type: String, default: ""},
    model: {type: String, default: ""},
    finished: {type: Boolean, default: false},
    at: {type: Number, required: true},
});

const name = computed(() => [props.kind || "subagent", props.model].filter(Boolean).join(" · "));
</script>

<template>
    <ChatMark icon="agents" :label="finished ? 'Subagent finished' : 'Dispatched'" :name="name" :at="at" :detail="task" />
</template>
