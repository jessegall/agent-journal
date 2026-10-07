<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {phone} from "../../api/phone.js";
import {searchTerms} from "../../domain/documents.js";
import {ageGroups} from "../../format/time.js";
import {kindTitle} from "../kinds.js";
import ActionSheet from "../kit/ActionSheet.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import PlaceScreen from "../kit/PlaceScreen.vue";
import SearchField from "../kit/SearchField.vue";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const files = ref([]);
const words = ref("");
const failed = ref("");
const loaded = ref(false);
const picked = ref(null);
const owner = (file) => `${kindTitle(file.type)} ${file.n}`;
const text = (file) => `${file.name} ${file.description || ""} ${file.title || ""} ${owner(file)}`.toLowerCase();
const groups = computed(() => {
    const asked = searchTerms(words.value);
    const kept = files.value.filter((file) => asked.every((word) => text(file).includes(word))).sort((a, b) => b.at - a.at);
    return ageGroups(kept, (file) => file.at);
});
const subOf = (file) => [file.description, `${owner(file)}: ${file.title}`].filter(Boolean).join(" · ");
const actionsOf = (file) => [
    {key: "file", label: "Open the file", run: () => window.open(phone.fileUrl(file.type, file.n, file.name), "_blank")},
    {key: "item", label: `Open ${owner(file).toLowerCase()}`, sub: file.title, run: () => emit("open", `${file.type}:${file.n}`)},
];

onMounted(async () => {
    try {
        files.value = await api.files();
    } catch (error) {
        failed.value = error.message;
    } finally {
        loaded.value = true;
    }
});
</script>

<template>
    <PlaceScreen title="Attached files" sub="Files added to items, newest first" :back="back" @back="emit('back')">
        <SearchField v-model="words" label="Search attached files" />
        <template v-if="failed">
            <EmptyList icon="warn" title="The files did not load" :reason="failed" />
        </template>
        <template v-else-if="loaded && !files.length">
            <EmptyList icon="clip" title="No attached files" reason="Files you or the agent add to an item show here." />
        </template>
        <template v-for="group in groups" :key="group.title">
            <CellGroup :head="group.title">
                <template v-for="file in group.list" :key="`${file.type}:${file.n}:${file.name}`">
                    <Cell :label="file.name" :sub="subOf(file)" :icon="file.image ? 'camera' : 'file'" @pick="picked = file" />
                </template>
            </CellGroup>
        </template>
        <template v-if="words && files.length && !groups.length">
            <p class="attached-none">No attached file matches “{{ words }}”.</p>
        </template>
    </PlaceScreen>
    <template v-if="picked">
        <ActionSheet :title="picked.name" :about="owner(picked)" :actions="actionsOf(picked)" @close="picked = null" />
    </template>
</template>

<style scoped>
.attached-none {
    margin: 12px 4px 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}
</style>
