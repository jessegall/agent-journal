<script setup>
import {Btn, TextInput} from "@journal/window-kit";

defineProps({program: String, model: String, pending: Boolean});
defineEmits(["submit", "cancel", "update:program", "update:model"]);
</script>

<template>
    <form data-agent-driver-form @submit.prevent="$emit('submit')">
        <p>Starts the next session on this program; the agent keeps its number and memories.</p>
        <TextInput :model-value="program" label="Program" :disabled="pending" data-agent-driver-program @update:model-value="$emit('update:program', $event)" />
        <TextInput :model-value="model" label="Model" :disabled="pending" data-agent-driver-model @update:model-value="$emit('update:model', $event)" />
        <div class="action-buttons"><Btn type="submit" small :disabled="pending || !program.trim() || !model.trim()" data-agent-confirm-driver>Change the driver</Btn><Btn small :disabled="pending" @click="$emit('cancel')">Cancel</Btn></div>
    </form>
</template>

<style scoped src="./agentActionForms.css"></style>
