<script setup>
import {ref} from "vue";
import Btn from "../../kit/Btn.vue";
import Dialog from "../../kit/Dialog.vue";

// marking a document or a report as needing no action: the reason it needs none; a document is settled and a report is closed
const props = defineProps({term: {type: String, required: true}, id: {type: Number, required: true}, read: {type: Function, required: true}});
const emit = defineEmits(["close", "saved"]);
const why = ref("");
const failure = ref("");

async function settle() {
    const answer = await props.read([props.term, props.term === "doc" ? "settle" : "close", String(props.id), "--why", why.value.trim()]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("saved");
}
</script>

<template>
    <Dialog padded :title="`Settle this ${term === 'doc' ? 'document' : 'report'}`" @close="emit('close')">
        <form class="settle-form" data-settle-form @submit.prevent="settle">
            <label><span>Why does it need no action?</span><textarea v-model="why" rows="3" data-settle-why /></label>
        </form>
        <template #foot>
            <span class="settle-failure" role="alert" data-settle-failure>{{ failure }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" :disabled="!why.trim()" data-settle-save @click="settle">Settle</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.settle-form,
label {
    display: flex;
    flex-direction: column;
}

label {
    gap: 5px;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 6px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    resize: vertical;
}

.settle-failure {
    flex: 1;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
