<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";

// the Edit dialog of a memory: its words anew, run as journal memory edit. A memory is at most 400 characters
const TEXT_LIMIT = 400;
const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
const fields = [{key: "text", label: "What the memory says", kind: "area", required: true, value: props.row.text}];
const check = (values) => (values.text.trim().length > TEXT_LIMIT ? {text: `A memory is at most ${TEXT_LIMIT} characters.`} : {});
const command = (values) => `journal memory edit ${props.row.id} --text "${values.text.trim().slice(0, 40)}${values.text.trim().length > 40 ? "…" : ""}"`;
</script>

<template>
    <CreateDialog :title="`Edit memory ${row.id}`" submit="Save the memory" :fields="fields" :command="command" :check="check" :run="(values) => view.run(['memory', 'edit', String(row.id), '--text', values.text.trim()])" @close="emit('close')" />
</template>
