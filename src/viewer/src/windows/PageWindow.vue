<script setup>
import {ref, shallowRef, watch} from "vue";
import Skeleton from "../kit/Skeleton.vue";
import WindowHost from "./WindowHost.vue";
import {forgetBuildReload, isStaleBuild, reloadForNewBuild} from "./staleBuild.js";

const props = defineProps({
    entry: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    visible: {type: Boolean, default: true},
    permissions: {type: Object, required: true},
    prompts: {type: Object, default: null},
    options: {type: Object, default: () => ({})},
});
const emit = defineEmits(["option"]);
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
            forgetBuildReload();
        } catch (error) {
            if (isStaleBuild(error) && reloadForNewBuild(error)) return;
            loadFailure.value = `This window's file could not be loaded: ${error.message}`;
        }
    },
    {immediate: true},
);
</script>

<template>
    <template v-if="!component && !loadFailure && !entry.unavailable_reason">
        <section class="window window-loading" :data-window="entry.name">
            <Skeleton shape="cards" />
        </section>
    </template>
    <template v-else>
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
            :options="options"
            :declared="entry.options"
            :auto-scroll="entry.auto_scroll"
            :tabs="entry.tabs"
            :search="entry.search"
            :events="entry.events"
            :unavailable-reason="entry.unavailable_reason || loadFailure"
            @option="(key, value) => emit('option', key, value)"
        />
    </template>
</template>
