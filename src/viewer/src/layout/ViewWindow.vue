<script setup>
import {onMounted, onUnmounted, provide, ref, watchEffect} from "vue";
import {INSPECTOR_HOST} from "../windows/windowContext.js";
import Breadcrumb from "../shell/Breadcrumb.vue";
import SidebarPages from "../shell/SidebarPages.vue";
import Btn from "../kit/Btn.vue";
import ButtonAllowance from "../windows/ButtonAllowance.vue";
import Icon from "../kit/Icon.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import {usageRead} from "../../kit/useUsage.js";
import {useViewTab} from "../composables/viewTabs.js";
import {followEvents} from "../windows/windowCatalogue.js";
import {startWindows} from "../windows/startup.js";
import WindowPane from "../windows/WindowPane.vue";
import ResourcePanel from "../resource/ResourcePanel.vue";

const props = defineProps({
    environment: {type: String, required: true},
    view: {type: String, required: true},
    float: {type: Number, required: true},
    // a window as a page of its own, as version 4 had a page per feature: the sidebar to move between them, a breadcrumb, no dock back
    standalone: Boolean,
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const {catalogue, subscriptions, shellLine, prompts, stop, face, journalVersion} = startWindows(props);
provide(INSPECTOR_HOST, {catalogue, subscriptions, environment: props.environment, prompts, shellRead: shellLine});
const {dock} = useViewTab(props.float);
// the page shown: a click on another page in the sidebar changes only this, so the sidebar, the breadcrumb, the panel, the event stream and the
// catalogue stay as they are and the window of the page alone is drawn anew; the address and the back button follow it
const page = ref(props.view);
const pageAddress = (name) => `?environment=${encodeURIComponent(props.environment)}&page=${encodeURIComponent(name)}`;

function navigate(name) {
    history.pushState(null, "", pageAddress(name));
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    page.value = name;
}

function followHistory() {
    const named = new URLSearchParams(location.search).get("page");
    if (named) page.value = named;
}
const environments = ref([]);
const mainAgent = ref(null);
const agentAsked = ref(false);
onMounted(async () => {
    const usage = await usageRead(props.environment, () => shellLine(["usage", "show"]));
    mainAgent.value = usage.ok ? (usage.value.agents.find((row) => row.role === "main")?.id ?? null) : null;
    agentAsked.value = true;
    if (!props.standalone) return;
    const answer = await shellLine(["environment", "list"]);
    environments.value = answer.ok ? answer.value.rows : [];
});
if (props.standalone) window.addEventListener("popstate", followHistory);
onUnmounted(() => {
    window.removeEventListener("popstate", followHistory);
    stop();
});
watchEffect(() => {
    const entry = catalogue.window(page.value);
    if (entry) document.title = `${entry.title} · ${props.environment}`;
});
</script>

<template>
    <div :class="['view-window', {standalone}]" :data-face="face" :data-page="standalone ? page : undefined">
        <ButtonAllowance :prompts="prompts" />
        <template v-if="catalogue.offered.length">
            <template v-if="standalone">
                <SidebarPages :journal-version="journalVersion" :windows="catalogue.pages.value" :environments="environments" :current="environment" :open="page" :navigate="navigate" />
            </template>
            <div class="view-window-main">
                <template v-if="standalone">
                    <Breadcrumb :environment="environment" :page="catalogue.window(page)?.title || page" />
                </template>
                <template v-else>
                    <div class="view-window-bar">
                        <MarkIcon :name="catalogue.window(page)?.icon || 'window'" />
                        <span class="view-window-title">{{ catalogue.window(page)?.title || page }}</span>
                        <span class="view-window-env">{{ environment }}</span>
                        <span class="view-window-space" />
                        <Btn small @click="dock()">
                            <Icon name="dock" :size="13" />
                            Dock back
                        </Btn>
                    </div>
                </template>
                <template v-if="agentAsked">
                    <WindowPane :key="page" :name="page" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :agent="mainAgent" :prompts="prompts" :shell-read="shellLine" />
                </template>
            </div>
            <ResourcePanel :read="shellLine" :catalogue="catalogue" :environment="environment" />
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

<style scoped>
@media (max-width: 700px) { .view-window.standalone :deep(.sidebar) { display: none; } }
</style>
