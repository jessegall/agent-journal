<script setup>
import BubbleHeader from "../kit/BubbleHeader.vue";
import {clock} from "../format/time.js";

defineProps({at: {type: Number, default: 0}, from: {type: String, default: "the main agent"}});
</script>

<template>
    <BubbleHeader icon="agents" :label="`Message from ${from} · ${clock(at)}`" tone="agent" small />
</template>
