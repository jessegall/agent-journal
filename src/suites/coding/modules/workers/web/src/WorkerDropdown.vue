<script setup>
import {AgentDropdownRows, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("agent list --role worker", ["agent.*"]);
</script>

<template>
    <AgentDropdownRows :rows="rows" :failure="failure" :loaded="loaded" none="No workers have been sent from here" />
</template>
