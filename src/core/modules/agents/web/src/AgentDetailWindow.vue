<script setup>
import {AgentDetail, useWindow} from "@journal/window-kit";

// the identity, activity and instructions of an agent, drawn inside its inspector through the window's own reads
const view = useWindow();
const row = view.option("row");
const read = (line) => view.read(line);
</script>

<template>
    <AgentDetail :id="row.id" :read="read" :environment="view.environment" />
</template>
