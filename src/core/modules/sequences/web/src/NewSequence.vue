<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";
import StepCards from "./StepCards.vue";
import {checkNewSequence, newSequenceCommand, newSequenceFields, newSequenceLine} from "./sequenceForms.js";

// the New sequence dialog: its title and its steps in order, run as journal sequence make; a sequence made in the viewer is run by the main agent. A copy starts from the title and steps it is given.
const props = defineProps({title: {type: String, default: ""}, steps: {type: Array, default: () => [""]}});
const emit = defineEmits(["close"]);
const view = useWindow();
const run = (values) => view.run(newSequenceLine(values));
</script>

<template>
    <CreateDialog title="New sequence" submit="Make the sequence" :fields="newSequenceFields(props.title, props.steps)" :command="newSequenceCommand" :check="checkNewSequence" :run="run" @close="emit('close')">
        <template #steps="{value, set}">
            <StepCards :steps="value" @steps="set" />
        </template>
    </CreateDialog>
</template>
