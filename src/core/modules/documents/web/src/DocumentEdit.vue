<script setup>
import {onMounted, ref} from "vue";
import {CreateDialog, useWindow} from "@journal/window-kit";
import {TERM_WORDS} from "./documentItems.js";

// the Edit the text dialog of a document or a report: its summary and its text, read when the dialog opens and run as journal doc edit or report edit
const props = defineProps({term: {type: String, required: true}, id: {type: Number, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
const row = ref(null);
const failure = ref("");
const fields = () => [{key: "abstract", label: "Summary", required: true, value: row.value.abstract}, {key: "body", label: "Text", kind: "area", required: true, value: row.value.body}];
const command = (values) => `journal ${props.term} edit ${props.id} --abstract "${values.abstract.trim().slice(0, 40)}" --body …`;
onMounted(async () => {
    const answer = await view.read([props.term, "inspect", String(props.id)]);
    if (answer.ok) row.value = answer.value;
    else failure.value = answer.error;
});
</script>

<template>
    <template v-if="row">
        <CreateDialog :title="`Edit the text of this ${TERM_WORDS[term]}`" submit="Save the text" :fields="fields()" :command="command" :run="(values) => view.run([term, 'edit', String(id), '--abstract', values.abstract.trim(), '--body', values.body.trim()])" @close="emit('close')" />
    </template>
    <template v-else-if="failure">
        <p class="failure" role="alert" data-document-edit-failure>{{ failure }}</p>
    </template>
</template>
