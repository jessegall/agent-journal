<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";

// the Edit dialog of a rule: its words anew, run as journal rule edit
const props = defineProps({rule: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
const fields = [{key: "text", label: "What every agent must follow", kind: "area", required: true, value: props.rule.text}];
const command = (values) => `journal rule edit ${props.rule.id} --text "${values.text.trim().slice(0, 40)}${values.text.trim().length > 40 ? "…" : ""}"`;
</script>

<template>
    <CreateDialog :title="`Edit rule ${rule.id}`" submit="Save the rule" :fields="fields" :command="command" :run="(values) => view.run(['rule', 'edit', String(rule.id), '--text', values.text.trim()])" @close="emit('close')" />
</template>
