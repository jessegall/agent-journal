<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, Segmented, Skeleton, SearchBar, TimeAgo, peekRef, useWindow} from "@journal/window-kit";
import {grouped, searched, sorted} from "./libraryGroups.js";
import {useLibrary} from "./useLibrary.js";

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

// the window lists rows only, and a row opens that document's inspector in place
const TABLES = {doc: "docs", report: "reports"};
const term = ref("doc");
const state = ref("open");
const order = ref("newest");
const words = ref("");
const view = useWindow();
const {rows, total, failure, loaded, load, more} = useLibrary(view, term, state);
const drafting = ref(false);
const draft = ref({title: "", abstract: "", body: ""});
const refusal = ref("");
const groups = computed(() => grouped(sorted(searched(rows.value, words.value), order.value), order.value));
const label = computed(() => (term.value === "doc" ? "Document" : "Report"));

const open = (row) => peekRef(`${TABLES[term.value]}:${row.id}`);

async function create() {
    const {title, abstract, body} = draft.value;
    if (!title.trim() || !abstract.trim()) return;
    const answer = await view.run([term.value, "make", title.trim(), "--abstract", abstract.trim(), "--body", body.trim() || abstract.trim()]);
    refusal.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    drafting.value = false;
    draft.value = {title: "", abstract: "", body: ""};
    load();
}

</script>

<template>
    <div class="library">
        <SearchBar v-model="words" class="library-bar">
            <Segmented :options="LIBRARIES" :value="term" @pick="term = $event" />
            <Segmented :options="STATES" :value="state" data-library-state @pick="state = $event" />
            <Segmented :options="ORDERS" :value="order" @pick="order = $event" />
            <Btn small bordered data-library-new @click="drafting = !drafting">New {{ label.toLowerCase() }}</Btn>
        </SearchBar>
        <template v-if="drafting">
            <form class="library-draft" data-library-draft @submit.prevent="create">
                <input v-model="draft.title" placeholder="Title" aria-label="Title">
                <input v-model="draft.abstract" placeholder="A short summary" aria-label="Abstract">
                <textarea v-model="draft.body" rows="4" placeholder="The text" aria-label="Text" />
                <template v-if="refusal">
                    <p class="library-note" role="alert">{{ refusal }}</p>
                </template>
                <div class="library-draft-foot">
                    <Btn small @click="drafting = false">Cancel</Btn>
                    <Btn small variant="primary" type="submit" :disabled="!draft.title.trim() || !draft.abstract.trim()" data-library-create>Create</Btn>
                </div>
            </form>
        </template>
        <div class="library-body">
            <div class="library-list" data-library-list>
                <template v-if="!loaded">
                    <Skeleton shape="cards" />
                </template>
                <template v-else-if="failure">
                    <p class="library-note">{{ failure }}</p>
                </template>
                <template v-else-if="loaded && !groups.length">
                    <p class="library-note">{{ words ? "Nothing matches the search" : `No ${LIBRARIES.find((type) => type.key === term).label.toLowerCase()} yet` }}</p>
                    <template v-if="words">
                        <Btn small data-library-clear @click="words = ''">Clear the search</Btn>
                    </template>
                </template>
                <template v-for="group in groups" :key="group.key">
                    <template v-if="group.title">
                        <h3 class="library-group">{{ group.title }}</h3>
                    </template>
                    <template v-for="row in group.rows" :key="row.id">
                        <button type="button" class="library-row" :data-row="row.id" @click="open(row)">
                            <Icon name="file" class="library-icon" />
                            <span class="library-text">
                                <span class="library-title">{{ row.title }}</span>
                                <span class="library-abstract">{{ row.abstract }}</span>
                                <span class="library-ref">{{ label }} {{ row.id }}</span>
                            </span>
                            <TimeAgo class="library-age" :at="row.updated_at" />
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
    gap: 10px;
}

.library-body {
    display: grid;
    flex: 1;
    grid-template-columns: 1fr;
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

.library-row:hover {
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
