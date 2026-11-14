<script setup>
import {TaskLog, useWindow} from "@journal/window-kit";

// the log of a task, drawn in its inspector through the window's own reads
const view = useWindow();
const row = view.option("row");
const read = (line) => view.read(line);
</script>

<template>
    <TaskLog :id="row.id" :read="read" />
</template>
