<script setup>
import {provide} from "vue";
import Thread from "./Thread.vue";

// A worker's or subagent's own chat: the main chat's component over the scope that reads its own rows.
const props = defineProps({scope: {type: Object, required: true}});
provide("scope", props.scope);
</script>

<template>
    <Thread view="chat" />
</template>
