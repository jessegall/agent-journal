<script setup>
import {computed, reactive, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import FormField from "../kit/FormField.vue";
import StepCards from "./StepCards.vue";
import TriggerCards from "./TriggerCards.vue";
import {blankStep, stepBody, stepCard, stepsProblem} from "../domain/sequenceSteps.js";
import {triggerBody, triggersProblem} from "../domain/sequenceTriggers.js";

const emit = defineEmits(["made", "close"]);
const draft = reactive({title: "", steps: [stepCard(blankStep(), 0)], triggers: []});
const error = ref("");
const missing = computed(() => (draft.title.trim() ? "" : "Give the sequence a title.") || stepsProblem(draft.steps) || triggersProblem(draft.triggers));

async function submit() {
    error.value = "";
    try {
        const made = await api.create("sequences", {title: draft.title.trim(), steps: draft.steps.map(stepBody), triggers: draft.triggers.map(triggerBody)});
        emit("made", made.id);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <Dialog title="New sequence" @close="emit('close')">
        <div class="new-sequence">
            <FormField label="Title">
                <input v-model="draft.title" class="title-input" placeholder="Releasing a version" />
            </FormField>
            <FormField label="Steps, in order">
                <StepCards :cards="draft.steps" />
            </FormField>
            <FormField label="What starts it on its own; none means only you or the agent start it">
                <TriggerCards :cards="draft.triggers" />
            </FormField>
        </div>
        <template #foot>
            <span class="foot-note">{{ error || missing }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" :disabled="Boolean(missing)" @click="submit">Create sequence</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.new-sequence {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.title-input {
    box-sizing: border-box;
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
}

.foot-note {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
