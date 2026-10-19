<script setup>
import {onMounted} from "vue";
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
import {loadMigration, migrationOffered, putMigrationOff, startMigration} from "./composables/migration.js";
import {figureVoice, loadVoicesUntilLoaded, voicesLoaded} from "./composables/voices.js";
import {floorsShown} from "./composables/voiceFigure.js";
import {store} from "./state/store.js";
import {ui} from "./state/ui.js";

// the voice's figure lives on the Home page alone: it is unmounted when the user leaves Home, and enters again at home on return
defineProps({home: {type: Boolean, required: true}});

onMounted(loadMigration);
// the voice's figure is named by the voices, so they load with the page, not with the flat figure that is only its fallback
if (!voicesLoaded.value) loadVoicesUntilLoaded();
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
    <template v-if="migrationOffered">
        <NewFeatureDialog
            eyebrow="Version 3"
            title="This project has a version 3 journal"
            text="It is kept whole in .journal/version-3. Bring everything across into this journal? The backup stays as it is."
            button="Bring it across"
            @use="startMigration"
            @dismiss="putMigrationOff"
        />
    </template>
    <DetachedWindows />
</template>
