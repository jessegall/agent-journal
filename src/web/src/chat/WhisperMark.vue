<script setup>
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import {peek} from "../route.js";
import {meta} from "../state/store.js";

const props = defineProps({
    row: {type: String, required: true},
    title: {type: String, required: true},
    at: {type: Number, required: true},
});

const type = computed(() => props.row.split(":")[0]);
const n = computed(() => Number(props.row.split(":")[1]));
const named = computed(() => `${(meta(type.value) || {title: type.value}).title.toLowerCase()} ${n.value}`);
</script>

<template>
    <ChatMark icon="reminders" label="Reminded the agent of" :name="named" :at="at" :title="`Open ${named}: ${title}`" @click="peek(type, n)" />
</template>
