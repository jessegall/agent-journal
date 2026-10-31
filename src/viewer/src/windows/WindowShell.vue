<script setup>
import {onUnmounted} from "vue";
import {followEvents} from "./windowCatalogue.js";
import {startWindows} from "./startup.js";
import PaneStage from "./PaneStage.vue";
import {useHomeLayout} from "./homeLayout.js";
import {paneLayout} from "./paneLayout.js";

const props = defineProps({
    environment: {type: String, required: true},
    layout: {type: Array, default: null},
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const {catalogue, subscriptions, shellLine, prompts, listeners, stop} = startWindows(props);
const home = props.layout ? null : useHomeLayout(props.environment, shellLine, catalogue);

// a fixed list of windows is one row of panes in memory, never saved
const row = (names) => (names.length < 2 ? {tabs: names, active: names[0]} : {dir: "row", r: 1 / names.length, a: {tabs: [names[0]], active: names[0]}, b: row(names.slice(1))});
const fixed = () =>
    paneLayout({
        saved: async () => null,
        defaults: async () => row(props.layout),
        save: async () => ({ok: true, version: 1}),
        tab: {read: () => null, write: () => {}},
        entry: (name) => catalogue.window(name),
    });
const store = home ? home.store : fixed();

onUnmounted(stop);

if (home) listeners.push(home.heard);
if (home) home.load();
else store.load({environment: props.environment, person: 0, suite: "", page: "fixed", driver: ""});
</script>

<template>
    <div class="window-shell">
        <PaneStage :store="store" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :prompts="prompts" :shell-read="shellLine" />
    </div>
</template>

<style scoped>
.window-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}
</style>
