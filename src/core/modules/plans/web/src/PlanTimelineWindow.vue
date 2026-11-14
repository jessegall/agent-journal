<script setup>
import {PlanTimeline, peekRef, useWindow} from "@journal/window-kit";

// what happened to a plan, newest first; a task opens in the inspector
const view = useWindow();
const row = view.option("row");
const read = (line) => view.read(line);
</script>

<template>
    <PlanTimeline :id="row.id" :read="read" @select="(id) => peekRef(`tasks:${id}`)" />
</template>
