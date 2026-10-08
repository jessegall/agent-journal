<script setup>
import SuggestionLayer from "./chat/SuggestionLayer.vue";
import Lightbox from "./kit/Lightbox.vue";
import Tooltip from "./kit/Tooltip.vue";
import AwayCard from "./layout/AwayCard.vue";
import DetachedWindows from "./layout/DetachedWindows.vue";
import PluginPagePanel from "./layout/PluginPagePanel.vue";
import ProjectFlash from "./layout/ProjectFlash.vue";
import SkillPanel from "./layout/SkillPanel.vue";
import FirstChoiceDialog from "./pages/FirstChoiceDialog.vue";
import {firstChoice} from "./composables/profiles.js";
import {store} from "./state/store.js";
import {ui} from "./state/ui.js";
</script>

<template>
    <Lightbox />
    <Tooltip />
    <template v-if="ui.away.open">
        <AwayCard />
    </template>
    <template v-if="store.skill">
        <SkillPanel />
    </template>
    <template v-if="store.pluginPage">
        <PluginPagePanel />
    </template>
    <ProjectFlash />
    <template v-if="firstChoice">
        <FirstChoiceDialog />
    </template>
    <DetachedWindows />
    <SuggestionLayer />
</template>
