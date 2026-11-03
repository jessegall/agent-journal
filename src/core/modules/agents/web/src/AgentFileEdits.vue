<script setup>
import {computed} from "vue";
import {ago, DiffCard, RowList, useRows} from "@journal/window-kit";

// the files one agent changed, newest first, each edit as a diff card of its first lines
const CARD_LINES = 5;
const props = defineProps({agent: {type: Number, required: true}});
const {rows, failure, loaded, more, older} = useRows(`file-edit list --agent ${props.agent}`, ["file_edit.create"], {incremental: true});
const edits = computed(() => rows.value.map((edit) => ({...edit, lines: JSON.parse(edit.rows || "[]")})));
</script>

<template>
    <RowList :rows="edits" :failure="failure" :loaded="loaded" :more="more" :older="older" empty="No edits by this agent yet">
        <template #default="{row}">
            <DiffCard flush :lines="CARD_LINES" :path="row.path" :kind="row.edit_type" :added="row.added" :removed="row.removed" :ago="ago(row.created_at)" :rows="row.lines" />
        </template>
    </RowList>
</template>
