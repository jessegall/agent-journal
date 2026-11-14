<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";
import {addTriggerCommand, addTriggerLine, checkTrigger, triggerFields} from "./sequenceForms.js";

// the Add trigger dialog of one sequence: what starts it on its own, added to the ones it has and run as journal sequence edit
const props = defineProps({sequence: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
const run = (values) => view.run(addTriggerLine(props.sequence, values));
</script>

<template>
    <CreateDialog title="Add trigger" submit="Add the trigger" :fields="triggerFields" :command="addTriggerCommand(sequence)" :check="checkTrigger" :run="run" @close="emit('close')" />
</template>
