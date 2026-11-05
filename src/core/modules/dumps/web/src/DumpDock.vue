<script setup>
import {ref, unref} from "vue";
import {useWindow} from "@journal/window-kit";
const context = useWindow();
const item = context.option("row");
const foot = context.option("foot");
const count = ref(0);
async function load() {
    const answer = await context.read(`dump items ${item.value.target_id}`);
    if (answer.ok) count.value = answer.value.length;
}
context.follow(["dump_item.*"], load);
load();
</script>
<template><Teleport v-if="unref(foot)" :to="unref(foot)"><span>Items: <b>{{ count }}</b></span></Teleport></template>
