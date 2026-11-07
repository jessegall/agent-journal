<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, useWindow} from "@journal/window-kit";
import StepCards from "./StepCards.vue";

const emit = defineEmits(["close"]);
const context = useWindow();
const title = ref("");
const steps = ref([""]);
const failure = ref("");
const missing = computed(() => {
    if (!title.value.trim()) return "Give the sequence a title.";
    return steps.value.some((step) => !step.trim()) ? "Add instructions for each step." : "";
});

async function create() {
    const answer = await context.run(["sequence", "make", title.value.trim(), "--steps", steps.value.map((step) => step.trim()).join(" | ")]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("close");
}
</script>

<template>
    <Dialog title="New sequence" @close="emit('close')">
        <div class="new-sequence">
            <label class="field">
                <span class="label">Title</span>
                <input v-model="title" placeholder="Releasing a version" data-sequence-title>
            </label>
            <div class="field">
                <span class="label">Steps, in order</span>
                <StepCards :steps="steps" @steps="steps = $event" />
            </div>
        </div>
        <template #foot>
            <span class="note" role="status">{{ failure || missing }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" :disabled="Boolean(missing)" data-sequence-create @click="create">Create sequence</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.new-sequence {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.label,
.note {
    color: var(--text-3);
    font-size: 12px;
}

.note {
    flex: 1;
}

input {
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
</style>
