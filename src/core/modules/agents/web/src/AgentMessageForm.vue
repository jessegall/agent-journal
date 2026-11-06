<script setup>
import {Btn, TextArea} from "@journal/window-kit";

defineProps({text: String, pending: Boolean});
defineEmits(["submit", "cancel", "update:text"]);
</script>

<template>
    <form @submit.prevent="$emit('submit')">
        <label class="action-field">Message<TextArea :value="text" :disabled="pending" data-agent-message-text @input="$emit('update:text', $event.target.value)" /></label>
        <div class="action-buttons"><Btn type="submit" small :disabled="pending || !text.trim()" data-agent-submit-message>Send the message</Btn><Btn small :disabled="pending" @click="$emit('cancel')">Cancel</Btn></div>
    </form>
</template>

<style scoped src="./agentActionForms.css"></style>
