<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {ago, Btn, EmptyState, peekRef, Segmented, Skeleton, SearchBar, useWindow} from "@journal/window-kit";

// the files sent with messages, as version 4's Attachments page listed them: find a file, images or other files, images as tiles and the rest as rows
const SEARCH_WAIT_MILLISECONDS = 250;
const context = useWindow();
const words = ref("");
const kind = ref("all");
const rows = ref([]);
const counts = ref(null);
const more = ref(false);
const failure = ref("");

const kinds = computed(() => [
    {key: "all", label: `All ${counts.value?.all ?? ""}`.trim()},
    {key: "images", label: `Images ${counts.value?.images ?? ""}`.trim()},
    {key: "other", label: `Other files ${counts.value?.other ?? ""}`.trim()},
]);
const images = computed(() => rows.value.filter((row) => row.is_image));
const others = computed(() => rows.value.filter((row) => !row.is_image));
const addressOf = (row) => `/api/files/message/${row.message_id}/${encodeURIComponent(row.name)}`;

let reading = 0;

async function read(skip) {
    const turn = ++reading;
    const search = words.value.trim() ? ` --search ${JSON.stringify(words.value.trim())}` : "";
    const answer = await context.read(`attachment list --kind ${kind.value} --skip ${skip}${search}`);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    rows.value = skip ? [...rows.value, ...answer.value.rows] : answer.value.rows;
    counts.value = answer.value.counts;
    more.value = !answer.value.is_last_page;
}

let waiting = 0;
watch([words, kind], () => {
    clearTimeout(waiting);
    waiting = setTimeout(() => read(0), words.value ? SEARCH_WAIT_MILLISECONDS : 0);
});
onUnmounted(() => clearTimeout(waiting));
read(0);
</script>

<template>
    <section class="attachments" data-attachments data-window-flush>
        <div class="bar">
            <SearchBar v-model="words" class="search" placeholder="Search file names and their messages" data-attachment-search />
            <Segmented :options="kinds" :value="kind" @pick="kind = $event" />
        </div>
        <template v-if="failure">
            <p class="failure" role="alert">{{ failure }}</p>
        </template>
        <template v-else-if="!counts">
            <Skeleton shape="rows" />
        </template>
        <template v-else-if="!rows.length && !words.trim()">
            <EmptyState title="No files are stored on this environment yet. Files attached to a message show here." />
        </template>
        <template v-else-if="!rows.length">
            <EmptyState :title="`No file matches ${words.trim()}`" />
            <Btn small data-attachment-clear @click="words = ''">Clear the search</Btn>
        </template>
        <template v-else>
            <div class="gallery">
                <template v-for="row in images" :key="`${row.message_id}:${row.name}`">
                    <a class="tile" :href="addressOf(row)" target="_blank" rel="noopener" data-attachment-image :title="row.name"><img :src="addressOf(row)" :alt="row.name" loading="lazy"></a>
                </template>
            </div>
            <template v-for="row in others" :key="`${row.message_id}:${row.name}`">
                <div class="row" data-attachment-file>
                    <a class="name" :href="addressOf(row)" target="_blank" rel="noopener">{{ row.name }}</a>
                    <button type="button" class="source" @click="peekRef(`messages:${row.message_id}`)">Message {{ row.message_id }}</button>
                    <span class="when">{{ ago(row.created_at) }}</span>
                </div>
            </template>
            <template v-if="more">
                <Btn small data-attachment-more @click="read(rows.length)">Load more</Btn>
            </template>
        </template>
    </section>
</template>

<style scoped>
.attachments {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 12px;
}

.bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    width: 100%;
}

.search {
    flex: 1;
    min-width: 200px;
}

.gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tile {
    display: block;
    width: 120px;
    height: 90px;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 8px;
}

.tile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.row {
    display: flex;
    gap: 10px;
    align-items: baseline;
    width: 100%;
    font-size: 13px;
}

.name {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
}

.source {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.when {
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
