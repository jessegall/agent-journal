<script setup>
import {TaskChain, peekRef, useWindow} from "@journal/window-kit";

// what a task waits on and what waits on it, drawn in its inspector from the task graph
const view = useWindow();
const row = view.option("row");
const {data: graph} = view.props.graph;
</script>

<template>
    <template v-if="graph">
        <TaskChain :task="row" :graph="graph" @select="(id) => peekRef(`tasks:${id}`)" />
    </template>
</template>
