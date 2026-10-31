<script setup>
import {nextTick, onMounted, ref} from "vue";
import Btn from "../kit/Btn.vue";

defineProps({
    environment: {type: String, required: true},
    work: {type: String, default: ""},
    busy: {type: Boolean, default: false},
    error: {type: String, default: ""},
});
const emit = defineEmits(["cancel", "stop"]);
const cancel = ref(null);
onMounted(() => nextTick(() => cancel.value?.$el.focus()));
</script>

<template>
    <div class="stop-confirm" role="group" :aria-label="`Stop the agent in ${environment}`">
        <template v-if="work">
            <p class="stop-ask">{{ environment }} is working on “{{ work }}”. Stop it anyway? Its session ends.</p>
        </template>
        <template v-else>
            <p class="stop-ask">Stop the agent in {{ environment }}? Its session ends.</p>
        </template>
        <template v-if="error">
            <p class="stop-error" role="alert">{{ error }}</p>
        </template>
        <div class="stop-row">
            <Btn ref="cancel" small @click="emit('cancel')">Cancel</Btn>
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

.stop-row .btn.danger {
    border-color: var(--danger);
    background: var(--danger);
    color: #fff;
}

.stop-row .btn.danger:hover {
    background: color-mix(in srgb, var(--danger) 85%, #000);
    color: #fff;
}
</style>
