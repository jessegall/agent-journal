<script setup>
import BubbleHeader from "../kit/BubbleHeader.vue";
import {clock} from "../format/time.js";

defineProps({at: {type: Number, default: 0}});
</script>

<template>
    <BubbleHeader icon="agents" :label="`Message from the main agent · ${clock(at)}`" tone="agent" small />
</template>
