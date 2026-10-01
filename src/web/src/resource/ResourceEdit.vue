<script setup>
import Btn from "../kit/Btn.vue";

defineProps({briefLabel: {type: String, default: ""}, error: {type: String, default: ""}});
const abstract = defineModel("abstract", {type: String, default: ""});
const brief = defineModel("brief", {type: String, default: ""});
const emit = defineEmits(["save", "cancel"]);
</script>

<template>
    <form class="edit" @submit.prevent="emit('save')">
        <textarea
            v-model="abstract"
            rows="2"
            maxlength="200"
            placeholder="Abstract, at most 200 characters"
            @keydown.esc="emit('cancel')"
        />
        <textarea v-model="brief" rows="6" :placeholder="briefLabel || 'Brief'" @keydown.esc="emit('cancel')" />
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
