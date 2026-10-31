<script setup>
import {computed, onUnmounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {AllowancePrompts} from "./allowancePrompts.js";
import {lineResult} from "./windowContext.js";
import {WindowCatalogue, fetchWindowCatalogue, followEvents} from "./windowCatalogue.js";
import WindowPane from "./WindowPane.vue";
import {useHomeLayout} from "./homeLayout.js";
import {leaves} from "../domain/panes.js";
import {WindowSubscriptions} from "./windowSubscriptions.js";

const SHELL_WINDOW = "viewer.shell";
const props = defineProps({
    environment: {type: String, required: true},
    layout: {type: Array, default: null},
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const catalogue = props.catalogue || new WindowCatalogue(() => fetchWindowCatalogue(props.environment));
const subscriptions = new WindowSubscriptions();
const shellLine = (line) => lineResult(SHELL_WINDOW, line, props.environment);
const prompts = new AllowancePrompts(shellLine);
const listed = ref(props.layout ? [...props.layout] : []);
const home = props.layout ? null : useHomeLayout(props.environment, shellLine);
const panes = computed(() => {
    const layout = home?.layout.value;
    if (!layout) return listed.value.map((name, index) => ({id: index, tabs: [name], active: name}));
    return leaves(layout.tree).map((id) => ({id, ...layout.panes[id]}));
});
const unopened = computed(() => catalogue.windows.value.filter((window) => !panes.value.some((pane) => pane.tabs.includes(window.name))));

function choose(pane, tab) {
    const layout = home.layout.value;
    home.keep({...layout, panes: {...layout.panes, [pane.id]: {...layout.panes[pane.id], active: tab}}});
}

function open(name) {
    if (!home) return listed.value.push(name);
    const layout = home.layout.value;
    const first = panes.value[0];
    home.keep({...layout, panes: {...layout.panes, [first.id]: {...layout.panes[first.id], tabs: [...first.tabs, name], active: name}}});
}

const stop = props.events(props.environment, async (event) => {
    await catalogue.heard(event);
    home?.heard(event);
    subscriptions.dispatch(event);
});
onUnmounted(stop);

catalogue.load();
home?.load();
</script>

<template>
    <div class="window-shell">
        <nav class="window-shell-menu">
            <template v-for="entry in unopened" :key="entry.name">
                <Btn @click="open(entry.name)">Open {{ entry.title }}</Btn>
            </template>
        </nav>
        <div class="window-shell-panes">
            <template v-for="pane in panes" :key="pane.id">
                <div class="window-shell-pane">
                    <template v-if="pane.tabs.length > 1">
                        <nav class="window-shell-tabs">
                            <template v-for="tab in pane.tabs" :key="tab">
                                <button type="button" :class="['window-shell-tab', {active: tab === pane.active}]" @click="choose(pane, tab)">
                                    {{ catalogue.window(tab)?.title || tab }}
                                </button>
                            </template>
                        </nav>
                    </template>
                    <WindowPane
                        :key="pane.active"
                        :name="pane.active"
                        :catalogue="catalogue"
                        :subscriptions="subscriptions"
                        :environment="environment"
                        :prompts="prompts"
                        :shell-read="shellLine"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.window-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}

.window-shell-menu {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--line);
}

.window-shell-panes {
    display: grid;
    flex: 1;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: 1px;
    background: var(--line);
}

.window-shell-pane {
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--bg);
}

.window-shell-pane > :deep(.window) {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 16px;
}

.window-shell-tabs {
    display: flex;
    gap: 2px;
    padding: 6px 8px 0;
    border-bottom: 1px solid var(--line);
}

.window-shell-tab {
    padding: 6px 10px;
    border: 0;
    border-radius: 6px 6px 0 0;
    color: var(--text-3);
    background: transparent;
    font: inherit;
    cursor: pointer;
}

.window-shell-tab.active {
    color: var(--text);
    background: var(--line);
}
</style>
