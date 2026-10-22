<script setup>
import {reloadWhenFree} from "./platform/busyField.js";
import {useWindowEvent} from "./composables/windowEvent.js";
import {chatOnly, narrow, soloView} from "./platform/view.js";
import WindowBar from "./layout/WindowBar.vue";
import RestartDialog from "./layout/RestartDialog.vue";
import {activityVisible, closeOverlays} from "./actions/panels.js";

import {computed, onMounted, onUnmounted, ref, watch, watchEffect} from "vue";
import {PAGES, route} from "./route.js";
import {project} from "./state/identity.js";
import {store} from "./state/store.js";
import {meta} from "./domain/tables.js";
import {OVER_HOME} from "./domain/navigation.js";
import {boot} from "./sync/boot.js";
import {usePolled, windowPolls} from "./sync/polled.js";
import Sidebar from "./layout/Sidebar.vue";
import TopBar from "./layout/TopBar.vue";
import StatusBar from "./layout/StatusBar.vue";
import Activity from "./layout/Activity.vue";
import Reader from "./resource/Reader.vue";
import Btn from "./kit/Btn.vue";
import EmptyState from "./kit/EmptyState.vue";
import QuickMenu from "./layout/QuickMenu.vue";
import ChatWindow from "./layout/ChatWindow.vue";
import ViewWindow from "./layout/ViewWindow.vue";
import UpdateCover from "./layout/UpdateCover.vue";
import UpgradeBand from "./layout/UpgradeBand.vue";
import BlockedNotice from "./layout/BlockedNotice.vue";
import {drawnWide, followFullscreen, switching} from "./platform/fullscreen.js";
import AppOverlays from "./AppOverlays.vue";
import AppPages from "./AppPages.vue";

windowPolls().forEach(usePolled);
const bootError = ref("");
let bootTimer = 0;
const TOO_LONG = "The journal is taking too long to respond.";
function startBoot() {
    bootError.value = "";
    bootTimer = setTimeout(() => (bootError.value = TOO_LONG), 60000);
    boot()
        .then(() => (bootError.value = ""))
        .catch(
            (error) => (bootError.value = error.name === "TimeoutError" ? TOO_LONG : error.message || "The journal could not be reached.")
        )
        .finally(() => clearTimeout(bootTimer));
}
const retryBoot = () => location.reload();

const page = computed(() =>
    !route.value.page || OVER_HOME.includes(route.value.page)
        ? "home"
        : PAGES.includes(route.value.page)
          ? route.value.page
          : meta(route.value.page)
            ? "index"
            : "home"
);
followFullscreen();
const opened = computed(() =>
    route.value.stack.length
        ? route.value.stack
        : [route.value.n && page.value === "index" ? {table: route.value.page, id: route.value.n} : {table: "", id: 0}]
);
watchEffect(() => {
    document.title = route.value.env ? `${project.value} · ${route.value.env}` : project.value;
});
const keyOf = (open) => `${open.table}:${open.id}${open.env ? `@${open.env}` : ""}`;
const layers = ref([]);
watch(
    opened,
    (now) => {
        const keys = now.map(keyOf);
        const leaving = layers.value.filter((layer) => layer.table && !keys.includes(layer.key)).map((layer) => ({...layer, leaving: true}));
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
    const el = document.activeElement;
    if (el && el !== document.body && (el.isContentEditable || el.matches("input,textarea,select"))) return;
    if (quick.value) {
        e.preventDefault();
        if (quickMenu.value) quickMenu.value.spaceAgain();
        return;
    }
    if (el && el !== document.body && el.matches("button,a[href],[role=button],[tabindex]") && !pointed) return;
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

onMounted(startBoot);
onUnmounted(() => clearTimeout(bootTimer));
watch(() => `${route.value.env}/${route.value.page}/${route.value.n}`, closeOverlays);
watch(
    () => route.value.env,
    (now, before) => before && now !== before && reloadWhenFree(window)
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
        <main class="home-loading" />
    </template>
    <template v-else-if="store.spec && chatOnly">
        <ChatWindow />
    </template>
    <template v-else-if="store.spec && soloView">
        <ViewWindow />
    </template>
    <template v-else-if="store.spec">
        <div class="viewer">
            <WindowBar />
            <div :class="['app', {wide: drawnWide, mini: store.sideMini, switching, narrow, 'side-open': narrow && store.sideOpen}]">
                <div class="rail"><Sidebar /></div>
                <div class="main">
                    <div class="bar"><TopBar /></div>
                    <UpgradeBand />
                    <UpdateCover />
                    <BlockedNotice />
                    <StatusBar />
                    <Transition name="page" mode="out-in">
                        <div :key="page === 'home' ? 'home' : route.page" class="page">
                            <AppPages :page="page" />
                        </div>
                    </Transition>
                </div>
                <Transition name="column">
                    <Activity v-if="activityVisible() && !drawnWide" />
                </Transition>
                <template v-if="narrow && (store.sideOpen || store.activityOpen)">
                    <div class="narrow-scrim" @click="closeOverlays" />
                </template>
                <template v-for="layer in layers" :key="layer.key">
                    <Reader
                        :table="layer.table"
                        :id="layer.id"
                        :env="layer.env"
                        :depth="depthOf(layer)"
                        :over="layer.leaving || visibleLayers.indexOf(layer) > 0"
                        :leaving="layer.leaving"
                        @gone="gone(layer.key)"
                    />
                </template>
                <Transition name="quick">
                    <QuickMenu v-if="quick" ref="quickMenu" :opening="quickOpening" @close="quick = false" />
                </Transition>
                <AppOverlays :home="page === 'home'" />
                <RestartDialog />
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
