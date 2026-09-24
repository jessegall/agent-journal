<script setup>
import {computed, ref} from "vue";
import FloatWindow from "../kit/FloatWindow.vue";
import Toast from "../kit/Toast.vue";
import HomeView from "../pages/HomeView.vue";
import PaneMenu from "../pages/PaneMenu.vue";
import {useHomeViews} from "../composables/homeViews.js";
import {useDetached} from "../composables/detached.js";
import {route} from "../route.js";
import {schemeColors, windowSchemes} from "../domain/schemes.js";
import {usePaneLayout} from "../composables/paneLayout.js";

const {views} = useHomeViews();
const {drawn, landing, move, size, tune, front, close, dock, sendAway, bringBack} = useDetached();
const menu = ref(null);
const toast = ref(null);
const windows = computed(() =>
    drawn.value.filter((f) => views.value[f.view]).map((f) => ({...f, ...(landing.value[f.id] || {}), landing: !!landing.value[f.id]}))
);
const menuFloat = computed(() => menu.value && drawn.value.find((f) => f.id === menu.value.id));
const {layout} = usePaneLayout();
const menuSchemes = computed(() => (menuFloat.value ? windowSchemes(menuFloat.value.scheme, layout.value.scheme) : []));
const menuFlushable = computed(() => !!(menuFloat.value && views.value[menuFloat.value.view].canFlush));
const menuAll = computed(() => (menuFloat.value && views.value[menuFloat.value.view].all) || null);

function toggleMenu(e, id) {
    menu.value = menu.value && menu.value.id === id ? null : {id, anchor: e.currentTarget};
}

function away(id) {
    const f = sendAway(id, route.value.env);
    if (f) toast.value = {text: `${views.value[f.view].title} opened in another tab`, label: "Bring back", action: () => bringBack(id)};
}
</script>

<template>
    <TransitionGroup name="float" tag="div" class="detached">
        <template v-for="f in windows" :key="f.id">
            <FloatWindow
                :x="f.x"
                :y="f.y"
                :w="f.w"
                :h="f.h"
                :title="views[f.view].title"
                :icon="views[f.view].icon"
                :landing="f.landing"
                :colors="schemeColors(f.scheme, layout.scheme)"
                @front="front(f.id)"
                @move="(to) => move(f.id, to)"
                @size="(to) => size(f.id, to)"
                @dock="dock(f.id)"
                @menu="(e) => toggleMenu(e, f.id)"
            >
                <HomeView :view="f.view" :flush="!!f.flush" />
            </FloatWindow>
        </template>
    </TransitionGroup>
    <template v-if="menuFloat">
        <PaneMenu
            :pane="menu.id"
            :anchor="menu.anchor"
            floating
            :all="menuAll"
            :schemes="menuSchemes"
            :flushable="menuFlushable"
            :flush="!!menuFloat.flush"
            @flush="(id, flush) => tune(id, {flush})"
            @scheme="(id, scheme) => tune(id, {scheme})"
            @close="menu = null"
            @dock="dock"
            @away="away"
            @unfloat="close"
        />
    </template>
    <Toast :toast="toast" @done="toast = null" />
</template>

<style scoped>
.detached {
    position: fixed;
    inset: 0;
    z-index: 30;
    pointer-events: none;
}

.detached > .float-window {
    pointer-events: auto;
}

.float-enter-active,
.float-leave-active {
    transition:
        opacity 0.22s ease,
        transform 0.22s var(--ease);
}

.float-enter-from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
}

.float-leave-to {
    opacity: 0;
    transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
    .float-enter-active,
    .float-leave-active {
        transition: none;
    }
}
</style>
