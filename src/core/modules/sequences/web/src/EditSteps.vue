<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";
import StepCards from "./StepCards.vue";
import {checkSteps, editStepsCommand, editStepsLine, stepsField} from "./sequenceForms.js";

// the Edit steps dialog of one sequence: its steps in order, run as journal sequence edit; each step keeps the guard it had, by its place
const props = defineProps({sequence: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
const run = (values) => view.run(editStepsLine(props.sequence, values));
</script>

<template>
    <CreateDialog :title="`Edit ${sequence.title}`" submit="Save the steps" :fields="[stepsField([...sequence.steps])]" :command="editStepsCommand(sequence)" :check="checkSteps" :run="run" @close="emit('close')">
        <template #steps="{value, set}">
            <StepCards :steps="value" @steps="set" />
        </template>
    </CreateDialog>
</template>
