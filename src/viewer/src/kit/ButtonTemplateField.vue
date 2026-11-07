<script setup>
import {computed, ref} from "vue";
import Segmented from "./Segmented.vue";
import {lineResult} from "../windows/windowContext.js";
import {CHAT_WINDOW} from "../windows/chatOptions.js";

const props = defineProps({field: {type: Object, required: true}, value: {type: String, required: true}, environment: {type: String, required: true}});
const emit = defineEmits(["pick"]);
const templates = ref([]);
const failure = ref("");
const options = computed(() => templates.value.map((row) => ({key: String(row.id), label: row.title, note: row.module})));
const picked = computed(() => templates.value.find((row) => String(row.id) === props.value));

async function load() {
    const answer = await lineResult(CHAT_WINDOW, ["template", "list", "--target", props.field.target, "--purpose", props.field.purpose], props.environment);
    if (!answer.ok) {
        failure.value = answer.error;
        return;
    }
    templates.value = answer.value.rows;
    const title = props.field.default_title || (props.field.purpose === "critique" ? "General critique" : "");
    const selected = templates.value.find((row) => row.title === title);
    if (selected) emit("pick", String(selected.id));
}

load();
</script>

<template>
    <Segmented :options="options" :value="value" wrap @pick="emit('pick', $event)" />
    <template v-if="picked">
        <p class="template-brief">{{ picked.brief }}</p>
    </template>
    <template v-if="failure">
        <p class="template-failure" role="alert">{{ failure }}</p>
    </template>
</template>

<style scoped>
.template-brief {margin: 0; color: var(--text-3); font-size: 12.5px; white-space: pre-wrap;}
.template-failure {margin: 0; color: var(--danger);}
</style>
