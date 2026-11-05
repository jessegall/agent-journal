<script setup>
import {AgentRowList, WindowRoom, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("agent list --role reviewer", ["agent.*"]);
</script>

<template>
    <WindowRoom padding="14px 16px">
        <AgentRowList :rows="rows" :failure="failure" :loaded="loaded" none="No reviewers have been sent from here" />
    </WindowRoom>
</template>
