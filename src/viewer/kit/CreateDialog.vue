<script setup>
import {computed, ref} from "vue";
import Btn from "../src/kit/Btn.vue";
import Dialog from "../src/kit/Dialog.vue";
import FormField from "../src/kit/FormField.vue";
import TextArea from "../src/kit/TextArea.vue";
import TextInput from "../src/kit/TextInput.vue";

// the form behind a New button, on Dialog: fields (kind text, area, select, password or number; a field may show only when another has a value),
// the journal command it will run as the values stand, a check before it runs, and a refusal from the check or from the run shown in place.
// fields: [{key, label, kind, options: [[value, label]], help, required, placeholder, value, when(values)}]; a field of kind slot is drawn by the slot of its key,
// which is given its value and a set(next) that changes it (a list of steps, say)
const props = defineProps({
    title: {type: String, required: true},
    fields: {type: Array, required: true},
    submit: {type: String, default: "Make"},
    // the command line for the values typed so far, shown under the fields
    command: {type: Function, required: true},
    // {key: refusal} for the values typed, or nothing when they pass; a refused field keeps its value and says why under it
    check: {type: Function, default: () => ({})},
    // sends the values; the answer is {ok} or {ok: false, error}
    run: {type: Function, required: true},
});
const emit = defineEmits(["close", "done"]);
const start = (field) => field.value ?? (field.kind === "select" ? field.options[0][0] : "");
const values = ref(Object.fromEntries(props.fields.map((field) => [field.key, start(field)])));
const refused = ref({});
const failure = ref("");
const sending = ref(false);
const shown = computed(() => props.fields.filter((field) => !field.when || field.when(values.value)));
const complete = computed(() => shown.value.every((field) => !field.required || String(values.value[field.key]).trim()));
const preview = computed(() => props.command(values.value));

async function send() {
    if (sending.value || !complete.value) return;
    refused.value = props.check(values.value) ?? {};
    if (Object.keys(refused.value).length) return;
    sending.value = true;
    const answer = await props.run(values.value);
    sending.value = false;
    failure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    emit("done", values.value);
    emit("close");
}
</script>

<template>
    <Dialog padded :title="title" fits small sheet @close="emit('close')">
        <form class="create-dialog" data-create-dialog @submit.prevent="send">
            <template v-for="field in shown" :key="field.key">
                <FormField :label="field.label" :help="field.help" :for="`create-${field.key}`">
                    <template v-if="field.kind === 'select'">
                        <select :id="`create-${field.key}`" v-model="values[field.key]" :data-field="field.key">
                            <template v-for="[option, label] in field.options" :key="option"><option :value="option">{{ label }}</option></template>
                        </select>
                    </template>
                    <template v-else-if="field.kind === 'slot'">
                        <slot :name="field.key" :value="values[field.key]" :values="values" :set="(next) => (values[field.key] = next)" />
                    </template>
                    <template v-else-if="field.kind === 'area'">
                        <TextArea :id="`create-${field.key}`" :value="values[field.key]" :placeholder="field.placeholder" :data-field="field.key" @input="values[field.key] = $event.target.value" />
                    </template>
                    <template v-else>
                        <TextInput :id="`create-${field.key}`" :type="field.kind === 'password' ? 'password' : field.kind === 'number' ? 'number' : 'text'" :model-value="String(values[field.key])" :placeholder="field.placeholder" :data-field="field.key" @update:model-value="values[field.key] = $event" />
                    </template>
                    <template v-if="refused[field.key]"><p class="create-refusal" role="alert" :data-refused="field.key">{{ refused[field.key] }}</p></template>
                </FormField>
            </template>
            <code class="create-command" data-command-preview>{{ preview }}</code>
            <template v-if="failure"><p class="create-refusal" role="alert" data-create-failure>{{ failure }}</p></template>
            <div class="create-actions">
                <Btn small @click="emit('close')">Cancel</Btn>
                <Btn variant="primary" small type="submit" :disabled="!complete || sending" :busy="sending" data-create-send>{{ submit }}</Btn>
            </div>
        </form>
    </Dialog>
</template>

<style scoped>
.create-dialog {
    display: flex;
    flex-direction: column;
    gap: var(--s3);
}

.create-command {
    display: block;
    padding: 6px 8px;
    overflow: hidden;
    border-radius: 6px;
    background: var(--code-bg);
    color: var(--text-3);
    font-size: 11.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.create-refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}

.create-actions {
    display: flex;
    gap: var(--s2);
    justify-content: flex-end;
}
</style>
