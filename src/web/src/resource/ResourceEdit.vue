<script setup>
import Btn from "../kit/Btn.vue";
import {label} from "../domain/tables.js";

const props = defineProps({table: {type: String, required: true}, fields: {type: Object, required: true}, error: {type: String, default: ""}});
const draft = defineModel("draft", {type: Object, required: true});
const emit = defineEmits(["save", "cancel"]);
const named = (field) => label(props.table, field, field.charAt(0).toUpperCase() + field.slice(1));
</script>

<template>
    <form class="edit" @submit.prevent="emit('save')">
        <template v-for="(shape, field) in fields" :key="field">
            <template v-if="shape === 'line'">
                <input v-model="draft[field]" class="edit-title" :placeholder="named(field)" @keydown.esc="emit('cancel')" />
            </template>
            <template v-else>
                <textarea v-model="draft[field]" :rows="field === 'body' ? 12 : 4" :placeholder="named(field)" @keydown.esc="emit('cancel')" />
            </template>
        </template>
        <div class="edit-row">
            <Btn kind="primary" small @click="emit('save')">Save</Btn>
            <Btn small @click="emit('cancel')">Cancel</Btn>
            <template v-if="error">
                <span class="edit-error">{{ error }}</span>
            </template>
        </div>
    </form>
</template>

<style scoped>
.edit {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 12px 0;
}

.edit textarea {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    font: inherit;
    resize: vertical;
}

.edit-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.edit-error {
    color: var(--danger);
    font-size: 12px;
}
</style>
