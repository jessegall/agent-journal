<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import CloseButton from "../kit/CloseButton.vue";
import SidePanel from "../kit/SidePanel.vue";
import AgentHome from "./AgentHome.vue";
import {agentState, ticketOf} from "../domain/ticketAgents.js";

const props = defineProps({
    card: {type: Object, required: true},
    env: {type: String, default: ""},
    kind: {type: String, default: "ticket"},
    label: {type: String, default: ""},
    plan: {type: Number, default: 0},
});
const emit = defineEmits(["close", "terminal"]);

const ticket = computed(() => (props.env ? null : ticketOf(props.card.n)));
const env = computed(() => props.env || (ticket.value && ticket.value.data.work_environment) || "");
const plan = computed(() => props.plan || (ticket.value && ticket.value.data.plan) || 0);
const band = computed(() => ({
    kicker: props.kind === "plan" ? "Plan agent" : "Ticket agent",
    label: props.label || `#${props.card.n}`,
    title: props.card.title,
    state: agentState(props.card),
    reason: props.card.reason,
}));
</script>

<template>
    <SidePanel width="page" @close="emit('close')">
        <template v-if="env">
            <AgentHome :key="env" :band="band" :env="env" :plan="plan" :chat-session="card.session">
                <template #actions>
                    <Btn small title="The agent's live screen, where you can type to it" @click="emit('terminal')">Live screen</Btn>
                    <CloseButton @click="emit('close')" />
                </template>
            </AgentHome>
        </template>
    </SidePanel>
</template>
