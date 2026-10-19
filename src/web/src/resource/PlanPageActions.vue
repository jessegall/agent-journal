<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import PlanCritique from "./PlanCritique.vue";
import {actsOf} from "../domain/acts.js";

const props = defineProps({plan: {type: Object, required: true}, error: {type: String, default: ""}});
const emit = defineEmits(["run"]);
const acts = computed(() => actsOf(props.plan));
const critiquing = ref(false);
</script>

<template>
    <div class="actions">
        <template v-for="(act, i) in acts" :key="act.name">
            <Btn :kind="act.danger ? 'danger' : i === 0 ? 'primary' : 'ghost'" @click="emit('run', act.name)">{{ act.label }}</Btn>
        </template>
        <template v-if="plan.state === 'ready'">
            <Btn kind="ghost" @click="critiquing = true">Ask for a critique</Btn>
        </template>
        <span class="error">{{ error }}</span>
    </div>
    <template v-if="critiquing">
        <PlanCritique :plan="plan" @close="critiquing = false" />
    </template>
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
