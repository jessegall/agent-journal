<script setup>
import {computed} from "vue";
import {Icon, peekRef, tableOfWord, useWindow} from "@journal/window-kit";

// what an opened search mark shows, as version 4's search group did: a child for each row found, the newest first, which opens that row, and when more
// rows held the words than are shown a last child that opens the search page
const SEARCH_PAGE = "search.search";
const context = useWindow();
const mark = context.option("row");
// the mark keeps the whole answer in its lines; its detail is only the start of it
const found = computed(() => JSON.parse(mark.value?.lines || '{"terms": [], "total": 0, "hits": []}'));
const hidden = computed(() => found.value.total - found.value.hits.length);
const tableOf = (hit) => tableOfWord(hit.cli_name);
const open = (hit) => peekRef(`${tableOf(hit)}:${hit.id}`);
</script>

<template>
    <div class="search-mark" data-search-mark>
        <template v-for="hit in found.hits" :key="`${hit.cli_name}:${hit.id}`">
            <button type="button" class="search-child" data-search-child :disabled="!tableOf(hit)" @click="open(hit)">
                <span class="search-child-name">{{ hit.cli_name }} {{ hit.id }}</span>
                <span class="search-child-excerpt">{{ hit.excerpt }}</span>
            </button>
        </template>
        <template v-if="!found.hits.length">
            <p class="search-none" data-search-none>No results match all these words: {{ found.terms.join(" ") }}</p>
        </template>
        <template v-if="hidden > 0">
            <button type="button" class="search-child search-more" data-search-more @click="context.open(SEARCH_PAGE)">
                <Icon name="search" :size="12" />
                <span>All {{ found.total }} results on the search page</span>
            </button>
        </template>
    </div>
</template>

<style scoped>
.search-mark {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 260px;
    max-width: 520px;
    margin: 2px 0 2px 12px;
}

.search-child {
    display: flex;
    gap: 10px;
    align-items: baseline;
    padding: 4px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.search-child:hover:not(:disabled) {
    background: var(--hover);
    color: var(--text);
}

.search-child:disabled {
    cursor: default;
}

.search-child-name {
    flex: none;
    min-width: 64px;
    color: var(--text-3);
}

.search-child-excerpt {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.search-more {
    align-items: center;
    color: var(--text-3);
}

.search-none {
    margin: 0;
    padding: 4px 8px;
    color: var(--text-3);
    font-size: 12px;
}
</style>
