<script setup>
import {computed, inject} from "vue";
import FrameWindow from "./FrameWindow.vue";
import PageWindow from "./PageWindow.vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {WindowSubscriptions} from "./windowSubscriptions.js";

// the body file a module gives a chat mark or a docked item, loaded through the window host: as a component for a module the journal ships or
// the person trusts, and in a sandboxed frame for any other
const props = defineProps({declaration: {type: Object, required: true}, row: {type: Object, default: null}});
const subscriptions = new WindowSubscriptions();
// the body reads in the environment of the window that draws it
const env = inject(WINDOW_CONTEXT, null)?.environment ?? "";
const permissions = {reads: [], runs: [], missing: [], ask: async () => true};
const entry = computed(() => ({
    // a body reads as the window its type names, which the module declares with the reads the body needs
    name: props.declaration.type,
    entry_url: props.declaration.body_url,
    events: [],
    options: [],
}));
const asComponent = computed(() => Boolean(props.declaration.shipped || props.declaration.trusted));
</script>

<template>
    <template v-if="asComponent">
        <PageWindow :entry="entry" :subscriptions="subscriptions" :environment="env" :permissions="permissions" :options="{row}" />
    </template>
    <template v-else>
        <FrameWindow :entry="entry" :subscriptions="subscriptions" :environment="env" :permissions="permissions" :options="{row}" />
    </template>
</template>
