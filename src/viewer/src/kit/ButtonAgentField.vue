<script setup>
import {computed, ref} from "vue";
import DropList from "./DropList.vue";
import {lineResult} from "../windows/windowContext.js";
import {CHAT_WINDOW} from "../windows/chatOptions.js";
import {wordLabel} from "../domain/labels.js";

// a select of the running agents with the agents of the field's first role on top, each with its number; it picks the number
const props = defineProps({field: {type: Object, required: true}, value: {type: String, required: true}, environment: {type: String, required: true}});
const emit = defineEmits(["pick"]);
const agents = ref([]);
const failure = ref("");
const options = computed(() => [...agents.value]
    .sort((first, second) => Number(second.role === props.field.first_role) - Number(first.role === props.field.first_role) || first.id - second.id)
    .map((agent) => ({key: String(agent.number), label: agent.given_name || `${wordLabel(agent.role)} ${agent.number}`, note: `${wordLabel(agent.role)} ${agent.number}`})));
const picked = computed(() => options.value.find((option) => option.key === props.value));

async function load() {
    const answer = await lineResult(CHAT_WINDOW, ["agent", "running"], props.environment);
    if (!answer.ok) {
        failure.value = answer.error;
        return;
    }
    agents.value = answer.value.rows;
}

load();
</script>

<template>
    <DropList :label="picked ? picked.label : 'Choose an agent'" :items="options" :picked="value" empty="No agent is running" wide data-agent-field @pick="emit('pick', $event.key)" />
    <template v-if="failure">
        <p class="agent-failure" role="alert">{{ failure }}</p>
    </template>
</template>

<style scoped>
.agent-failure {margin: 0; color: var(--danger);}
</style>
