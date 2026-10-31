<script setup>
import {onUnmounted} from "vue";
import {followEvents} from "./windowCatalogue.js";
import {readSession, startWindows} from "./startup.js";
import PaneStage from "./PaneStage.vue";
import {paneLayout} from "./paneLayout.js";

const props = defineProps({
    environment: {type: String, required: true},
    layout: {type: Array, required: true},
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
    session: {type: Function, default: readSession},
});

const {catalogue, subscriptions, shellLine, prompts, stop, face} = startWindows(props);

// a fixed list of windows (the windows query) is one row of panes in memory, never saved
const row = (names) => (names.length < 2 ? {tabs: names, active: names[0]} : {dir: "row", r: 1 / names.length, a: {tabs: [names[0]], active: names[0]}, b: row(names.slice(1))});
const fixed = () =>
    paneLayout({
        saved: async () => null,
        defaults: async () => row(props.layout),
        save: async () => ({ok: true, version: 1}),
        tab: {read: () => null, write: () => {}},
        entry: (name) => catalogue.window(name),
    });
const store = fixed();

onUnmounted(stop);

store.load({environment: props.environment, person: 0, suite: "", page: "fixed", driver: ""});
</script>

<template>
    <div class="window-shell" :data-face="face">
        <PaneStage :face="face" :store="store" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :prompts="prompts" :shell-read="shellLine" />
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
