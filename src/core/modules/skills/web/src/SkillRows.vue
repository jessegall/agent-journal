<script setup>
import {computed, ref} from "vue";
import {useRows, useWindow} from "@journal/window-kit";
import LoadedSkills from "./LoadedSkills.vue";
import SkillCatalogue from "./SkillCatalogue.vue";
import SkillText from "./SkillText.vue";

const context = useWindow();
const {rows: loaded, failure, loaded: answered} = useRows(`agent-skill list --agent ${context.agent}`, ["agent_skill.*"]);
const view = ref("loaded");
const catalogue = ref([]);
const opened = ref(null);
const openFailure = ref("");
const screens = {loaded: LoadedSkills, catalogue: SkillCatalogue, text: SkillText};
const props = computed(() => ({
    loaded: {rows: loaded.value, failure: failure.value, answered: answered.value, onOpen: open, onBrowse: browse},
    catalogue: {rows: catalogue.value, onOpen: open, onBack: back},
    text: {skill: opened.value, failure: openFailure.value, onBack: back},
})[view.value]);

function back() {
    view.value = "loaded";
}

async function browse() {
    const result = await context.read("skill list");
    catalogue.value = result.ok ? result.value.rows : [];
    view.value = "catalogue";
}

async function open(folder) {
    const result = await context.read(`skill show ${folder}`);
    openFailure.value = result.ok ? "" : result.error;
    opened.value = result.ok ? result.value : null;
    view.value = "text";
}
</script>

<template>
    <component :is="screens[view]" v-bind="props" />
</template>
