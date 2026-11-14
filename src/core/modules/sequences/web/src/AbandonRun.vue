<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";
import {abandonCommand, abandonFields, abandonLine} from "./sequenceForms.js";

// giving a run up asks why, and runs journal sequence abandon with that reason
defineProps({run: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
</script>

<template>
    <CreateDialog :title="`Abandon run ${run.id}`" submit="Abandon the run" :fields="abandonFields" :command="abandonCommand" :run="(values) => view.run(abandonLine(values))" @close="emit('close')" />
</template>
