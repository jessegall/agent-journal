<script setup>
import {computed, onMounted} from "vue";
import {navMark} from "../../domain/settingsCatalog.js";
import SwitchCase from "../../kit/SwitchCase.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import PhoneAbout from "./PhoneAbout.vue";
import PhoneAlerts from "./PhoneAlerts.vue";
import PhoneGroupRows from "./PhoneGroupRows.vue";
import PhonePage from "./PhonePage.vue";
import PhonePairing from "./PhonePairing.vue";
import PhonePluginSettings from "./PhonePluginSettings.vue";
import PhoneServiceCells from "./PhoneServiceCells.vue";
import PhoneVoice from "./PhoneVoice.vue";
import {groupsIn, loadCatalog, loaded, only} from "./catalog.js";
import {FILTERED, regionOf, TAB_OF} from "./regions.js";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open", "command"]);
const region = computed(() => regionOf(props.target));
const tab = computed(() => TAB_OF[props.target] || "");
const groups = computed(() => (tab.value ? groupsIn(tab.value) : []));
const sharing = computed(() => groupsIn("sharing"));
const filtered = computed(() => (FILTERED[props.target] ? only(props.target) : []));
const markOf = (group) => {
    const mark = navMark(group, false);
    return mark.text || (mark.kind === "changed" ? "Changed" : "");
};
const scope = computed(() => (tab.value ? "tab" : FILTERED[props.target] ? "filtered" : props.target));

onMounted(() => loaded.value || loadCatalog());
</script>

<template>
    <PhonePage :title="region.title" :line="region.line" :back="back" @back="emit('back')">
        <SwitchCase :value="scope">
            <template #tab>
                <CellGroup>
                    <template v-for="group in groups" :key="group.key">
                        <Cell :label="group.title" :sub="group.line" :count="markOf(group)" @pick="emit('open', `setting:${group.key}`)" />
                    </template>
                </CellGroup>
                <template v-if="target === 'system'">
                    <CellGroup>
                        <Cell label="About this journal" sub="Version, updates and what changed" icon="info" @pick="emit('open', 'region:about')" />
                    </CellGroup>
                </template>
            </template>
            <template #filtered>
                <template v-for="group in filtered" :key="group.key">
                    <PhoneGroupRows :group="group" :head="group.title" />
                </template>
                <template v-if="loaded && !filtered.length">
                    <EmptyList icon="check" :title="target === 'off' ? 'Nothing here is switched off' : 'Every setting here is at its default'" reason="Settings you change or switch off show up here." />
                </template>
            </template>
            <template #services>
                <PhoneServiceCells @open="emit('open', $event)" />
            </template>
            <template #notify>
                <PhoneAlerts />
            </template>
            <template #phone>
                <PhonePairing @open="emit('open', $event)" />
                <template v-if="sharing.length">
                    <CellGroup head="Share link settings">
                        <template v-for="group in sharing" :key="group.key">
                            <Cell :label="group.title" :sub="group.line" :count="markOf(group)" @pick="emit('open', `setting:${group.key}`)" />
                        </template>
                    </CellGroup>
                </template>
            </template>
            <template #pluginsettings>
                <PhonePluginSettings @open="emit('open', $event)" />
            </template>
            <template #voice>
                <PhoneVoice @open="emit('open', $event)" />
            </template>
            <template #tips>
                <CellGroup>
                    <Cell label="Show the tour again" tone="accent" :chevron="false" @pick="emit('command', 'tour')" />
                </CellGroup>
            </template>
            <template #about>
                <PhoneAbout />
            </template>
        </SwitchCase>
    </PhonePage>
</template>
