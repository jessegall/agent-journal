<script setup>
import {GUIDE_LINE} from "../domain/pluginWords.js";
import SidePanel from "../kit/SidePanel.vue";
import PluginGuideBody from "./PluginGuideBody.vue";

const emit = defineEmits(["close"]);
</script>

<template>
    <SidePanel
        title="Make a plugin"
        :abstract="GUIDE_LINE"
        @close="emit('close')"
    >
        <PluginGuideBody />
    </SidePanel>
</template>
