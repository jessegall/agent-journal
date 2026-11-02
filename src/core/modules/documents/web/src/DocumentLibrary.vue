<script setup>
import {computed, ref, watch} from "vue";
import {Btn, Icon, peekRef, Segmented, Skeleton, TextInput, useWindow} from "@journal/window-kit";
import {age, grouped, searched, sorted} from "./libraryGroups.js";

const LIBRARIES = [
    {key: "doc", label: "Documents"},
    {key: "report", label: "Reports"},
];
const STATES = [
    {key: "open", label: "Open"},
    {key: "closed", label: "Closed"},
];
const ORDERS = [
    {key: "newest", label: "Newest"},
    {key: "title", label: "A to Z"},
];

const noun = ref("doc");
const state = ref("open");
const order = ref("newest");
const words = ref("");
const chosen = ref(null);
const context = useWindow();
const rows = ref([]);
const total = ref(0);
const failure = ref("");
const loaded = ref(false);
const drafting = ref(false);
const draft = ref({title: "", abstract: "", body: ""});
const refusal = ref("");
const groups = computed(() => grouped(sorted(searched(rows.value, words.value), order.value), order.value));
const label = computed(() => (noun.value === "doc" ? "Document" : "Report"));

// the first page of the kind chosen, in one read; a page more is asked for after the last number held
async function load() {
    const kind = noun.value;
    const shown = state.value;
    const answer = await context.read(`document library --kind ${kind} --state ${shown}`);
    if (kind !== noun.value || shown !== state.value) return;
    failure.value = answer.ok ? "" : answer.error;
    rows.value = answer.ok ? answer.value.rows : [];
    total.value = answer.ok ? answer.value.total : 0;
    loaded.value = true;
}

async function more() {
    const kind = noun.value;
    const shown = state.value;
    const answer = await context.read(`document library --kind ${kind} --state ${shown} --after ${Math.max(...rows.value.map((row) => row.id))}`);
    if (!answer.ok) return void (failure.value = answer.error);
    if (kind === noun.value && shown === state.value) rows.value = [...rows.value, ...answer.value.rows];
}

// a row opens in the panel, as every other row does
function open(row) {
    chosen.value = row.id;
    peekRef(`${noun.value === "doc" ? "docs" : "reports"}:${row.id}`);
}

async function create() {
    const {title, abstract, body} = draft.value;
    if (!title.trim() || !abstract.trim()) return;
    const answer = await context.run([noun.value, "make", title.trim(), "--abstract", abstract.trim(), "--body", body.trim() || abstract.trim()]);
    refusal.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    drafting.value = false;
    draft.value = {title: "", abstract: "", body: ""};
    load();
}

const openChosen = () => {
    const row = shownRows.value.find((held) => held.id === chosen.value);
    if (row) open(row);
};
const shownRows = computed(() => groups.value.flatMap((group) => group.rows));

function step(by) {
    if (!shownRows.value.length) return;
    const at = shownRows.value.findIndex((row) => row.id === chosen.value);
    chosen.value = shownRows.value[at < 0 ? 0 : Math.max(0, Math.min(shownRows.value.length - 1, at + by))].id;
}

function closeOrClear() {
    if (chosen.value) chosen.value = null;
    else words.value = "";
}

watch([noun, state], () => {
    chosen.value = null;
    rows.value = [];
    loaded.value = false;
    load();
});
context.follow(["doc.*", "report.*"], load);
load();
</script>

<template>
    <div class="library" data-window-flush>
        <div class="library-bar">
            <TextInput v-model="words" icon="search" class="library-search" placeholder="Search titles and abstracts" />
            <Segmented :options="LIBRARIES" :value="noun" @pick="noun = $event" />
            <Segmented :options="STATES" :value="state" data-library-state @pick="state = $event" />
            <Segmented :options="ORDERS" :value="order" @pick="order = $event" />
            <Btn small bordered data-library-new @click="drafting = !drafting">New {{ label.toLowerCase() }}</Btn>
        </div>
        <template v-if="drafting">
            <form class="library-draft" data-library-draft @submit.prevent="create">
                <input v-model="draft.title" placeholder="Title" aria-label="Title">
                <input v-model="draft.abstract" placeholder="One line on what it says" aria-label="Abstract">
                <textarea v-model="draft.body" rows="4" placeholder="The text" aria-label="Text" />
                <template v-if="refusal">
                    <p class="library-note" role="alert">{{ refusal }}</p>
                </template>
                <div class="library-draft-foot">
                    <Btn small @click="drafting = false">Cancel</Btn>
                    <Btn small kind="primary" type="submit" :disabled="!draft.title.trim() || !draft.abstract.trim()" data-library-create>Make it</Btn>
                </div>
            </form>
        </template>
        <div class="library-body">
            <div class="library-list" tabindex="0" data-library-list @keydown.down.prevent="step(1)" @keydown.up.prevent="step(-1)" @keydown.esc="closeOrClear" @keydown.enter.self="openChosen">
                <template v-if="!loaded">
                    <Skeleton shape="cards" />
                </template>
                <template v-else-if="failure">
                    <p class="library-note">{{ failure }}</p>
                </template>
                <template v-else-if="loaded && !groups.length">
                    <p class="library-note">{{ words ? "Nothing matches the search" : `No ${LIBRARIES.find((kind) => kind.key === noun).label.toLowerCase()} yet` }}</p>
                    <template v-if="words">
                        <Btn small data-library-clear @click="words = ''">Clear the search</Btn>
                    </template>
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
        </div>
    </div>
</template>

<style scoped>
.library-draft {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
}

.library-draft-foot {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}

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
