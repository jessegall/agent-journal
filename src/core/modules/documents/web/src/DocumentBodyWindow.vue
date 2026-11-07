<script setup>
import {DocumentBody, useWindow} from "@journal/window-kit";

// the text, comments and revisions of a document or a report, drawn inside its inspector: reads go through the window's reads and its comment, close and edit commands through its runs
const view = useWindow();
const row = view.option("row");
const RUNS = new Set(["doc comment", "report comment", "doc close", "doc edit", "report edit"]);
const read = (line) => (RUNS.has(line.slice(0, 2).join(" ")) ? view.run(line) : view.read(line));
</script>

<template>
    <DocumentBody :noun="row.noun" :id="row.id" :read="read" />
</template>
