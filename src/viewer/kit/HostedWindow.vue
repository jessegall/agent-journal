<script setup>
import {inject} from "vue";
import {INSPECTOR_HOST} from "../src/windows/windowContext.js";
import WindowPane from "../src/windows/WindowPane.vue";
import {useWindow} from "./windowContextKey.js";

// another window drawn inside this one, with the options it is given (the Settings page draws each section of the agent settings this way);
// an inspector, which is no window, names the environment itself
const props = defineProps({name: {type: String, required: true}, options: {type: Object, default: () => ({})}, environment: {type: String, default: ""}});
const host = inject(INSPECTOR_HOST, null);
const environment = props.environment || useWindow().environment;
</script>

<template>
    <template v-if="host">
        <WindowPane :name="name" :catalogue="host.catalogue" :subscriptions="host.subscriptions" :environment="environment" :prompts="host.prompts" :shell-read="host.shellRead" :options="options" />
    </template>
</template>
