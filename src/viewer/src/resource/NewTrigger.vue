<script setup>
import {computed, reactive, ref} from "vue";
import {api} from "../api/client.js";
import {EXAMPLES, doesOf} from "../domain/triggerWords.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import FormField from "../kit/FormField.vue";
import TriggerEditor from "./TriggerEditor.vue";

const emit = defineEmits(["made", "close"]);
const blank = () => ({phrases: [], action: "nudge", text: ""});
const draft = reactive(blank());
const error = ref("");

const missing = computed(() => {
    if (!draft.phrases.length) return "Add at least one word.";
    return draft.text.trim() ? "" : `Write ${doesOf(draft.action).ask.toLowerCase()}.`;
});

function start({name, ...fields}) {
    Object.assign(draft, blank(), fields);
}

async function submit() {
    error.value = "";
    try {
        const made = await api.create("triggers", {...draft});
        emit("made", made.id);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <Dialog title="New trigger" @close="emit('close')">
        <TriggerEditor :draft="draft">
            <template #examples>
                <FormField label="Start with an example trigger">
                    <div class="examples">
                        <template v-for="example in EXAMPLES" :key="example.name">
                            <Btn small @click="start(example)">{{ example.name }}</Btn>
                        </template>
                    </div>
                </FormField>
            </template>
        </TriggerEditor>
        <template #foot>
            <span class="foot-note">{{ error || missing }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" :disabled="Boolean(missing)" @click="submit">Create trigger</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.examples {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.foot-note {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
