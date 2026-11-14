<script setup>
import {inject} from "vue";
import InspectorLinks from "../src/kit/InspectorLinks.vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";

// the Links tab of a reader: the inspector's own links section (InspectorLinks), reading through the window the reader is in, opened at once
defineProps({model: {type: String, required: true}, id: {type: Number, required: true}});
defineEmits(["open"]);
const context = inject(WINDOW_CONTEXT);
</script>

<template>
    <InspectorLinks :model="model" :id="id" :read="context.read" open @open="$emit('open', $event)" />
</template>
