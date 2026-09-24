<script setup>
import {computed, watchEffect} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import HomeView from "../pages/HomeView.vue";
import {useHomeViews} from "../composables/homeViews.js";
import {useViewTab} from "../composables/viewTabs.js";
import {framed, soloFloat, soloView} from "../platform/view.js";
import {dragShell, tellShell} from "../platform/extension.js";
import {route} from "../route.js";

const {views} = useHomeViews();
const view = computed(() => views.value[soloView] || null);
const {dock} = useViewTab(soloFloat);
if (framed) tellShell("hello");
watchEffect(() => {
    if (view.value) document.title = `${view.value.title} · ${route.value.env}`;
});
</script>

<template>
    <div class="view-window">
        <template v-if="view">
            <div :class="['view-window-bar', {framed}]" @pointerdown="framed && dragShell($event)">
                <Icon :name="view.icon" :size="13" />
                <span class="view-window-title">{{ view.title }}</span>
                <span class="view-window-env">{{ route.env }}</span>
                <span class="view-window-space" />
                <Btn small @click="framed ? tellShell('dock') : dock()">
                    <Icon name="dock" :size="13" />
                    Dock back
                </Btn>
                <template v-if="framed">
                    <Btn small title="Close" @click="tellShell('close')">
                        <Icon name="x" :size="13" />
                    </Btn>
                </template>
            </div>
            <HomeView :view="soloView" />
        </template>
        <template v-else>
            <p class="view-window-none">This view does not exist.</p>
        </template>
    </div>
</template>

<style scoped>
.view-window {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
}

.view-window-bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 10px 0 14px;
    border-bottom: 1px solid var(--border);
    background: #111215;
    font-size: 12.5px;
}

.view-window-bar.framed {
    cursor: grab;
}

.view-window-env {
    color: var(--text-4);
}

.view-window-space {
    flex: 1;
}

.view-window-none {
    margin: auto;
    color: var(--text-3);
}
</style>
