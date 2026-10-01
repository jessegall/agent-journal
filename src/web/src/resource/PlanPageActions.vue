<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Switch from "../kit/Switch.vue";
import PlanCritique from "./PlanCritique.vue";

const props = defineProps({
    plan: {type: Object, required: true},
    status: {type: String, default: ""},
    button: {type: Array, default: null},
    holdsTickets: {type: Boolean, default: false},
    shared: {type: Boolean, default: false},
    error: {type: String, default: ""},
});
const emit = defineEmits(["run"]);
const critiquing = ref(false);
const data = computed(() => props.plan.data);
const ENDED = ["done", "abandoned"];
</script>

<template>
    <div class="actions">
        <template v-if="button">
            <Btn kind="primary" @click="emit('run', button[0])">{{ button[1] }}</Btn>
        </template>
        <template v-else-if="status === 'building'">
            <span class="note">The agent is still writing this plan. It can be started once it is ready.</span>
        </template>
        <template v-if="!ENDED.includes(status)">
            <Btn title="Ask the agent to have other agents critique this plan" @click="critiquing = true">Ask for a critique</Btn>
            <Btn kind="danger" @click="emit('run', 'abandon', {why: 'stopped from the viewer'})">Abandon</Btn>
        </template>
        <template v-if="holdsTickets && !ENDED.includes(status)">
            <Switch
                :on="shared"
                word="One worktree for the whole plan"
                title="Every ticket of this plan is done by the plan's own agent in one worktree, one after another, instead of one worktree per ticket"
                @change="emit('run', 'update', {worktree: shared ? 'each' : 'shared'})"
            />
        </template>
        <template v-if="shared && data.branch">
            <span class="note">
                One worktree on the branch {{ data.branch }},
                {{ data.merged ? "merged" : "not merged yet" }}
            </span>
        </template>
        <template v-if="critiquing">
            <PlanCritique :plan="plan" @close="critiquing = false" />
        </template>
        <span class="error">{{ error }}</span>
    </div>
</template>

<style scoped>
.note {
    color: var(--text-3);
    font-size: 12px;
}

.actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0 16px;
}

.error {
    color: var(--danger);
    font-size: 12px;
}
</style>
