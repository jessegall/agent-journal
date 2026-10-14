<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {critiqueTemplates} from "../domain/critique.js";
import Btn from "../kit/Btn.vue";
import PhoneReaderChips from "./PhoneReaderChips.vue";
import {AGENTS, DEPTHS} from "./readerChoices.js";

const emit = defineEmits(["review"]);
const agents = defineModel("agents", {type: Number, default: 2});
const depth = defineModel("depth", {type: String, default: DEPTHS[1]});
const template = defineModel("template", {type: Object, default: null});
const templates = ref([]);
const agentChoices = computed(() => AGENTS.map((count) => ({key: count, label: String(count), on: agents.value === count})));
const depthChoices = computed(() => DEPTHS.map((one) => ({key: one, label: one, on: depth.value === one})));
const templateChoices = computed(() => [
    {key: 0, label: "No template", on: !template.value},
    ...templates.value.map((one) => ({key: one.n, label: one.title, on: template.value?.n === one.n})),
]);

onMounted(async () => {
    templates.value = critiqueTemplates(await api.all("template").catch(() => []));
});
</script>

<template>
    <span class="reader-choose">How many agents</span>
    <PhoneReaderChips :options="agentChoices" @pick="(count) => (agents = count)" />
    <span class="reader-choose">How thorough</span>
    <PhoneReaderChips :options="depthChoices" @pick="(one) => (depth = one)" />
    <template v-if="templates.length">
        <span class="reader-choose">Template</span>
        <PhoneReaderChips :options="templateChoices" @pick="(n) => (template = templates.find((one) => one.n === n) || null)" />
        <template v-if="template">
            <p class="reader-guide">{{ template.brief }}</p>
        </template>
    </template>
    <Btn kind="primary" large @click="emit('review')">Ask for the review</Btn>
</template>

<style scoped>
.reader-choose {
    color: var(--text-3);
    font-size: 0.765rem;
}

.reader-guide {
    margin: 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}
</style>
