<script setup>
import SidePanel from "../kit/SidePanel.vue";
import PluginGuideBody from "./PluginGuideBody.vue";

const emit = defineEmits(["close"]);
</script>

<template>
    <SidePanel
        title="Make a plugin"
        abstract="A repository with one file that says what it listens to, runs and shows"
        @close="emit('close')"
    >
        <PluginGuideBody />
    </SidePanel>
</template>
