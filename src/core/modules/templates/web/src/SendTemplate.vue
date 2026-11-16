<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";
import {checkSend, sendCommand, sendFields, sendLine} from "./templateForms.js";

// Use it for an item: the template goes to a task, a plan or a document as a comment, with a value for each slot it has, and runs journal template send
const props = defineProps({template: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
</script>

<template>
    <CreateDialog :title="`Send ${template.title}`" submit="Send it" :fields="sendFields(template)" :command="sendCommand(template)" :check="checkSend" :run="(values) => view.run(sendLine(props.template, values))" @close="emit('close')" />
</template>
