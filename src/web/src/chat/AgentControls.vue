<script setup>
import UsageMeter from "./UsageMeter.vue";
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import ChoiceList from "../kit/ChoiceList.vue";
import {pendingChoice} from "../agents.js";
import {age} from "../format/time.js";

const props = defineProps({control: String, agent: Object});
const emit = defineEmits(["done"]);
const controls = ref({groups: [], note: "Loading controls…"});
const controlling = ref("");
const error = ref("");
const data = computed(() => props.agent.data);
const filled = computed(() => Math.round(Number(data.value.context || 0)));
const compacted = computed(() => {
    const marks = data.value.compactions || [];
    return marks.length ? `Last compacted ${age(marks[marks.length - 1].at)}` : "Not compacted in this session";
});
const chosen = computed(() => controls.value.groups.filter((group) => group.key === props.control));
const current = computed(() => (props.control === "effort" ? `effort ${data.value.effort || "not reported"}` : data.value.model));

const pending = (key) => pendingChoice(data.value, key);
const waiting = (key, value) => controlling.value === `${key}:${value}` || pending(key) === value;

onMounted(async () => {
    try {
        controls.value = await api.agentControls(data.value.provider, data.value.model, data.value.effort);
    } catch (e) {
        error.value = e.message;
    }
});

async function applyChoice(action, value) {
    controlling.value = `${action}:${value}`;
    error.value = "";
    try {
        await api.controlAgent(props.agent.title, action, value);
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
        <UsageMeter label="Used" :percent="filled" :note="compacted" />
    </template>
    <template v-else>
        <p class="bar-current">{{ current }}</p>
    </template>
    <template v-if="pending(control)">
        <div class="bar-waiting">
            <span>{{ pending(control) }} is waiting for the agent to finish its turn.</span>
        </div>
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
