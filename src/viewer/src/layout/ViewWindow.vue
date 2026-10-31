<script setup>
import {onUnmounted, watchEffect} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {useViewTab} from "../composables/viewTabs.js";
import {followEvents} from "../windows/windowCatalogue.js";
import {startWindows} from "../windows/startup.js";
import WindowPane from "../windows/WindowPane.vue";

const props = defineProps({
    environment: {type: String, required: true},
    view: {type: String, required: true},
    float: {type: Number, required: true},
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const {catalogue, subscriptions, shellLine, prompts, stop} = startWindows(props);
const {dock} = useViewTab(props.float);
onUnmounted(stop);
watchEffect(() => {
    const entry = catalogue.window(props.view);
    if (entry) document.title = `${entry.title} · ${props.environment}`;
});
</script>

<template>
    <div class="view-window">
        <template v-if="catalogue.windows.value.length">
            <div class="view-window-bar">
                <Icon :name="catalogue.window(view)?.icon || 'window'" :size="13" />
                <span class="view-window-title">{{ catalogue.window(view)?.title || view }}</span>
                <span class="view-window-env">{{ environment }}</span>
                <span class="view-window-space" />
                <Btn small @click="dock()">
                    <Icon name="dock" :size="13" />
                    Dock back
                </Btn>
            </div>
            <WindowPane :name="view" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :prompts="prompts" :shell-read="shellLine" />
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

.view-window-env {
    color: var(--text-4);
}

.view-window-space {
    flex: 1;
}
</style>
