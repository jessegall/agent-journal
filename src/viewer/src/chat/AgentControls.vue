<script setup>
import UsageMeter from "./UsageMeter.vue";
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import ChoiceList from "../kit/ChoiceList.vue";
import Skeleton from "../kit/Skeleton.vue";

const props = defineProps({control: String, agent: Object});
const emit = defineEmits(["done"]);
const controls = ref({groups: [], note: ""});
const loaded = ref(false);
const controlling = ref("");
const error = ref("");
const data = computed(() => props.agent);
const filled = computed(() => Math.round(Number(data.value.context || 0)));
const chosen = computed(() => controls.value.groups.filter((group) => group.key === props.control));
const current = computed(() => (props.control === "effort" ? `effort ${data.value.effort || "not reported"}` : data.value.model));

const waiting = (key, value) => controlling.value === `${key}:${value}`;

onMounted(async () => {
    try {
        controls.value = await api.agentControls(data.value.provider, data.value.model, data.value.effort);
    } catch (e) {
        error.value = e.message;
    } finally {
        loaded.value = true;
    }
});

async function applyChoice(action, value) {
    controlling.value = `${action}:${value}`;
    error.value = "";
    try {
        await api.controlAgent(props.agent.id, action, value);
        emit("done");
    } catch (e) {
        error.value = e.message;
    } finally {
        controlling.value = "";
    }
}
</script>

<template>
    <template v-if="error">
        <p class="bar-error">{{ error }}</p>
    </template>
    <template v-if="control === 'context'">
        <p class="bar-current">Context window</p>
        <UsageMeter label="Used" :percent="filled" />
    </template>
    <template v-else>
        <p class="bar-current">{{ current }}</p>
    </template>
    <template v-if="!loaded">
        <Skeleton :count="2" label="Loading the controls" />
    </template>
    <template v-for="group in chosen" :key="group.key">
        <template v-if="control !== 'context'">
            <p class="bar-label">{{ group.label }}</p>
        </template>
        <ChoiceList
            :choices="group.choices"
            :busy="(value) => waiting(group.key, value)"
            :disabled="Boolean(controlling)"
            @pick="(value) => applyChoice(group.key, value)"
        />
    </template>
    <template v-if="control !== 'context'">
        <p class="bar-none">{{ controls.note }}</p>
    </template>
</template>
