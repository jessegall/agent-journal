<script setup>
import {useWindowEvent} from "./composables/windowEvent.js";
import {chatOnly, narrow, soloView} from "./platform/view.js";
import DetachedWindows from "./layout/DetachedWindows.vue";
import WindowBar from "./layout/WindowBar.vue";
import {activityVisible, closeOverlays} from "./actions/panels.js";

import {computed, defineAsyncComponent, onMounted, onUnmounted, provide, ref, watch, watchEffect} from "vue";
import {route} from "./route.js";
import {project} from "./state/identity.js";
import {ui} from "./state/ui.js";
import {store} from "./state/store.js";
import {boot} from "./sync/boot.js";
import {usePolled, windowPolls} from "./sync/polled.js";
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
import BoardPage from "./pages/BoardPage.vue";
import OrganizationPage from "./pages/OrganizationPage.vue";
import ResourcesPage from "./pages/ResourcesPage.vue";
import SkillsPage from "./pages/SkillsPage.vue";
import AboutPage from "./pages/AboutPage.vue";
import HubPage from "./pages/HubPage.vue";
import FilePage from "./pages/FilePage.vue";
import Reader from "./resource/Reader.vue";
import Lightbox from "./kit/Lightbox.vue";
import Btn from "./kit/Btn.vue";
import EmptyState from "./kit/EmptyState.vue";
import QuickMenu from "./layout/QuickMenu.vue";
import ChatWindow from "./layout/ChatWindow.vue";
import ViewWindow from "./layout/ViewWindow.vue";
import AwayCard from "./layout/AwayCard.vue";
import SkillPanel from "./layout/SkillPanel.vue";
import PluginPagePanel from "./layout/PluginPagePanel.vue";
import ProjectFlash from "./layout/ProjectFlash.vue";
import FirstChoiceDialog from "./pages/FirstChoiceDialog.vue";
import {firstChoice, loadProfiles, unchosen} from "./composables/profiles.js";
import UpgradeBand from "./layout/UpgradeBand.vue";
import ThreadSkeleton from "./chat/ThreadSkeleton.vue";
import SuggestionLayer from "./chat/SuggestionLayer.vue";
import {desktopActs} from "./chat/suggestionActs.js";
import {useTurnLinks} from "./chat/turnLinks.js";
import {drawnWide, followFullscreen, switching} from "./platform/fullscreen.js";

const DemoBand = __DEMO__ ? defineAsyncComponent(() => import("../demo/DemoBand.vue")) : null;

windowPolls().forEach(usePolled);
const bootError = ref("");
let bootTimer = 0;
function startBoot() {
    bootError.value = "";
    bootTimer = setTimeout(() => (bootError.value = "The journal is taking too long to respond."), 10000);
    boot()
        .then(() => (bootError.value = ""))
        .catch((error) => (bootError.value = error.message || "The journal could not be reached."))
        .finally(() => clearTimeout(bootTimer));
}
const retryBoot = () => location.reload();
provide("suggestionActs", desktopActs(useTurnLinks().openRef));

const page = computed(() =>
    !route.value.page
        ? "home"
        : [
                "settings",
                "search",
                "files",
                "commit",
                "skills",
                "plugins",
                "page",
                "hub",
                "file",
                "kanban",
                "organization",
                "resources",
                "about",
            ].includes(route.value.page)
          ? route.value.page
          : store.spec && store.spec.types[route.value.page]
            ? "index"
            : "home"
);
const full = computed(() => page.value === "kanban");
let miniBefore = store.sideMini;
watch(
    full,
    (now) => {
        if (now) {
            miniBefore = store.sideMini;
            store.sideMini = true;
            return;
        }
        store.sideMini = miniBefore;
    },
    {immediate: true}
);
followFullscreen();
const opened = computed(() =>
    route.value.stack.length
        ? route.value.stack
        : [route.value.n && page.value === "index" ? {type: route.value.page, n: route.value.n} : {type: "", n: 0}]
);
watchEffect(() => {
    document.title = route.value.env ? `${project.value} · ${route.value.env}` : project.value;
});
const keyOf = (open) => `${open.type}:${open.n}${open.env ? `@${open.env}` : ""}`;
const layers = ref([]);
watch(
    opened,
    (now) => {
        const keys = now.map(keyOf);
        const leaving = layers.value.filter((layer) => layer.type && !keys.includes(layer.key)).map((layer) => ({...layer, leaving: true}));
        layers.value = [...now.map((open) => ({...open, key: keyOf(open), leaving: false})), ...leaving];
    },
    {immediate: true}
);
const visibleLayers = computed(() => layers.value.filter((layer) => !layer.leaving));
const depthOf = (layer) => (layer.leaving ? 0 : visibleLayers.value.length - 1 - visibleLayers.value.indexOf(layer));
const gone = (key) => (layers.value = layers.value.filter((layer) => !(layer.key === key && layer.leaving)));

const quick = ref(false);
const quickOpening = ref("menu");
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
    quickOpening.value = "menu";
    quick.value = true;
}
function onOpenFile(e) {
    if (e.key.toLowerCase() !== "o" || !(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (quick.value && quickMenu.value) return quickMenu.value.findInProject();
    quickOpening.value = "project";
    quick.value = true;
}
function escapeClaimed(e) {
    if (e.defaultPrevented || quick.value || document.querySelector(".menu-panel, .dialog, .tour-card")) return true;
    const el = document.activeElement;
    return !!el && (el.isContentEditable || (el.matches("input, textarea") && !!el.value));
}

function onWide(e) {
    if (e.key === "Escape" && store.wide && !escapeClaimed(e)) {
        store.wide = false;
        return;
    }
    if (e.key === "Enter" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        store.wide = !store.wide;
    }
}
useWindowEvent("pointerdown", sawPointer, true);
useWindowEvent("keydown", sawKeyMove, true);
useWindowEvent("keydown", onSpace);
useWindowEvent("keydown", onWide);
useWindowEvent("keydown", onOpenFile);

watch(unchosen, (empty) => empty && loadProfiles(), {immediate: true});
onMounted(startBoot);
onUnmounted(() => clearTimeout(bootTimer));
watch(() => `${route.value.env}/${route.value.page}/${route.value.n}`, closeOverlays);
watch(
    () => route.value.env,
    (now, before) => before && now !== before && location.reload()
);
</script>

<template>
    <template v-if="bootError && !store.booted">
        <main class="home-loading">
            <EmptyState>
                {{ bootError }}
                <Btn small @click="retryBoot">Retry</Btn>
            </EmptyState>
        </main>
    </template>
    <template v-else-if="!store.spec && !route.page">
        <main class="home-loading">
            <ThreadSkeleton />
        </main>
    </template>
    <template v-else-if="store.spec && chatOnly">
        <ChatWindow />
    </template>
    <template v-else-if="store.spec && soloView">
        <ViewWindow />
    </template>
    <template v-else-if="store.spec">
        <div class="viewer">
            <template v-if="DemoBand">
                <DemoBand />
            </template>
            <WindowBar />
            <div :class="['app', {wide: drawnWide, mini: store.sideMini, full, switching, narrow, 'side-open': narrow && store.sideOpen}]">
                <div class="rail"><Sidebar /></div>
                <div class="main">
                    <div class="bar"><TopBar /></div>
                    <UpgradeBand />
                    <template v-if="!full">
                        <StatusBar />
                    </template>
                    <Transition name="page" mode="out-in">
                        <div :key="route.page || 'home'" class="page">
                            <SwitchCase :value="page">
                                <template #home><Home /></template>
                                <template #settings><SettingsPage /></template>
                                <template #search><SearchPage /></template>
                                <template #files><FilesPage /></template>
                                <template #commit><CommitPage /></template>
                                <template #skills><SkillsPage /></template>
                                <template #about><AboutPage /></template>
                                <template #plugins><PluginsPage /></template>
                                <template #kanban><BoardPage /></template>
                                <template #organization><OrganizationPage /></template>
                                <template #resources><ResourcesPage /></template>
                                <template #page><PluginPage /></template>
                                <template #hub><HubPage /></template>
                                <template #file><FilePage /></template>
                                <template #default><Index :type="route.page" /></template>
                            </SwitchCase>
                        </div>
                    </Transition>
                </div>
                <Transition name="column">
                    <Activity v-if="activityVisible() && !drawnWide && !full" />
                </Transition>
                <template v-if="narrow && (store.sideOpen || store.activityOpen)">
                    <div class="narrow-scrim" @click="closeOverlays" />
                </template>
                <template v-for="layer in layers" :key="layer.key">
                    <Reader
                        :type="layer.type"
                        :n="layer.n"
                        :env="layer.env"
                        :depth="depthOf(layer)"
                        :over="layer.leaving || visibleLayers.indexOf(layer) > 0"
                        :leaving="layer.leaving"
                        @gone="gone(layer.key)"
                    />
                </template>
                <Lightbox />
                <Transition name="quick">
                    <QuickMenu v-if="quick" ref="quickMenu" :opening="quickOpening" @close="quick = false" />
                </Transition>
                <template v-if="ui.away.open">
                    <AwayCard />
                </template>
                <template v-if="store.skill">
                    <SkillPanel />
                </template>
                <template v-if="store.pluginPage">
                    <PluginPagePanel />
                </template>
                <ProjectFlash />
                <template v-if="firstChoice">
                    <FirstChoiceDialog />
                </template>
                <DetachedWindows />
                <SuggestionLayer />
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
    position: relative;
    z-index: 5;
    display: flex;
    transition:
        margin-left 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.18s ease;
}

.bar {
    height: 48px;
    transition:
        height 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.18s ease;
}

.app.wide .rail {
    margin-left: -236px;
    opacity: 0;
    pointer-events: none;
}

.app.wide.mini .rail {
    margin-left: -56px;
}

.app.wide .bar {
    height: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
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

@media (prefers-reduced-motion: no-preference) {
    .app :deep(:is(.pane-body, .float-body)) {
        transition: opacity 0.12s ease-out;
    }

    .app.switching :deep(:is(.pane-body, .float-body)) {
        opacity: 0;
        transition: opacity 0.08s ease-in;
    }
}

.narrow-scrim {
    position: fixed;
    inset: 0;
    z-index: 55;
    background: rgba(0, 0, 0, 0.5);
}

.app.narrow .rail {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 60;
    margin-left: 0;
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-100%);
    transition: transform 0.22s var(--ease);
}

.app.narrow.side-open .rail {
    transform: none;
    box-shadow: 12px 0 32px rgba(0, 0, 0, 0.45);
}

.app.narrow :deep(.activity-dock) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 60;
    width: min(340px, 88vw);
    box-shadow: -12px 0 32px rgba(0, 0, 0, 0.45);
}

@media (prefers-reduced-motion: reduce) {
    .app.narrow .rail {
        transition: none;
    }
}
</style>
