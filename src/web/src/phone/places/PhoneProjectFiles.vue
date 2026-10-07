<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../../api/client.js";
import {fileSize} from "../../format/files.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import PlaceScreen from "../kit/PlaceScreen.vue";
import SearchField from "../kit/SearchField.vue";

const WAIT = 250;

const props = defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const files = ref([]);
const found = ref([]);
const words = ref("");
const failed = ref("");
const loaded = ref(false);
const title = computed(() => (props.target ? props.target.split("/").at(-1) : "Project files"));
const asked = computed(() => words.value.trim());
const listed = computed(() => (asked.value ? found.value : files.value));
const folderOf = (file) => file.path.slice(0, -file.name.length - 1);
const subOf = (file) => (file.folder ? folderOf(file) : [folderOf(file), fileSize(file.size)].filter(Boolean).join(" · "));
let timer = 0;

onMounted(async () => {
    try {
        files.value = await api.projectFiles(props.target);
    } catch (error) {
        failed.value = error.message;
    } finally {
        loaded.value = true;
    }
});

watch(asked, (now) => {
    clearTimeout(timer);
    if (!now) return (found.value = []);
    timer = setTimeout(async () => {
        const got = await api.findFiles(now).catch(() => []);
        if (asked.value === now) found.value = got;
    }, WAIT);
});

const pick = (file) => emit("open", file.folder ? `files:${file.path}` : `file:${file.path}`);
</script>

<template>
    <PlaceScreen :title="title" :sub="target || 'Every file in the project, and what it is attached to'" :back="back" @back="emit('back')">
        <SearchField v-model="words" label="Find a file in the project" />
        <template v-if="!target && !asked">
            <CellGroup>
                <Cell
                    label="Files attached to items"
                    sub="Pictures and files added to to-dos, documents and messages"
                    icon="clip"
                    @pick="emit('open', 'attached:')"
                />
            </CellGroup>
        </template>
        <template v-if="failed">
            <EmptyList icon="warn" title="The files did not load" :reason="failed" />
        </template>
        <template v-else-if="listed.length">
            <CellGroup :head="asked ? 'Found in the project' : target ? '' : 'Folders and files'">
                <template v-for="file in listed" :key="file.path">
                    <Cell :label="file.name" :sub="subOf(file)" :icon="file.folder ? 'folder' : 'file'" @pick="pick(file)" />
                </template>
            </CellGroup>
        </template>
        <template v-else-if="asked">
            <p class="files-none">No file in the project is named like “{{ asked }}”.</p>
        </template>
        <template v-else-if="loaded">
            <EmptyList icon="folder" title="This folder is empty" reason="There are no files in it." />
        </template>
    </PlaceScreen>
</template>

<style scoped>
.files-none {
    margin: 12px 4px 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}
</style>
