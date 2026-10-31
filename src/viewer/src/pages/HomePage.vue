<script setup>
import {onUnmounted} from "vue";
import PaneStage from "../windows/PaneStage.vue";
import {followEvents} from "../windows/windowCatalogue.js";
import {startWindows} from "../windows/startup.js";
import {useHomeLayout} from "../windows/homeLayout.js";

const props = defineProps({
    environment: {type: String, required: true},
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const {catalogue, subscriptions, shellLine, prompts, listeners, stop} = startWindows(props);
const home = useHomeLayout(props.environment, shellLine, catalogue);
listeners.push(home.heard);
onUnmounted(stop);
home.load();
</script>

<template>
    <div class="home-page">
        <PaneStage page="home" :store="home.store" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :prompts="prompts" :shell-read="shellLine" />
    </div>
</template>

<style scoped>
.home-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}
</style>
