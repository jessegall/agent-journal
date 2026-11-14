<script setup>
import {computed, ref} from "vue";
import {ActionsMenu, DocumentBody, Reader, ReaderLinks, SwitchCase} from "@journal/window-kit";
import DocumentRevisionList from "./DocumentRevisionList.vue";
import {isClosed} from "./documentItems.js";

// one document or report read whole: its number in the head, its summary under the title, the Text, Revisions and Links tabs, and the Actions menu. A report has no revisions
const props = defineProps({term: {type: String, required: true}, row: {type: Object, required: true}, items: {type: Array, required: true}, read: {type: Function, required: true}});
const tab = ref("text");
const tabs = computed(() => [{key: "text", label: "Text"}, ...(props.term === "doc" ? [{key: "revisions", label: "Revisions"}] : []), {key: "links", label: "Links"}]);
const facts = computed(() => [{name: "state", label: "State", value: isClosed(props.row) ? `Closed: ${props.row.close_reason}` : "Open"}, {name: "updated", label: "Changed", value: props.row.updated_at, isTime: true}]);
</script>

<template>
    <Reader v-model:tab="tab" :title="row.title" :number="String(row.id)" :abstract="row.abstract" :tabs="tabs" :facts="facts" data-document-reader>
        <template #actions>
            <ActionsMenu :items="items" :head="row.title" />
        </template>
        <SwitchCase :value="tab">
            <template #text><DocumentBody :key="`${term}:${row.id}`" :term="term" :id="row.id" :read="read" /></template>
            <template #revisions><DocumentRevisionList :key="row.id" :id="row.id" /></template>
            <template #links><ReaderLinks :model="term" :id="row.id" /></template>
        </SwitchCase>
    </Reader>
</template>
