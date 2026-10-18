<script setup>
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";

const LEAD =
    "The journal answers the agent with one workflow per state per event: pick what the agent is doing, then what happens, and the workflow for that pair shows. A state with a parent uses the parent's workflow where it has none of its own.";

const emit = defineEmits(["close"]);
</script>

<template>
    <Dialog title="How workflows work" fits @close="emit('close')">
        <p class="chart-dialog-text">{{ LEAD }}</p>
        <p class="chart-dialog-text">
            A trigger is an event, such as the agent stopping. A check is a yes or no question the journal answers from what it knows, and
            the flow goes on by the Yes or the No line. An action is what the journal does: send a message to the agent, block its stop,
            block a tool, type into its terminal or start a sequence.
        </p>
        <p class="chart-dialog-text">
            The page opens read-only; Edit switches editing on. Add step puts a step below the selected one and connects it. Drag from a
            port onto another step to connect them, click a line to remove it, and drag a step to move it. Nothing changes until you save.
            Turn off keeps a workflow's steps but stops it answering; Reset to default brings a default workflow back; Delete removes one
            you made.
        </p>
        <template #foot>
            <Btn kind="primary" @click="emit('close')">Close</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.chart-dialog-text {
    margin: 0;
    color: var(--text-2);
}
</style>
