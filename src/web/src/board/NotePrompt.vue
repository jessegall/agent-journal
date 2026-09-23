<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import TextInput from "../kit/TextInput.vue";

defineProps({ask: Object});
const emit = defineEmits(["send", "close"]);
const note = ref("");
const send = () => note.value.trim() && emit("send", note.value.trim());
</script>

<template>
    <Dialog :title="`${ask.action.label} for #${ask.card.n}`" @close="emit('close')">
        <p class="text">A note for its agent. It is typed into the agent's terminal as your next message.</p>
        <TextInput
            class="note"
            :value="note"
            placeholder="What should change"
            autofocus
            @input="note = $event.target.value"
            @keydown.enter="send"
        />
        <div class="actions">
            <Btn small @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" small :disabled="!note.trim()" @click="send">{{ ask.action.label }}</Btn>
        </div>
    </Dialog>
</template>

<style scoped>
.text {
    margin: 0 0 10px;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.note {
    width: 100%;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 14px;
}
</style>
