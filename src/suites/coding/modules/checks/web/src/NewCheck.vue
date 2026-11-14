<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";
import {checkNewCheck, newCheckCommand, newCheckFields, newCheckLine} from "./checkForms.js";

// the New check dialog: a title, the command it runs and how often, sent as journal check make
const emit = defineEmits(["close"]);
const view = useWindow();
const run = (values) => view.run(newCheckLine(values));
</script>

<template>
    <CreateDialog title="New check" submit="Make the check" :fields="newCheckFields" :command="newCheckCommand" :check="checkNewCheck" :run="run" @close="emit('close')" />
</template>
