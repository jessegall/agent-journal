<script setup>
import {reactive, ref} from "vue";
import Btn from "../../kit/Btn.vue";
import Dialog from "../../kit/Dialog.vue";

// changing a document's abstract and text, starting from how they are now
const props = defineProps({term: {type: String, required: true}, id: {type: Number, required: true}, row: {type: Object, required: true}, read: {type: Function, required: true}});
const emit = defineEmits(["close", "saved"]);
const edited = reactive({abstract: props.row.abstract, body: props.row.body});
const failure = ref("");

async function save() {
    const answer = await props.read([props.term, "edit", String(props.id), "--abstract", edited.abstract, "--body", edited.body]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("saved");
}
</script>

<template>
    <Dialog padded title="Edit the document" wide @close="emit('close')">
        <form class="edit-form" data-text-form @submit.prevent="save">
            <label><span>Abstract</span><input v-model="edited.abstract"></label>
            <label><span>Text</span><textarea v-model="edited.body" rows="20" /></label>
        </form>
        <template #foot>
            <span class="edit-failure" role="alert" data-text-failure>{{ failure }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" data-text-save @click="save">Save</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.edit-form,
label {
    display: flex;
    flex-direction: column;
}

.edit-form {
    gap: 12px;
}

label {
    gap: 5px;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

input,
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
}

textarea {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    line-height: 1.55;
    resize: vertical;
}

.edit-failure {
    flex: 1;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
