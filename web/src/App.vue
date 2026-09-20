<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {route} from "./route.js";
import {away, boot, listen, reload, store} from "./store.js";
import Sidebar from "./layout/Sidebar.vue";
import TopBar from "./layout/TopBar.vue";
import StatusBar from "./layout/StatusBar.vue";
import Activity from "./layout/Activity.vue";
import SwitchCase from "./kit/SwitchCase.vue";
import Home from "./pages/Home.vue";
import Index from "./pages/Index.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import SearchPage from "./pages/SearchPage.vue";
import FilesPage from "./pages/FilesPage.vue";
import CommitPage from "./pages/CommitPage.vue";
import PluginPage from "./pages/PluginPage.vue";
import PluginsPage from "./pages/PluginsPage.vue";
import ServicesPage from "./pages/ServicesPage.vue";
import SkillsPage from "./pages/SkillsPage.vue";
import HubPage from "./pages/HubPage.vue";
import FilePage from "./pages/FilePage.vue";
import Reader from "./resource/Reader.vue";
import Lightbox from "./kit/Lightbox.vue";
import QuickMenu from "./layout/QuickMenu.vue";
import ChatWindow from "./layout/ChatWindow.vue";
import AwayCard from "./layout/AwayCard.vue";
import ProjectFlash from "./layout/ProjectFlash.vue";
import UpgradeBand from "./layout/UpgradeBand.vue";
import ThreadSkeleton from "./chat/ThreadSkeleton.vue";
import IdentityBand from "./layout/IdentityBand.vue";

const page = computed(() =>
    !route.value.page
        ? "home"
        : ["settings", "search", "files", "commit", "skills", "services", "plugins", "page", "hub", "file"].includes(route.value.page)
          ? route.value.page
          : "index"
);
const opened = computed(
    () => route.value.open || (route.value.n && page.value === "index" ? {type: route.value.page, n: route.value.n} : {type: "", n: 0})
);

const chatOnly = new URLSearchParams(location.search).has("chat");
const quick = ref(false);
let pointed = false;
const sawPointer = () => (pointed = true);
const sawKeyMove = (e) => {
    if (e.key === "Tab" || e.key.startsWith("Arrow")) pointed = false;
};
const quickMenu = ref(null);
function onSpace(e) {
    if (e.key !== " " || e.defaultPrevented) return;
    if (quick.value) {
        e.preventDefault();
        if (quickMenu.value) quickMenu.value.spaceAgain();
        return;
    }
    const el = document.activeElement;
    if (el && el !== document.body) {
        if (el.isContentEditable || el.matches("input,textarea,select")) return;
        if (el.matches("button,a[href],[role=button],[tabindex]") && !pointed) return;
    }
    e.preventDefault();
    quick.value = true;
}
function onWide(e) {
    if (e.key === "Escape" && store.wide) {
        store.wide = false;
        return;
    }
    if (e.key.toLowerCase() === "f" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        store.wide = !store.wide;
    }
}
window.addEventListener("pointerdown", sawPointer, true);
window.addEventListener("keydown", sawKeyMove, true);
window.addEventListener("keydown", onSpace);
window.addEventListener("keydown", onWide);
onUnmounted(() => {
    window.removeEventListener("pointerdown", sawPointer, true);
    window.removeEventListener("keydown", sawKeyMove, true);
    window.removeEventListener("keydown", onSpace);
    window.removeEventListener("keydown", onWide);
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
    <template v-if="!store.spec && !route.page">
        <main class="home-loading">
            <ThreadSkeleton />
        </main>
    </template>
    <template v-else-if="store.spec && chatOnly">
        <ChatWindow />
    </template>
    <template v-else-if="store.spec">
        <div class="viewer">
            <IdentityBand />
            <div :class="['app', {wide: store.wide}]">
                <div class="rail"><Sidebar /></div>
                <div class="main">
                    <div class="bar"><TopBar /></div>
                    <UpgradeBand />
                    <StatusBar />
                    <Transition name="page" mode="out-in">
                        <div :key="route.page || 'home'" class="page">
                            <SwitchCase :value="page">
                                <template #home><Home /></template>
                                <template #settings><SettingsPage /></template>
                                <template #search><SearchPage /></template>
                                <template #files><FilesPage /></template>
                                <template #commit><CommitPage /></template>
                                <template #skills><SkillsPage /></template>
                                <template #services><ServicesPage /></template>
                                <template #plugins><PluginsPage /></template>
                                <template #page><PluginPage /></template>
                                <template #hub><HubPage /></template>
                                <template #file><FilePage /></template>
                                <template #default><Index :type="route.page" /></template>
                            </SwitchCase>
                        </div>
                    </Transition>
                </div>
                <Transition name="column">
                    <Activity v-if="store.activity" />
                </Transition>
                <Reader :type="opened.type" :n="opened.n" />
                <Lightbox />
                <Transition name="quick">
                    <QuickMenu v-if="quick" ref="quickMenu" @close="quick = false" />
                </Transition>
                <template v-if="away.open">
                    <AwayCard />
                </template>
                <ProjectFlash />
                <ChatWindow v-if="store.detached && !store.extension.holding && !store.extension.pending" floating />
            </div>
        </div>
    </template>
</template>

<style scoped>
.home-loading {
    width: min(1080px, 100%);
    height: 100%;
    display: flex;
    padding: 48px 24px 96px;
}

.viewer {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.app {
    flex: 1;
    min-height: 0;
    display: flex;
}

.rail {
    display: flex;
    transition:
        margin-left 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.18s ease;
}

.bar {
    height: 48px;
    overflow: hidden;
    transition:
        height 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.18s ease;
}

.app.wide .rail {
    margin-left: -236px;
    opacity: 0;
    pointer-events: none;
}

.app.wide .bar {
    height: 0;
    opacity: 0;
    pointer-events: none;
}

.app.wide .page {
    margin: 0 6px 6px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
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
    transition:
        opacity 0.16s ease-in,
        transform 0.16s ease-in;
}

.page-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.column-enter-active,
.column-leave-active {
    transition:
        width 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.2s ease;
    overflow: hidden;
}

.column-enter-from,
.column-leave-to {
    width: 0;
    opacity: 0;
}

.quick-enter-active,
.quick-leave-active,
.quick-enter-active :deep(.quick-menu),
.quick-leave-active :deep(.quick-menu) {
    transition:
        opacity 0.18s ease,
        transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.quick-enter-from,
.quick-leave-to {
    opacity: 0;
}

.quick-enter-from :deep(.quick-menu),
.quick-leave-to :deep(.quick-menu) {
    transform: translate(-50%, -8px) scale(0.98);
}
</style>
