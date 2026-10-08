<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import {useAttempt} from "../composables/attempt.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import TextInput from "../kit/TextInput.vue";
import {isSet} from "../domain/secrets.js";

const props = defineProps({row: {type: Object, required: true}, field: {type: Object, required: true}});
const value = ref("");
const {busy, failure, attempt} = useAttempt();

async function replace() {
    const {done} = await attempt(() => api.fillSecret(props.row.n, props.field.name, value.value));
    if (done) value.value = "";
}
</script>

<template>
    <div class="secret-field">
        <div class="secret-field-head">
            <b class="secret-field-name">{{ field.name }}</b>
            <Chip :tone="isSet(row, field) ? 'good' : 'accent'">{{ isSet(row, field) ? "Set" : "Not set" }}</Chip>
        </div>
        <form class="secret-field-form" autocomplete="off" @submit.prevent="replace">
            <TextInput
                :id="`secret-${row.n}-${field.name}`"
                :value="value"
                @input="value = $event.target.value"
                :type="field.hidden ? 'password' : 'text'"
                :placeholder="isSet(row, field) ? 'Replace value' : 'Value'"
                :aria-label="`Value of ${field.name}`"
                autocomplete="new-password"
                class="secret-field-input"
            />
            <Btn kind="primary" small :busy="busy" :disabled="!value" @click="replace">{{ isSet(row, field) ? "Replace value" : "Set value" }}</Btn>
        </form>
        <template v-if="failure">
            <p class="secret-failure">{{ failure }}</p>
        </template>
    </div>
</template>

<style scoped>
.secret-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 0;
    border-top: 1px solid var(--border-3);
}

.secret-field-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.secret-field-form {
    display: flex;
    gap: 8px;
}

.secret-field-input {
    flex: 1;
    min-width: 0;
}

.secret-failure {
    margin: 0;
    color: var(--tone-danger, #e06c75);
}
</style>
