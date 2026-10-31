<script setup>
import {computed} from "vue";
import FrameWindow from "./FrameWindow.vue";
import PageWindow from "./PageWindow.vue";
import {WindowSubscriptions} from "./windowSubscriptions.js";

// the body file a module gives a chat mark or a docked item, loaded through the window host: as a component for a module the journal ships or
// the person trusts, and in a sandboxed frame for any other
const props = defineProps({declaration: {type: Object, required: true}});
const subscriptions = new WindowSubscriptions();
const permissions = {reads: [], runs: [], missing: [], ask: async () => true};
const entry = computed(() => ({
    name: `${props.declaration.module}.${props.declaration.type}`,
    entry_url: props.declaration.body_url,
    events: [],
    options: [],
}));
const asComponent = computed(() => Boolean(props.declaration.shipped || props.declaration.trusted));
</script>

<template>
    <template v-if="asComponent">
        <PageWindow :entry="entry" :subscriptions="subscriptions" environment="" :permissions="permissions" />
    </template>
    <template v-else>
        <FrameWindow :entry="entry" :subscriptions="subscriptions" environment="" :permissions="permissions" />
    </template>
</template>
