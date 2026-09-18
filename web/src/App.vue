<script setup>
import {computed, onMounted, watch} from "vue";
import {route} from "./route.js";
import {boot, listen, reload, store} from "./store.js";
import Sidebar from "./layout/Sidebar.vue";
import TopBar from "./layout/TopBar.vue";
import AgentBand from "./layout/AgentBand.vue";
import Activity from "./layout/Activity.vue";
import SwitchCase from "./kit/SwitchCase.vue";
import Home from "./pages/Home.vue";
import Index from "./pages/Index.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import SearchPage from "./pages/SearchPage.vue";
import Reader from "./resource/Reader.vue";

const page = computed(() => (!route.value.page ? "home" : ["settings", "search"].includes(route.value.page) ? route.value.page : "index"));

onMounted(boot);
watch(
    () => route.value.env,
    async () => {
        await reload();
        listen();
    }
);
</script>

<template>
    <div class="app" v-if="store.spec">
        <Sidebar />
        <div class="main">
            <TopBar />
            <AgentBand />
            <div class="page">
                <SwitchCase :value="page">
                    <template #home><Home /></template>
                    <template #settings><SettingsPage /></template>
                    <template #search><SearchPage /></template>
                    <template #default><Index :type="route.page" /></template>
                </SwitchCase>
            </div>
        </div>
        <Activity v-if="store.activity" />
        <Reader v-if="route.n && page === 'index'" :type="route.page" :n="route.n" />
    </div>
</template>

<style scoped>
.app {
    display: flex;
    height: 100%;
}
.main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.page {
    flex: 1;
    min-height: 0;
    overflow: auto;
}
</style>
