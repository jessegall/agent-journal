<script setup>
import PluginGuideBody from "../../pages/PluginGuideBody.vue";
import PhonePage from "./PhonePage.vue";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
</script>

<template>
    <PhonePage title="How to make a plugin" line="A repository with one file that says what it listens to, runs and shows." :back="back" @back="emit('back')">
        <PluginGuideBody />
    </PhonePage>
</template>
