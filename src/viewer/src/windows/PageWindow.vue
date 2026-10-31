<script setup>
import {ref, shallowRef, watch} from "vue";
import WindowHost from "./WindowHost.vue";

const props = defineProps({
    entry: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    visible: {type: Boolean, default: true},
    permissions: {type: Object, required: true},
    prompts: {type: Object, default: null},
});
const component = shallowRef(null);
const loadFailure = ref("");

watch(
    () => props.entry.entry_url,
    async (url) => {
        component.value = null;
        loadFailure.value = "";
        if (props.entry.unavailable_reason) return;
        try {
            component.value = (await import(/* @vite-ignore */ url)).default;
        } catch (error) {
            loadFailure.value = `This window's file could not be loaded: ${error.message}`;
        }
    },
    {immediate: true},
);
</script>

<template>
    <WindowHost
        :key="entry.entry_url"
        :name="entry.name"
        :component="component"
        :subscriptions="subscriptions"
        :environment="environment"
        :agent="agent"
        :visible="visible"
        :permissions="permissions"
        :prompts="prompts"
        :events="entry.events"
        :unavailable-reason="entry.unavailable_reason || loadFailure"
    />
</template>
