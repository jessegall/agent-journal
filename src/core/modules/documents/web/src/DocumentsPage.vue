<script setup>
import {computed, ref} from "vue";
import {ListReaderLayout, PageHeader, SearchBar, Segmented, Skeleton, TimeAgo, Btn, useWindow} from "@journal/window-kit";
import DocumentEdit from "./DocumentEdit.vue";
import DocumentReader from "./DocumentReader.vue";
import DocumentSettle from "./DocumentSettle.vue";
import {documentRead} from "./documentRead.js";
import {documentMenu} from "./documentItems.js";
import {grouped, searched, sorted} from "./libraryGroups.js";
import {useLibrary} from "./DocumentLibrary.vue";

// the documents and the reports as a list and a reader: a switch between documents and reports and one between the open and the closed, rows grouped by when each was last written,
// and the text, revisions and links of the chosen one at the right. A row has its number and its title, with no word for what it is
const LIST_WIDTH = 460;
const TERMS = [{key: "doc", label: "Documents"}, {key: "report", label: "Reports"}];
const STATES = [{key: "open", label: "Open"}, {key: "closed", label: "Closed"}];
const view = useWindow();
const term = ref("doc");
const state = ref("open");
const words = ref("");
const {rows, total, failure, loaded, more} = useLibrary(view, term, state);
const items = computed(() => grouped(sorted(searched(rows.value, words.value), "newest"), "newest").flatMap((group) => group.rows.map((row) => ({id: row.id, title: `${row.id} ${row.title}`, desc: row.abstract, group: group.title, row}))));
const chosen = ref(null);
const dialog = ref(null);
const ask = (kind, row) => (dialog.value = {kind, row, term: term.value});
const menuOf = (row, open = null) => documentMenu(row, term.value, {ask: (kind) => ask(kind, row), open});
const place = (item) => ({head: item.row.title, items: menuOf(item.row, () => (chosen.value = item.id))});
const read = documentRead(view);
const pick = (key, set) => {
    set(key);
    chosen.value = null;
};
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="LIST_WIDTH" :place="place" :empty-title="`No ${term === 'doc' ? 'documents' : 'reports'} yet`" pick-line="Choose a text to read it" data-documents>
        <template #top>
            <PageHeader title="Documents" :count="total" />
            <SearchBar v-model="words" class="bar" placeholder="Search titles and summaries">
                <Segmented :options="TERMS" :value="term" data-documents-term @pick="pick($event, (key) => (term = key))" />
                <Segmented :options="STATES" :value="state" data-documents-state @pick="pick($event, (key) => (state = key))" />
            </SearchBar>
            <template v-if="failure"><p class="failure" role="alert" data-documents-failure>{{ failure }}</p></template>
            <template v-if="rows.length < total && !words"><p class="more"><Btn small bordered data-documents-more @click="more">Show more</Btn></p></template>
            <template v-if="dialog?.kind === 'edit'"><DocumentEdit :term="dialog.term" :id="dialog.row.id" @close="dialog = null" /></template>
            <template v-else-if="dialog?.kind === 'settle'"><DocumentSettle :term="dialog.term" :id="dialog.row.id" @close="dialog = null" /></template>
        </template>
        <template #empty>
            <template v-if="!loaded"><Skeleton shape="rows" /></template>
            <template v-else>{{ words ? "Nothing matches the search." : "Documents and reports the agents write appear here." }}</template>
        </template>
        <template #meta="{item}">
            <TimeAgo class="age" :at="item.row.updated_at" />
        </template>
        <template #reader="{item}">
            <DocumentReader :term="term" :row="item.row" :items="menuOf(item.row)" :read="read" />
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.age {
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.more,
.failure {
    margin: 0;
    padding: 4px var(--inset);
    font-size: 12px;
}

.failure {
    color: var(--bad, var(--text-2));
}
</style>
