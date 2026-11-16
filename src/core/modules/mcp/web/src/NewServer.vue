<script setup>
import {CreateDialog, added, useWindow} from "@journal/window-kit";
import {newCommand, newFields, newLine} from "./integrationWords.js";

// the New dialog: a server by its name and its address or the command that starts it
const emit = defineEmits(["close"]);
const view = useWindow();
const run = (values) => {
    const pending = {id: `adding-${Date.now()}`, name: values.name.trim(), title: values.name.trim(), readiness: "adding", auth: "", url: values.target.trim(), command: "", args: [], key_variable: ""};
    return view.props.installed.act(newLine(values), added(pending));
};
</script>

<template>
    <CreateDialog title="New integration" submit="Add the server" :fields="newFields" :command="newCommand" :run="run" @close="emit('close')" />
</template>
