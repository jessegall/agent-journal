<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {Btn, EmptyState, peekRef, Segmented, Skeleton, SearchBar, TimeAgo, useWindow} from "@journal/window-kit";

// the files sent with messages, as version 4's Attachments page listed them: find a file, images or other files, images as tiles and the rest as rows
const SEARCH_WAIT_MILLISECONDS = 250;
const context = useWindow();
const words = ref("");
const category = ref("all");
const rows = ref([]);
const counts = ref(null);
const more = ref(false);
const {data, failure} = context.props.attachments;
context.state["attachments.category"] = "all";
context.state["attachments.skip"] = "0";

const categories = computed(() => [
    {key: "all", label: `All ${counts.value?.all ?? ""}`.trim()},
    {key: "images", label: `Images ${counts.value?.images ?? ""}`.trim()},
    {key: "other", label: `Other files ${counts.value?.other ?? ""}`.trim()},
]);
const images = computed(() => rows.value.filter((row) => row.is_image));
const others = computed(() => rows.value.filter((row) => !row.is_image));
const addressOf = (row) => `/api/files/message/${row.message_id}/${encodeURIComponent(row.name)}`;

watch(data, (answer) => {
    rows.value = Number(context.state["attachments.skip"]) ? [...rows.value, ...answer.rows] : answer.rows;
    counts.value = answer.counts;
    more.value = !answer.is_last_page;
});

async function read(skip) {
    context.state["attachments.category"] = category.value;
    context.state["attachments.skip"] = String(skip);
    if (words.value.trim()) context.state["attachments.search"] = words.value.trim();
    else delete context.state["attachments.search"];
    await context.reload("attachments");
}

let waiting = 0;
watch([words, category], () => {
    clearTimeout(waiting);
    waiting = setTimeout(() => read(0), words.value ? SEARCH_WAIT_MILLISECONDS : 0);
});
onUnmounted(() => clearTimeout(waiting));
</script>

<template>
    <section class="attachments" data-attachments>
        <SearchBar v-model="words" class="bar" data-attachment-search>
            <Segmented :options="categories" :value="category" @pick="category = $event" />
        </SearchBar>
        <template v-if="failure">
            <p class="failure" role="alert">{{ failure }}</p>
        </template>
        <template v-else-if="!counts">
            <Skeleton shape="rows" />
        </template>
        <template v-else-if="!rows.length && !words.trim()">
            <EmptyState title="Files attached to messages in this environment appear here." />
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
                    <TimeAgo class="when" :at="row.created_at" />
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
    padding: 8px 14px 8px 22px;
}

.bar {
    flex-wrap: wrap;
    gap: 10px;
    box-sizing: border-box;
    width: 100%;
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
