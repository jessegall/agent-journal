<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import PhoneReaderChips from "./PhoneReaderChips.vue";
import {AGENTS, DEPTHS} from "./readerChoices.js";

const emit = defineEmits(["review"]);
const agents = defineModel("agents", {type: Number, default: 2});
const depth = defineModel("depth", {type: String, default: DEPTHS[1]});
const agentChoices = computed(() => AGENTS.map((count) => ({key: count, label: String(count), on: agents.value === count})));
const depthChoices = computed(() => DEPTHS.map((one) => ({key: one, label: one, on: depth.value === one})));
</script>

<template>
    <span class="reader-choose">How many agents</span>
    <PhoneReaderChips :options="agentChoices" @pick="(count) => (agents = count)" />
    <span class="reader-choose">How thorough</span>
    <PhoneReaderChips :options="depthChoices" @pick="(one) => (depth = one)" />
    <Btn kind="primary" large @click="emit('review')">Ask for the review</Btn>
</template>

<style scoped>
.reader-choose {
    color: var(--text-3);
    font-size: 0.765rem;
}
</style>
