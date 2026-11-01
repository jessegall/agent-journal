<script setup>
import {computed, ref, watch} from "vue";
import {Icon, Segmented, Skeleton, TextDisplay, TextInput, useWindow} from "@journal/window-kit";
import {age, grouped, searched, sorted} from "./libraryGroups.js";

const LIBRARIES = [
    {key: "doc", label: "Documents"},
    {key: "report", label: "Reports"},
];
const ORDERS = [
    {key: "newest", label: "Newest"},
    {key: "title", label: "A to Z"},
];

const noun = ref("doc");
const order = ref("newest");
const words = ref("");
const chosen = ref(null);
const reading = ref(null);
const context = useWindow();
const rows = ref([]);
const total = ref(0);
const failure = ref("");
const loaded = ref(false);
const groups = computed(() => grouped(sorted(searched(rows.value, words.value), order.value), order.value));
const label = computed(() => (noun.value === "doc" ? "Document" : "Report"));

// the first page of the kind chosen, in one read; a page more is asked for after the last number held
async function load() {
    const kind = noun.value;
    const answer = await context.read(`document library --kind ${kind}`);
    if (kind !== noun.value) return;
    failure.value = answer.ok ? "" : answer.error;
    rows.value = answer.ok ? answer.value.rows : [];
    total.value = answer.ok ? answer.value.total : 0;
    loaded.value = true;
}

async function more() {
    const kind = noun.value;
    const answer = await context.read(`document library --kind ${kind} --after ${Math.max(...rows.value.map((row) => row.id))}`);
    if (!answer.ok) return void (failure.value = answer.error);
    if (kind === noun.value) rows.value = [...rows.value, ...answer.value.rows];
}

async function readRow(row) {
    const answer = await context.read(`${noun.value} show ${row.id} --json`);
    if (!answer.ok) return null;
    return answer.value;
}

function open(row) {
    chosen.value = row.id;
    readRow(row).then((value) => (reading.value = value));
}

watch(noun, () => {
    chosen.value = null;
    reading.value = null;
    rows.value = [];
    loaded.value = false;
    load();
});
context.follow(["doc.*", "report.*"], load);
load();
</script>

<template>
    <div class="library">
        <div class="library-bar">
            <TextInput v-model="words" icon="search" class="library-search" placeholder="Search titles and abstracts" />
            <Segmented :options="LIBRARIES" :value="noun" @pick="noun = $event" />
            <Segmented :options="ORDERS" :value="order" @pick="order = $event" />
        </div>
        <div class="library-body">
            <div class="library-list">
                <template v-if="!loaded">
                    <Skeleton shape="cards" />
                </template>
                <template v-else-if="failure">
                    <p class="library-note">{{ failure }}</p>
                </template>
                <template v-else-if="loaded && !groups.length">
                    <p class="library-note">{{ words ? "Nothing matches the search" : `No ${LIBRARIES.find((kind) => kind.key === noun).label.toLowerCase()} yet` }}</p>
                </template>
                <template v-for="group in groups" :key="group.key">
                    <template v-if="group.title">
                        <h3 class="library-group">{{ group.title }}</h3>
                    </template>
                    <template v-for="row in group.rows" :key="row.id">
                        <button type="button" :class="['library-row', {chosen: row.id === chosen}]" :data-row="row.id" @click="open(row)">
                            <Icon name="file" class="library-icon" />
                            <span class="library-text">
                                <span class="library-title">{{ row.title }}</span>
                                <span class="library-abstract">{{ row.abstract }}</span>
                                <span class="library-ref">{{ label }} {{ row.id }}</span>
                            </span>
                            <span class="library-age">{{ age(row.updated_at) }}</span>
                        </button>
                    </template>
                </template>
                <template v-if="rows.length < total && !words">
                    <button type="button" class="library-more" @click="more">Show more</button>
                </template>
            </div>
            <div class="library-reader">
                <template v-if="reading">
                    <h2 class="reader-title">{{ reading.title }}</h2>
                    <p class="reader-abstract">{{ reading.abstract }}</p>
                    <TextDisplay :text="reading.body" class="reader-body" />
                </template>
                <template v-else>
                    <div class="reader-empty">
                        <p class="reader-empty-title">Choose a {{ label.toLowerCase() }} to read it here</p>
                        <p class="reader-empty-text">Choose one on the left to see its text here.</p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.library {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.library-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

.library-search {
    flex: 1;
    min-width: 0;
}

.library-body {
    display: grid;
    flex: 1;
    grid-template-columns: minmax(240px, 2fr) 3fr;
    min-height: 0;
}

.library-list {
    overflow-y: auto;
    padding: 6px 10px;
    border-right: 1px solid var(--border);
}

.library-group {
    margin: 12px 20px 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-2);
}

.library-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    width: 100%;
    padding: 10px 12px;
    border: 0;
    border-radius: 8px;
    background: none;
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.library-row:hover,
.library-row.chosen {
    background: var(--hover);
}

.library-icon {
    flex: none;
    width: 28px;
    height: 34px;
    color: var(--text-3);
}

.library-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.library-title {
    font-weight: 600;
}

.library-abstract {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: var(--text-2);
    font-size: 13px;
}

.library-ref,
.library-age {
    color: var(--text-3);
    font-size: 12px;
}

.library-reader {
    overflow-y: auto;
    padding: 20px 28px;
}

.reader-title {
    margin: 0 0 6px;
    font-size: 20px;
}

.reader-abstract {
    margin: 0 0 18px;
    color: var(--text-2);
}

.reader-empty {
    margin-top: 120px;
    text-align: center;
}

.reader-empty-title {
    margin: 0 0 6px;
    font-weight: 500;
}

.reader-empty-text,
.library-more {
    margin: 8px 12px;
    color: var(--muted);
    background: none;
    border: 0;
    cursor: pointer;
}

.library-note {
    margin: 0;
    color: var(--text-2);
}

.library-note {
    padding: 12px;
}
</style>
