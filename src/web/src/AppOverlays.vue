<script setup>
import {onMounted} from "vue";
import SuggestionLayer from "./chat/SuggestionLayer.vue";
import VoiceFigure from "./chat/VoiceFigure.vue";
import FigureFloors from "./chat/FigureFloors.vue";
import Lightbox from "./kit/Lightbox.vue";
import Tooltip from "./kit/Tooltip.vue";
import AwayCard from "./layout/AwayCard.vue";
import DetachedWindows from "./layout/DetachedWindows.vue";
import PluginPagePanel from "./layout/PluginPagePanel.vue";
import ProjectFlash from "./layout/ProjectFlash.vue";
import SkillPanel from "./layout/SkillPanel.vue";
import NewFeatureDialog from "./kit/NewFeatureDialog.vue";
import FirstChoiceDialog from "./pages/FirstChoiceDialog.vue";
import {dismissNewFeature, loadNewFeatures, newFeature, turnOffNewFeature, useNewFeature} from "./composables/newFeature.js";
import {loadMigration, migrationOffered, putMigrationOff, startMigration} from "./composables/migration.js";
import {firstChoice, loadProfilesUntilLoaded, figureVoice, profilesLoaded} from "./composables/profiles.js";
import {floorsShown} from "./composables/voiceFigure.js";
import {store} from "./state/store.js";
import {ui} from "./state/ui.js";

// the voice's figure lives on the Home page alone: it is unmounted when the user leaves Home, and enters again at home on return
defineProps({home: {type: Boolean, required: true}});

onMounted(loadNewFeatures);
onMounted(loadMigration);
// the voice's figure is named by the profiles, so they load with the page, not with the flat figure that is only its fallback
if (!profilesLoaded.value) loadProfilesUntilLoaded();
</script>

<template>
    <Lightbox />
    <Tooltip />
    <template v-if="figureVoice && home">
        <VoiceFigure :voice="figureVoice" />
        <template v-if="floorsShown()">
            <FigureFloors />
        </template>
    </template>
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
    <template v-else-if="migrationOffered">
        <NewFeatureDialog
            eyebrow="Version 3"
            title="This project has a version 3 journal"
            text="It is kept whole in .journal/version-3. Bring everything across into this journal? The backup stays as it is."
            button="Bring it across"
            @use="startMigration"
            @dismiss="putMigrationOff"
        />
    </template>
    <template v-else-if="newFeature">
        <NewFeatureDialog
            :key="newFeature.id"
            :eyebrow="newFeature.eyebrow"
            :title="newFeature.title"
            :text="newFeature.text"
            :button="newFeature.button"
            :note="newFeature.note"
            :art="newFeature.art"
            :off="newFeature.off"
            @use="useNewFeature"
            @off="turnOffNewFeature"
            @dismiss="dismissNewFeature"
        />
    </template>
    <DetachedWindows />
    <SuggestionLayer />
</template>
