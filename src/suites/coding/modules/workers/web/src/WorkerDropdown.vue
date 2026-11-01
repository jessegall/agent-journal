<script setup>
import {AgentRowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("agent list --role worker", ["agent.*"]);
</script>

<template>
    <AgentRowList :rows="rows" :failure="failure" :loaded="loaded" none="No workers have been sent from here" />
</template>
