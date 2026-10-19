<script setup>
import {computed} from "vue";
import PluginDashboard from "../pages/PluginDashboard.vue";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";

const asked = computed(() => store.pluginPage);
const plugin = computed(() => rows("plugins").find((p) => p.name === asked.value.plugin) || null);
const board = computed(() => plugin.value?.manifest.dashboard || null);
const page = computed(() => asked.value.open.split("/").slice(1).join("/"));
</script>

<template>
    <template v-if="plugin && board">
        <PluginDashboard :key="asked.open" :plugin="plugin" :board="board" :page="page" :settled="asked.settled" @close="store.pluginPage = null" />
    </template>
</template>
