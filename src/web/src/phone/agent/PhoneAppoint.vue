<script setup>
import {onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {providerName} from "../../domain/agents.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import {toast} from "../kit/toast.js";
import PhonePage from "../settings/PhonePage.vue";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const sessions = ref(null);

onMounted(async () => {
    sessions.value = await api.onlineAgents().catch((error) => (toast(error.message), []));
});

async function choose(session) {
    try {
        await api.appoint(session.session);
        toast(`Assigned ${providerName(session.provider, "the agent")} to this environment`);
        emit("back");
    } catch (error) {
        toast(error.message);
    }
}
</script>

<template>
    <PhonePage title="Assign an agent" line="Running sessions that can take this environment." :back="back" @back="emit('back')">
        <template v-if="sessions && !sessions.length">
            <EmptyList icon="agents" title="No running agent is free" reason="Start a session on your computer, or start an agent from the agent sheet." />
        </template>
        <template v-else-if="sessions">
            <CellGroup>
                <template v-for="session in sessions" :key="session.session">
                    <Cell
                        icon="agents"
                        :label="`${providerName(session.provider, 'Agent')}${session.model ? ` · ${session.model}` : ''}`"
                        :sub="session.environment || 'No environment'"
                        @pick="choose(session)"
                    />
                </template>
            </CellGroup>
        </template>
    </PhonePage>
</template>
