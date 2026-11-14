<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";

// Share: an item of this journal, by its kind and its number, goes to the library; the answer names what the library now holds and any warning about numbers in the text
const emit = defineEmits(["close", "shared"]);
const view = useWindow();
const fields = [
    {key: "kind", label: "Type", kind: "select", options: [["doc", "Document"], ["sequence", "Sequence"], ["check", "Check"]], required: true},
    {key: "number", label: "Number", required: true, placeholder: "63"},
];
const check = (values) => (/^\d+$/.test(values.number.trim()) ? {} : {number: "Write the number, such as 63."});
const command = (values) => `journal library share ${values.kind} ${values.number.trim() || "…"}`;
async function run(values) {
    const answer = await view.run(["library", "share", values.kind, values.number.trim()]);
    if (answer.ok) emit("shared", answer.value);
    return answer;
}
</script>

<template>
    <CreateDialog title="Share" submit="Share" :fields="fields" :command="command" :check="check" :run="run" @close="emit('close')" />
</template>
