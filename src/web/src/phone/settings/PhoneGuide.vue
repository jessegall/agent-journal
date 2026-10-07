<script setup>
import {GUIDE_LINE} from "../../domain/pluginWords.js";
import PluginGuideBody from "../../pages/PluginGuideBody.vue";
import PhonePage from "./PhonePage.vue";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
</script>

<template>
    <PhonePage title="How to make a plugin" :line="`${GUIDE_LINE}.`" :back="back" @back="emit('back')">
        <PluginGuideBody />
    </PhonePage>
</template>
