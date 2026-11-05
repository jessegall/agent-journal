<script setup>
import {unref} from "vue";
import {useDockRow, useWindow} from "@journal/window-kit";
const row = useDockRow("memory");
const foot = useWindow().option("foot");
</script>
<template>
    <Teleport v-if="unref(foot) && row" :to="unref(foot)"><span>Weight: <b>{{ row.weight }}</b></span></Teleport>
</template>
