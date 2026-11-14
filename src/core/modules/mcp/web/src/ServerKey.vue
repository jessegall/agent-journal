<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";
import {keyCommand, keyFields, keyLine} from "./integrationWords.js";

// the key of a server, given in a dialog and kept outside the project
const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
const run = (values) => view.props.installed.act(keyLine(props.row, values));
</script>

<template>
    <CreateDialog :title="`Key of ${row.title}`" submit="Save the key" :fields="keyFields(row)" :command="keyCommand(row)" :run="run" @close="emit('close')" />
</template>
