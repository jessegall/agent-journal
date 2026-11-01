<script setup>
import {onMounted, onUnmounted, ref, watchEffect} from "vue";
import Breadcrumb from "../shell/Breadcrumb.vue";
import SidebarPages from "../shell/SidebarPages.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import {useViewTab} from "../composables/viewTabs.js";
import {followEvents} from "../windows/windowCatalogue.js";
import {startWindows} from "../windows/startup.js";
import WindowPane from "../windows/WindowPane.vue";

const props = defineProps({
    environment: {type: String, required: true},
    view: {type: String, required: true},
    float: {type: Number, required: true},
    // a window as a page of its own, as version 4 had a page per feature: the sidebar to move between them, a breadcrumb, no dock back
    standalone: Boolean,
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const {catalogue, subscriptions, shellLine, prompts, stop, face} = startWindows(props);
const {dock} = useViewTab(props.float);
const environments = ref([]);
onMounted(async () => {
    if (!props.standalone) return;
    const answer = await shellLine(["environment", "list"]);
    environments.value = answer.ok ? answer.value.rows : [];
});
onUnmounted(stop);
watchEffect(() => {
    const entry = catalogue.window(props.view);
    if (entry) document.title = `${entry.title} · ${props.environment}`;
});
</script>

<template>
    <div :class="['view-window', {standalone}]" :data-face="face" :data-page="standalone ? view : undefined">
        <template v-if="catalogue.windows.value.length">
            <template v-if="standalone">
                <SidebarPages :windows="catalogue.windows.value" :environments="environments" :current="environment" :open="view" />
            </template>
            <div class="view-window-main">
                <template v-if="standalone">
                    <Breadcrumb :environment="environment" :page="catalogue.window(view)?.title || view" />
                </template>
                <template v-else>
                    <div class="view-window-bar">
                        <MarkIcon :name="catalogue.window(view)?.icon || 'window'" />
                        <span class="view-window-title">{{ catalogue.window(view)?.title || view }}</span>
                        <span class="view-window-env">{{ environment }}</span>
                        <span class="view-window-space" />
                        <Btn small @click="dock()">
                            <Icon name="dock" :size="13" />
                            Dock back
                        </Btn>
                    </div>
                </template>
                <WindowPane :name="view" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :prompts="prompts" :shell-read="shellLine" />
            </div>
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

.view-window.standalone {
    flex-direction: row;
}

.view-window-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.view-window.standalone :deep(.window) {
    box-sizing: border-box;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 20px;
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

.view-window-env {
    color: var(--text-4);
}

.view-window-space {
    flex: 1;
}
</style>
