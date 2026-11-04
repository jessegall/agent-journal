<script setup>
import {computed, inject, onUnmounted} from "vue";
import FrameWindow from "./FrameWindow.vue";
import PageWindow from "./PageWindow.vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {WindowSubscriptions} from "./windowSubscriptions.js";

// the body file a module gives a chat mark or a docked item, loaded through the window host: as a component for a module the journal ships or
// the person trusts, and in a sandboxed frame for any other
const props = defineProps({declaration: {type: Object, required: true}, row: {type: Object, default: null}, head: {type: Object, default: null}, environment: {type: String, default: ""}});
const ANY_EVENT = "*.*";
const host = inject(WINDOW_CONTEXT, null);
const subscriptions = new WindowSubscriptions();
// the page's event stream feeds the follows of the window that draws the body, which hands each event on to the body's own
const stopHearing = host?.subscriptions?.follow(`body of ${props.declaration.type}`, [ANY_EVENT], (event) => subscriptions.dispatch(event));
onUnmounted(() => stopHearing?.());
// the body reads in the environment of the window that draws it
const env = host?.environment ?? props.environment;
const permissions = {reads: [], runs: [], missing: [], ask: async () => true};
const asComponent = computed(() => Boolean(props.declaration.shipped || props.declaration.trusted));
const entry = computed(() => ({
    // a body reads as the window its type names, which the module declares with the reads the body needs
    name: props.declaration.type,
    entry_url: props.declaration.body_url,
    // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
    events: asComponent.value ? [ANY_EVENT] : (props.declaration.events ?? []),
    options: [],
}));
</script>

<template>
    <template v-if="asComponent">
        <PageWindow :entry="entry" :subscriptions="subscriptions" :environment="env" :permissions="permissions" :options="{row, head}" />
    </template>
    <template v-else>
        <FrameWindow :entry="entry" :subscriptions="subscriptions" :environment="env" :permissions="permissions" :options="{row}" />
    </template>
</template>
