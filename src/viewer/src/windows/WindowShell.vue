<script setup>
import {computed, onUnmounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {AllowancePrompts} from "./allowancePrompts.js";
import {lineResult} from "./windowContext.js";
import {WindowCatalogue, fetchWindowCatalogue, followEvents} from "./windowCatalogue.js";
import WindowPane from "./WindowPane.vue";
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
const panes = ref(props.layout ? [...props.layout] : []);
const unopened = computed(() => catalogue.windows.value.filter((window) => !panes.value.includes(window.name)));

const stop = props.events(props.environment, async (event) => {
    await catalogue.heard(event);
    subscriptions.dispatch(event);
});
onUnmounted(stop);

catalogue.load().then(() => {
    if (!props.layout) panes.value = catalogue.windows.value.map((window) => window.name);
});
</script>

<template>
    <div class="window-shell">
        <nav class="window-shell-menu">
            <template v-for="entry in unopened" :key="entry.name">
                <Btn @click="panes.push(entry.name)">Open {{ entry.title }}</Btn>
            </template>
        </nav>
        <div class="window-shell-panes">
            <template v-for="name in panes" :key="name">
                <WindowPane
                    :name="name"
                    :catalogue="catalogue"
                    :subscriptions="subscriptions"
                    :environment="environment"
                    :prompts="prompts"
                    :shell-read="shellLine"
                />
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

.window-shell-panes > :deep(.window) {
    position: relative;
    min-height: 0;
    overflow: auto;
    padding: 16px;
    background: var(--bg);
}
</style>
