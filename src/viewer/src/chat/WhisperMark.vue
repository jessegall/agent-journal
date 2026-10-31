<script setup>
import {meta} from "../domain/tables.js";
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import {peekRef} from "../route.js";
import {refAction} from "../domain/markAction.js";

const props = defineProps({
    row: {type: String, required: true},
    title: {type: String, required: true},
    words: {type: String, default: ""},
    time: {type: Number, required: true},
});

const type = computed(() => props.row.split(":")[0]);
const n = computed(() => Number(props.row.split(":")[1]));
const named = computed(() => `${(meta(type.value) || {title: type.value}).title.toLowerCase()} ${n.value}`);
const mark = computed(() => ({
    icon: "reminders",
    group: "reminders",
    markIcon: "rule",
    label: props.words || props.title,
    time: props.time,
    title: `Open ${named.value}: ${props.title}`,
    action: refAction(props.row),
}));
</script>

<template>
    <ChatMark :mark="mark" @act="peekRef(row)" />
</template>
