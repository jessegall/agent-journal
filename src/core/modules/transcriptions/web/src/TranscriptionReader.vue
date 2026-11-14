<script setup>
import {ref} from "vue";
import {Btn, Reader, ResourceLinks, peekRef, useWindow} from "@journal/window-kit";

// one transcription read whole: its text to edit and save, and the items made from it under Linked items
const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["save"]);
const view = useWindow();
const text = ref(props.row.text);
const tab = ref("text");
const tabs = [{key: "text", label: "Text"}, {key: "linked", label: "Linked items"}];
const facts = [
    {name: "source", label: "Source", value: props.row.source || "Pasted"},
    {name: "created", label: "Made", value: new Date(props.row.created_at).toLocaleString()},
];

function readLinks(line) {
    const flags = {};
    for (const name of ["page", "page-size", "kind"]) {
        const index = line.indexOf(`--${name}`);
        if (index >= 0) flags[name] = line[index + 1];
    }
    return view.readKey(`links.${props.row.id}`, flags);
}
const openLinked = (target) => peekRef(`${target.table}:${target.id}`);
</script>

<template>
    <Reader v-model:tab="tab" :title="row.title" :number="`Transcription ${row.id}`" :tabs="tabs" :facts="facts" data-transcription-opened>
        <template #primary>
            <Btn small variant="primary" data-transcription-save :disabled="text === row.text" @click="emit('save', text)">Save</Btn>
        </template>
        <template #default="{tab: open}">
            <template v-if="open === 'text'">
                <textarea v-model="text" rows="14" aria-label="Transcript"></textarea>
            </template>
            <template v-else>
                <ResourceLinks model="transcription" :id="row.id" :read="readLinks" link-attribute="data-transcription-link" empty="Nothing yet" @open="openLinked" />
            </template>
        </template>
    </Reader>
</template>

<style scoped>
textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface, none);
    color: inherit;
    font: inherit;
}
</style>
