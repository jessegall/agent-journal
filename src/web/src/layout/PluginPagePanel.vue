<script setup>
import {computed} from "vue";
import PluginDashboard from "../pages/PluginDashboard.vue";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";

const asked = computed(() => store.pluginPage);
const plugin = computed(() => rows("plugin").find((p) => !p.deleted && (p.data.manifest || {}).name === asked.value.plugin) || null);
const board = computed(() => {
    const name = asked.value.open.split("/")[0];
    return ((plugin.value?.data.manifest || {}).dashboards || []).find((b) => b.name === name) || null;
});
const page = computed(() => asked.value.open.split("/").slice(1).join("/"));
</script>

<template>
    <template v-if="plugin && board">
        <PluginDashboard :key="asked.open" :plugin="plugin" :board="board" :page="page" @close="store.pluginPage = null" />
    </template>
</template>
