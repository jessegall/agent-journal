<script setup>
import {meta} from "../domain/tables.js";
import {createsOf} from "../domain/acts.js";
import {reactive, ref} from "vue";
import {api} from "../api/client.js";
import Dialog from "../kit/Dialog.vue";
import ResourceEdit from "./ResourceEdit.vue";
import NewTrigger from "./NewTrigger.vue";

const props = defineProps({table: String});
const emit = defineEmits(["made", "close"]);
const fields = createsOf(props.table);
const draft = reactive(Object.fromEntries(Object.keys(fields).map((field) => [field, ""])));
const error = ref("");

async function submit() {
    error.value = "";
    try {
        const made = await api.create(props.table, {...draft});
        emit("made", made.id);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <template v-if="table === 'triggers'">
        <NewTrigger @made="emit('made', $event)" @close="emit('close')" />
    </template>
    <template v-else>
        <Dialog :title="`New ${meta(table).title.toLowerCase()}`" @close="emit('close')">
            <ResourceEdit v-model:draft="draft" class="new" :table="table" :fields="fields" :error="error" @save="submit" @cancel="emit('close')" />
        </Dialog>
    </template>
</template>

<style scoped>
.new {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.new-title {
    font-size: 15px;
    font-weight: 500;
}
input,
textarea {
    padding: 8px 11px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    resize: vertical;
}
.extras {
    display: flex;
    gap: 14px;
}

.extra {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.extra:hover {
    color: var(--text);
}

.files {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.file {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.file-x {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-4);
    cursor: pointer;
}

.template {
    display: flex;
    align-items: center;
    gap: 10px;
}
.label {
    color: var(--text-3);
    font-size: 12px;
}
.foot {
    display: flex;
    align-items: center;
    gap: 8px;
}
.error {
    flex: 1;
    color: var(--danger);
    font-size: 12px;
}

.fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
}
.field {
    display: flex;
    align-items: center;
    gap: 10px;
}
.field input {
    flex: 1;
}
</style>
