<script setup>
import {computed, onMounted, onUnmounted, ref, watchEffect} from "vue";
import Breadcrumb from "../shell/Breadcrumb.vue";
import SidebarPages from "../shell/SidebarPages.vue";
import {followEvents} from "../windows/windowCatalogue.js";
import {startWindows} from "../windows/startup.js";
import WindowPane from "../windows/WindowPane.vue";

// one window as a page of its own, as version 4 had a page per feature: the sidebar to move between them, and the window itself
// filling the rest, the same component the home page draws in a pane
const props = defineProps({
    environment: {type: String, required: true},
    window: {type: String, required: true},
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const {catalogue, subscriptions, shellLine, prompts, stop, face} = startWindows(props);
const environments = ref([]);
const entry = computed(() => catalogue.window(props.window));
onMounted(async () => {
    const answer = await shellLine(["environment", "list"]);
    environments.value = answer.ok ? answer.value.rows : [];
});
onUnmounted(stop);
watchEffect(() => {
    if (entry.value) document.title = `${entry.value.title} · ${props.environment}`;
});
</script>

<template>
    <div class="window-page" :data-face="face" :data-page="window">
        <template v-if="catalogue.windows.value.length">
            <SidebarPages :windows="catalogue.windows.value" :environments="environments" :current="environment" :open="window" />
            <div class="window-page-main">
                <Breadcrumb :environment="environment" :page="entry?.title || window" />
                <div class="window-page-body">
                    <WindowPane :name="window" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :prompts="prompts" :shell-read="shellLine" />
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.window-page {
    display: flex;
    height: 100vh;
    background: var(--bg);
}

.window-page-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.window-page-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    padding: 16px;
}
</style>
