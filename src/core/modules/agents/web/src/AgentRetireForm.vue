<script setup>
import {Btn, TextInput} from "@journal/window-kit";

defineProps({reason: String, pending: Boolean});
defineEmits(["submit", "cancel", "update:reason"]);
</script>

<template>
    <form data-agent-retire-confirm @submit.prevent="$emit('submit')">
        <p>Retirement is permanent. This agent cannot be resumed.</p>
        <TextInput :model-value="reason" label="Reason" :disabled="pending" data-agent-retire-reason @update:model-value="$emit('update:reason', $event)" />
        <div class="action-buttons"><Btn type="submit" small :disabled="pending || !reason.trim()" data-agent-confirm-retire>Retire permanently</Btn><Btn small :disabled="pending" @click="$emit('cancel')">Cancel</Btn></div>
    </form>
</template>

<style scoped src="./agentActionForms.css"></style>
