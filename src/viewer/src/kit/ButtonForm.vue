<script setup>
import {computed, ref} from "vue";
import Btn from "./Btn.vue";
import ButtonField from "./ButtonField.vue";
import Dialog from "./Dialog.vue";
import {pressButton} from "../chat/markButtons.js";
import {meta, tableOfWord} from "../domain/tables.js";

const props = defineProps({button: {type: Object, required: true}, row: {type: Object, default: null}, environment: {type: String, required: true}});
const emit = defineEmits(["close", "done"]);
const values = ref(Object.fromEntries(props.button.fields.map((field) => [field.name, field.default || ""])));
const sending = ref(false);
const failure = ref("");
const complete = computed(() => props.button.fields.every((field) => values.value[field.name].trim().length > 0));
const heading = computed(() => {
    if (!props.row) return props.button.label;
    const model = meta(tableOfWord(props.row.term))?.title || "Item";
    return `${props.button.label} · ${model} ${props.row.id}`;
});

async function send() {
    if (sending.value || !complete.value) return;
    sending.value = true;
    const answer = await pressButton(props.button, props.row, props.environment, values.value);
    sending.value = false;
    failure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    emit("done");
    emit("close");
}
</script>

<template>
    <Dialog padded :title="heading" fits small sheet @close="emit('close')">
        <div class="button-form" data-button-form>
            <template v-if="row?.title">
                <p class="button-form-title">{{ row.title }}</p>
            </template>
            <template v-for="field in button.fields" :key="field.name">
                <ButtonField :field="field" :value="values[field.name]" :environment="environment" @pick="values[field.name] = $event" />
            </template>
            <template v-if="failure">
                <p class="button-form-failure" role="alert">{{ failure }}</p>
            </template>
            <div class="button-form-actions">
                <Btn small @click="emit('close')">Cancel</Btn>
                <Btn variant="primary" small :disabled="!complete || sending" :busy="sending" data-button-send @click="send">Send</Btn>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.button-form {display: flex; flex-direction: column; gap: 14px;}
.button-form-title {margin: 0; color: var(--text-3);}
.button-form-failure {margin: 0; color: var(--danger);}
.button-form-actions {display: flex; gap: 8px; justify-content: flex-end;}
</style>
