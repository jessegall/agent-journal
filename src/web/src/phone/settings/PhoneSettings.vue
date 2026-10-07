<script setup>
import {computed, onMounted, ref} from "vue";
import {useUpdates} from "../../composables/updates.js";
import {narrowed} from "../../domain/settingsCatalog.js";
import BigTitle from "../kit/BigTitle.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import ItemScreen from "../kit/ItemScreen.vue";
import SearchField from "../kit/SearchField.vue";
import PhoneGroupRows from "./PhoneGroupRows.vue";
import {groupsOf, loadCatalog, loaded, failed, sections, tally} from "./catalog.js";
import {REGIONS} from "./regions.js";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const words = ref("");
const {about, load} = useUpdates();
const found = computed(() => groupsOf(narrowed(sections.value, words.value, "all")));

onMounted(() => {
    loadCatalog();
    load().catch(() => {});
});
</script>

<template>
    <ItemScreen title="Settings" about="Settings" :back="back" @back="emit('back')">
        <BigTitle title="Settings" />
        <SearchField v-model="words" label="Search settings" />
        <template v-if="failed && !loaded">
            <EmptyList icon="warn" title="Settings did not load" :reason="failed" action="Try again" @act="loadCatalog" />
        </template>
        <template v-else-if="words.trim()">
            <template v-for="group in found" :key="group.key">
                <PhoneGroupRows :group="group" :head="group.title" />
            </template>
            <template v-if="!found.length">
                <p class="settings-none">No setting matches “{{ words }}”.</p>
            </template>
        </template>
        <template v-else>
            <template v-if="about && about.newer">
                <CellGroup>
                    <Cell :label="`Version ${about.latest} is out`" sub="Open About this journal to install it" tone="accent" icon="download" @pick="emit('open', 'region:about')" />
                </CellGroup>
            </template>
            <CellGroup head="All settings">
                <template v-for="one in REGIONS" :key="one.key">
                    <Cell :label="one.title" :sub="one.line" :icon="one.icon" @pick="emit('open', one.route)" />
                </template>
            </CellGroup>
            <CellGroup head="Filter settings">
                <Cell label="Changed" sub="Changed from the default" icon="dots" :count="tally.changed" @pick="emit('open', 'region:changed')" />
                <Cell label="Off" sub="Switched off now" icon="dots" :count="tally.off" @pick="emit('open', 'region:off')" />
            </CellGroup>
        </template>
    </ItemScreen>
</template>

<style scoped>
.settings-none {
    color: var(--text-3);
    text-align: center;
}
</style>
