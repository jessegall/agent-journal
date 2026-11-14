<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";
import {TERM_WORDS} from "./documentItems.js";

// Mark as needing no action: the reason it needs none, run as journal doc settle or report settle
const props = defineProps({term: {type: String, required: true}, id: {type: Number, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
const fields = [{key: "why", label: "Why it needs no action", required: true, placeholder: "The change was made another way"}];
const command = (values) => `journal ${props.term} settle ${props.id} --why "${values.why.trim() || "…"}"`;
</script>

<template>
    <CreateDialog :title="`Mark this ${TERM_WORDS[term]} as needing no action`" submit="Mark it" :fields="fields" :command="command" :run="(values) => view.run([term, 'settle', String(id), '--why', values.why.trim()])" @close="emit('close')" />
</template>
