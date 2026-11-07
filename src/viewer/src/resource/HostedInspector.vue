<script setup>
import {inject} from "vue";
import {INSPECTOR_HOST} from "../windows/windowContext.js";
import Inspector from "./Inspector.vue";

// the shared inspector layout for a window that draws it inside itself: the listing comes from the host the window runs in
defineProps({noun: {type: String, required: true}, id: {type: Number, required: true}, read: {type: Function, required: true}, environment: {type: String, required: true},
    stepped: Boolean, embedded: Boolean, readOnly: Boolean});
defineEmits(["step", "open", "close", "back"]);
const host = inject(INSPECTOR_HOST);
</script>

<template>
    <Inspector v-bind="$props" :catalogue="host.catalogue" @step="$emit('step', $event)" @open="$emit('open', $event)" @close="$emit('close')" @back="$emit('back')" />
</template>
