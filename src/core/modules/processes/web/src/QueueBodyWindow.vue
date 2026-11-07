<script setup>
import {ProcessQueueBody, useWindow} from "@journal/window-kit";

// the lists of running, waiting and finished commands and their controls, drawn inside the queue's inspector
const view = useWindow();
const RUNS = new Set(["setting set"]);
const read = (line) => (RUNS.has(line.slice(0, 2).join(" ")) ? view.run(line) : view.read(line));
</script>

<template>
    <ProcessQueueBody :read="read" />
</template>
