<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
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
import Lightbox from "./kit/Lightbox.vue";
import QuickMenu from "./layout/QuickMenu.vue";

const page = computed(() => (!route.value.page ? "home" : ["settings", "search"].includes(route.value.page) ? route.value.page : "index"));

const quick = ref(false);
let pointed = false;
const sawPointer = () => (pointed = true);
const sawKeyMove = (e) => {
    if (e.key === "Tab" || e.key.startsWith("Arrow")) pointed = false;
};
function onSpace(e) {
    if (e.key !== " " || quick.value || e.defaultPrevented) return;
    const el = document.activeElement;
    if (el && el !== document.body) {
        if (el.isContentEditable || el.matches("input,textarea,select")) return;
        if (el.matches("button,a[href],[role=button],[tabindex]") && !pointed) return;
    }
    e.preventDefault();
    quick.value = true;
}
window.addEventListener("pointerdown", sawPointer, true);
window.addEventListener("keydown", sawKeyMove, true);
window.addEventListener("keydown", onSpace);
onUnmounted(() => {
    window.removeEventListener("pointerdown", sawPointer, true);
    window.removeEventListener("keydown", sawKeyMove, true);
    window.removeEventListener("keydown", onSpace);
});

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
                <Transition name="page" mode="out-in">
                    <div :key="route.page || 'home'" class="page">
                        <SwitchCase :value="page">
                            <template #home><Home /></template>
                            <template #settings><SettingsPage /></template>
                            <template #search><SearchPage /></template>
                            <template #default><Index :type="route.page" /></template>
                        </SwitchCase>
                    </div>
                </Transition>
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
            <Lightbox />
            <template v-if="quick">
                <QuickMenu @close="quick = false" />
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

.page-enter-active {
    transition:
        opacity 0.2s ease-out,
        transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.page-enter-from {
    opacity: 0;
    transform: translateY(4px);
}

.page-leave-active {
    transition: opacity 0.1s ease-in;
}

.page-leave-to {
    opacity: 0;
}
</style>
