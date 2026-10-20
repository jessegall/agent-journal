<script setup>
import BubbleHeader from "../kit/BubbleHeader.vue";
import {clock} from "../format/time.js";

defineProps({worker: {type: String, required: true}, at: {type: Number, default: 0}});
</script>

<template>
    <BubbleHeader icon="agents" :label="`Report from ${worker} · ${clock(at)}`" small />
</template>
