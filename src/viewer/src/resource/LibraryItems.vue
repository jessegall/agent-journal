<script setup>
import {onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import EmptyState from "../kit/EmptyState.vue";
import ListBox from "../kit/ListBox.vue";
import Segmented from "../kit/Segmented.vue";
import TextInput from "../kit/TextInput.vue";
import LibraryItemPanel from "./LibraryItemPanel.vue";
import LibraryItemRow from "./LibraryItemRow.vue";

const KINDS = [
    {key: "", label: "Everything"},
    {key: "sequence", label: "Sequences"},
    {key: "template", label: "Templates"},
    {key: "profile", label: "Profiles"},
    {key: "reader", label: "Readers"},
    {key: "skill", label: "Skills"},
    {key: "document", label: "Documents"},
    {key: "file", label: "Files"},
    {key: "plan", label: "Plans"},
];

const props = defineProps({team: {type: String, default: ""}});
const items = ref(null);
const kind = ref("");
const search = ref("");
const opened = ref(null);

async function load() {
    items.value = (await api.libraryItems(kind.value, search.value.trim(), props.team)).items;
}

const isOpened = (item) => opened.value?.item_type === item.item_type && opened.value?.name === item.name;

watch([kind, search], load);
onMounted(load);
</script>

<template>
    <div class="library-items">
        <div class="library-bar">
            <Segmented :options="KINDS" :value="kind" @pick="kind = $event" />
            <TextInput v-model="search" icon="search" placeholder="Search the shared items" />
        </div>
        <div class="library-body">
            <template v-if="!items">
                <EmptyState loading />
            </template>
            <template v-else-if="!items.length">
                <EmptyState>No items match.</EmptyState>
            </template>
            <template v-else>
                <ListBox title="Items" :count="items.length">
                    <template v-for="entry in items" :key="`${entry.item.item_type}:${entry.item.name}`">
                        <LibraryItemRow :item="entry.item" :version="entry.version" :imported="entry.imported_version" :on="isOpened(entry.item)" @open="opened = entry.item" />
                    </template>
                </ListBox>
            </template>
            <template v-if="opened">
                <aside class="library-panel">
                    <LibraryItemPanel :type="opened.item_type" :name="opened.name" :team="team" @changed="load" />
                </aside>
            </template>
        </div>
    </div>
</template>

<style scoped>
.library-items {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.library-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.library-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 20px;
    align-items: start;
}

.library-panel {
    padding: 14px;
    border: 1px solid var(--border-3);
    border-radius: 8px;
}

@media (max-width: 760px) {
    .library-body {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
