<script setup>
import Btn from "../kit/Btn.vue";
import {phoneTime} from "../composables/phones.js";

defineProps({title: {type: String, required: true}, data: {type: Object, required: true}, busy: Boolean});
const emit = defineEmits(["disconnect"]);
</script>

<template>
    <div class="phone-row">
        <div class="phone-row-text">
            <span class="phone-name">{{ title }}</span>
            <span class="phone-when">Last seen {{ phoneTime(data.last_seen) }}, until {{ phoneTime(data.expires) }}</span>
        </div>
        <Btn small :busy="busy" @click="emit('disconnect')">Disconnect</Btn>
    </div>
</template>

<style scoped>
.phone-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    align-self: stretch;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
}

.phone-row-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.phone-name {
    color: var(--text);
}

.phone-when {
    color: var(--text-3);
    font-size: 12px;
}
</style>
