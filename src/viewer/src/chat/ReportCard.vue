<script setup>
import {computed} from "vue";
import GrowingCard from "./GrowingCard.vue";
import {peek} from "../route.js";

const props = defineProps({
    worker: {type: String, required: true},
    workerId: {type: Number, default: 0},
    messageId: {type: Number, required: true},
    taskId: {type: Number, default: 0},
    text: {type: String, default: ""},
});

const who = computed(() => (props.workerId ? `Report from worker ${props.workerId}, ${props.worker}` : `Report from ${props.worker}`));
const title = computed(() => (props.taskId ? `${who.value}, on task ${props.taskId}` : who.value));
const openWorker = () => (props.workerId ? peek("workers", props.workerId) : peek("messages", props.messageId));
</script>

<template>
    <GrowingCard :title="title" :text="text" :person="worker" action="Open the worker" @act="openWorker" />
</template>
