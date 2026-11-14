<script setup>
import {computed, ref, watch} from "vue";
import {ActionsMenu, Btn, Reader, TimeAgo, useWindow} from "@journal/window-kit";
import CopyCompare from "./CopyCompare.vue";
import {KEEPS_REVISIONS, KIND_WORDS, STATE_WORDS, primaryOf} from "./teamWords.js";

// one item of the library read whole: who shared it and when, Details with one Version row when both sides agree and Library and Here when they do not,
// Compare while an update waits, and Versions. The primary is Follow, Update or Share
const props = defineProps({item: {type: Object, required: true}, items: {type: Array, required: true}, canWrite: Boolean});
const emit = defineEmits(["act"]);
const view = useWindow();
const tab = defineModel("tab", {type: String, default: "details"});
const copy = computed(() => props.item.row.copy);
const primary = computed(() => primaryOf(props.item));
const same = computed(() => !copy.value || copy.value.version === copy.value.server_version);
const facts = computed(() => [
    {name: "kind", label: "Type", value: KIND_WORDS[props.item.row.share]},
    {name: "state", label: "State", value: props.item.way ? `${STATE_WORDS[props.item.state]}: ${props.item.way}` : STATE_WORDS[props.item.state]},
    ...(same.value ? [{name: "version", label: "Version", value: String(props.item.row.version)}] : [{name: "library", label: "Library", value: `version ${copy.value.server_version}`}, {name: "here", label: "Here", value: `version ${copy.value.version}`}]),
]);
const tabs = computed(() => [{key: "details", label: "Details"}, ...(props.item.state === "update" && copy.value ? [{key: "compare", label: "Compare"}] : []), {key: "versions", label: "Versions"}]);

// the versions of the item, read when the tab opens
const versions = ref([]);
const failure = ref("");
async function readVersions() {
    view.state["inspection.share"] = props.item.row.share;
    view.state["inspection.id"] = String(props.item.row.item_id);
    await view.reload("inspection");
    const inspection = view.props.inspection;
    failure.value = inspection.failure.value;
    versions.value = failure.value ? [] : inspection.data.value.versions;
}
watch([() => tab.value, () => props.item.id], ([open]) => open === "versions" && readVersions(), {immediate: true});
const restore = async (version) => {
    const answer = await view.run(["library", "restore", props.item.row.share, String(props.item.row.item_id), "--version", String(version)]);
    if (answer.ok) readVersions();
    else failure.value = answer.error;
};
const there = computed(() => copy.value?.server_fields ?? {});
</script>

<template>
    <Reader v-model:tab="tab" :title="item.title" :number="`${KIND_WORDS[item.row.share]} ${item.row.item_id}`" :abstract="item.row.by ? `Shared by ${item.row.by}` : ''" :tabs="tabs" :facts="facts" data-team-reader>
        <template #primary>
            <Btn v-if="primary" small variant="primary" data-team-primary @click="emit('act', primary)">{{ primary }}</Btn>
        </template>
        <template #actions>
            <ActionsMenu :items="items" :head="item.title" />
        </template>
        <template #default="{tab: open}">
            <template v-if="open === 'details' && item.row.at"><p class="when" data-team-when>Changed <TimeAgo :at="item.row.at" /></p></template>
            <template v-if="open === 'details' && copy?.note"><p class="when" data-team-note>{{ copy.note }}</p></template>
            <template v-if="open === 'compare' && copy">
                <p v-if="!KEEPS_REVISIONS.includes(item.row.share)" class="loss" data-library-loss>The text on this journal is lost when you use the library's version: a {{ item.row.share }} keeps no earlier versions.</p>
                <CopyCompare :here="copy.local_fields" :library="there" :at="new Date().toISOString()" />
                <Btn v-if="item.way !== 'Changed here'" small variant="primary" data-library-take @click="emit('act', 'Take')">Use the library's version</Btn>
            </template>
            <template v-if="open === 'versions'">
                <p v-if="failure" class="loss" role="alert">{{ failure }}</p>
                <ul class="versions" data-library-versions>
                    <template v-for="change in versions" :key="change.version">
                        <li :data-library-version="change.version">
                            <span>Version {{ change.version }}, changed by {{ change.user }}, <TimeAgo :at="change.created_at" /></span>
                            <Btn v-if="canWrite && change.version !== item.row.version" small data-library-restore-version @click="restore(change.version)">Restore this version</Btn>
                        </li>
                    </template>
                </ul>
            </template>
        </template>
    </Reader>
</template>

<style scoped>
.when,
.loss {
    margin: 8px 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.versions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 12.5px;
}

.versions li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}
</style>
