<script setup>
import {shallowRef, watch} from "vue";
import WindowHost from "./WindowHost.vue";

const props = defineProps({
    offer: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    visible: {type: Boolean, default: true},
});
const component = shallowRef(null);

watch(
    () => props.offer.entry_url,
    async (url) => {
        component.value = null;
        if (!props.offer.unavailable_reason) component.value = (await import(/* @vite-ignore */ url)).default;
    },
    {immediate: true},
);
</script>

<template>
    <WindowHost
        :key="offer.entry_url"
        :name="offer.name"
        :component="component"
        :subscriptions="subscriptions"
        :environment="environment"
        :agent="agent"
        :visible="visible"
        :declared="{reads: offer.reads || [], runs: offer.runs || []}"
        :unavailable-reason="offer.unavailable_reason"
    />
</template>
