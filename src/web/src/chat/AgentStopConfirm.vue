<script setup>
import Btn from "../kit/Btn.vue";

defineProps({environment: {type: String, required: true}, busy: {type: Boolean, default: false}, error: {type: String, default: ""}});
const emit = defineEmits(["cancel", "stop"]);
</script>

<template>
    <div class="stop-confirm" role="group" :aria-label="`Stop the agent in ${environment}`">
        <p class="stop-ask">Stop the agent in {{ environment }}? It ends its session.</p>
        <template v-if="error">
            <p class="stop-error" role="alert">{{ error }}</p>
        </template>
        <div class="stop-row">
            <Btn small @click="emit('cancel')">Cancel</Btn>
            <Btn kind="danger" small :busy="busy" @click="emit('stop')">Stop</Btn>
        </div>
    </div>
</template>

<style scoped>
.stop-confirm {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
}

.stop-ask {
    margin: 0;
    color: var(--text);
    font-size: 12.5px;
    line-height: 1.45;
}

.stop-error {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}

.stop-row {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
}
</style>
