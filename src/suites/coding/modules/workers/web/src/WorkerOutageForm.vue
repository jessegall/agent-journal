<script setup>
import {ref} from "vue";
import {Btn} from "@journal/window-kit";
defineProps({program: {type: String, required: true}, disabled: Boolean});
const emit = defineEmits(["submit", "cancel"]);
const reason = ref("");
const endsAt = ref("");
function submit() {
    emit("submit", reason.value, new Date(endsAt.value).toISOString());
}
</script>

<template>
    <form class="outage" data-split-outage-form @submit.prevent="submit">
        <strong>Mark {{ program }} out</strong>
        <label>Reason <input v-model="reason" required aria-label="Outage reason" :disabled="disabled" /></label>
        <label>Until <input v-model="endsAt" type="datetime-local" required aria-label="Outage ends at" :disabled="disabled" /></label>
        <div><Btn type="submit" :disabled="disabled">Mark out</Btn> <Btn :disabled="disabled" @click="$emit('cancel')">Cancel</Btn></div>
    </form>
</template>

<style scoped>
.outage {display: flex; flex-direction: column; gap: 8px; padding: 10px 0;}
label {display: flex; gap: 8px;}
input {min-width: 0; flex: 1;}
</style>
