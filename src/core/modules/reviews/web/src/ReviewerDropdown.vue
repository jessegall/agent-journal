<script setup>
import {AgentRowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("agent list --role reviewer", ["agent.*"]);
</script>

<template>
    <AgentRowList :rows="rows" :failure="failure" :loaded="loaded" none="No reviewers have been sent from here" />
</template>
