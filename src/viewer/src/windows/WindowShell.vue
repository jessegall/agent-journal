<script setup>
import {onUnmounted} from "vue";
import {AllowancePrompts} from "./allowancePrompts.js";
import {lineResult} from "./windowContext.js";
import {WindowCatalogue, fetchWindowCatalogue, followEvents} from "./windowCatalogue.js";
import PaneStage from "./PaneStage.vue";
import {useHomeLayout} from "./homeLayout.js";
import {paneLayout} from "./paneLayout.js";
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

const stop = props.events(props.environment, async (event) => {
    await catalogue.heard(event);
    home?.heard(event);
    subscriptions.dispatch(event);
});
onUnmounted(stop);

catalogue.load();
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
