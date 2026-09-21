<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {providerName} from "../agents.js";
import Icon from "../kit/Icon.vue";

const emit = defineEmits(["done"]);
const available = ref([]);
const assigning = ref("");
const error = ref("");

onMounted(async () => {
    try {
        available.value = await api.onlineAgents();
    } catch (e) {
        error.value = e.message;
    }
});

async function choose(candidate) {
    assigning.value = candidate.session;
    error.value = "";
    try {
        await api.appoint(candidate.session);
        emit("done");
    } catch (e) {
        error.value = e.message;
    } finally {
        assigning.value = "";
    }
}
</script>

<template>
    <template v-if="error">
        <p class="bar-error">{{ error }}</p>
    </template>
    <template v-else-if="!available.length">
        <p class="bar-none">No online agents are available.</p>
    </template>
    <template v-for="candidate in available" :key="candidate.session">
        <button type="button" class="bar-agent-choice" :disabled="assigning === candidate.session" @click="choose(candidate)">
            <Icon name="agents" />
            <span>{{ providerName(candidate.provider, "Agent") }}{{ candidate.model ? ` · ${candidate.model}` : "" }}</span>
            <small>{{ candidate.environment || "unassigned" }}</small>
        </button>
    </template>
</template>
