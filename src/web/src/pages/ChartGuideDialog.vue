<script setup>
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";

const LEAD =
    "The journal answers the agent with workflows: pick an event on the left, and the workflows that run at it are listed in the order they run, each for one state or for every state. A state with a parent runs the parent's workflows too.";

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
            A workflow remembers only in values it sets itself, each environment its own: a count, which Add one to a count raises and Set
            a count to zero starts again, and a time, which Note the time keeps and Has N passed since a noted time? asks about. A check
            on a value no step of the same workflow sets is refused, so no workflow reads another's. A workflow may hold a trigger for
            several events, sharing its values between them: it is listed under each, marked with the others, in its own place at each.
            The line under the title says the values in the environment picked in the bar, and Change the order lets you drag the list.
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
