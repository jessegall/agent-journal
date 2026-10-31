<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import PaneStage from "../windows/PaneStage.vue";
import {followEvents} from "../windows/windowCatalogue.js";
import {startWindows} from "../windows/startup.js";
import {sessionPage, useHomeLayout} from "../windows/homeLayout.js";

const props = defineProps({
    environment: {type: String, required: true},
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const {catalogue, subscriptions, shellLine, prompts, listeners, stop, face, opened} = startWindows(props);
const home = useHomeLayout(props.environment, shellLine, catalogue);
listeners.push(home.heard);
// the main agent, whose id the agent windows opened on the home page are given
const mainAgent = ref(null);
onMounted(async () => {
    const answer = await shellLine(["agent", "list", "--role", "main"]);
    if (answer.ok && answer.value?.rows?.length) mainAgent.value = answer.value.rows[0].id;
});
onUnmounted(stop);
opened.then((session) => home.load(sessionPage(session)));
</script>

<template>
    <div class="home-page" :data-face="face">
        <PaneStage page="home" :face="face" :agent="mainAgent" :store="home.store" :catalogue="catalogue" :subscriptions="subscriptions" :environment="environment" :prompts="prompts" :shell-read="shellLine" />
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
