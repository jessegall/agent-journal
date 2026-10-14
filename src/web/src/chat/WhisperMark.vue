<script setup>
import {meta} from "../domain/spec.js";
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import {peekRef} from "../route.js";

const props = defineProps({
    row: {type: String, required: true},
    title: {type: String, required: true},
    words: {type: String, default: ""},
    at: {type: Number, required: true},
});

const type = computed(() => props.row.split(":")[0]);
const n = computed(() => Number(props.row.split(":")[1]));
const named = computed(() => `${(meta(type.value) || {title: type.value}).title.toLowerCase()} ${n.value}`);
const mark = computed(() => ({
    icon: "reminders",
    label: props.words || props.title,
    at: props.at,
    title: `Open ${named.value}: ${props.title}`,
}));
</script>

<template>
    <ChatMark :mark="mark" @click="peekRef(row)" />
</template>
