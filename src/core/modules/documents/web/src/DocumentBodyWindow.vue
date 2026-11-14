<script setup>
import {DocumentBody, useWindow} from "@journal/window-kit";
import {documentRead} from "./documentRead.js";

// the text, comments and revisions of a document or a report, drawn inside its inspector: reads go through the window's reads and its comment, close and edit commands through its runs
const view = useWindow();
const row = view.option("row");
const read = documentRead(view);
</script>

<template>
    <DocumentBody :term="row.term" :id="row.id" :read="read" />
</template>
