<script setup>
import {computed, onMounted, watch} from "vue";
import {route} from "./route.js";
import {boot, listen, reload, store} from "./store.js";
import Sidebar from "./layout/Sidebar.vue";
import TopBar from "./layout/TopBar.vue";
import StatusBar from "./layout/StatusBar.vue";
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
    <template v-if="store.spec">
        <div class="app">
            <Sidebar />
            <div class="main">
                <TopBar />
                <StatusBar />
                <div class="page">
                    <SwitchCase :value="page">
                        <template #home><Home /></template>
                        <template #settings><SettingsPage /></template>
                        <template #search><SearchPage /></template>
                        <template #default><Index :type="route.page" /></template>
                    </SwitchCase>
                </div>
            </div>
            <template v-if="store.activity">
                <Activity />
            </template>
            <template v-if="route.open">
                <Reader :type="route.open.type" :n="route.open.n" />
            </template>
            <template v-else-if="route.n && page === 'index'">
                <Reader :type="route.page" :n="route.n" />
            </template>
        </div>
    </template>
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
