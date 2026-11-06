<script setup>
import {AgentRowList, WindowRoom, useWindow} from "@journal/window-kit";

const {rows, failure, loaded} = useWindow().props.reviewers;
</script>

<template>
    <WindowRoom padding="14px 16px">
        <AgentRowList :rows="rows" :failure="failure" :loaded="loaded" none="No reviewers have been sent from here" />
    </WindowRoom>
</template>
