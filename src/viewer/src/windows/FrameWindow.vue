<script setup>
import {h} from "vue";
import FrameContent from "./FrameContent.vue";
import WindowHost from "./WindowHost.vue";

const props = defineProps({
    entry: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    visible: {type: Boolean, default: true},
    permissions: {type: Object, default: () => ({reads: [], runs: [], missing: [], ask: async () => true})},
    prompts: {type: Object, default: null},
});
const component = {render: () => h(FrameContent, {src: props.entry.entry_url})};
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
        :events="entry.events || []"
        :unavailable-reason="entry.unavailable_reason || ''"
    />
</template>
