<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, ListReaderLayout, Reader, SearchBar, Skeleton, copying, peekRef, tableOfWord, useWindow} from "@journal/window-kit";

const context = useWindow();
const terms = ref("");
const picked = ref(new Set());
const answer = ref(null);
const failure = ref("");
const searching = ref(false);
const shown = ref(null);
const chosen = ref(null);
// the models a search can be narrowed to: those the last answer held and those already picked
const models = computed(() => [...new Set([...(answer.value?.hits || []).map((hit) => hit.cli_name), ...picked.value])].sort());

const kindOf = (name) => name.charAt(0).toUpperCase() + name.slice(1);
// the results are grouped by kind, and under a kind a row says only its number and what matched
const items = computed(() => (answer.value?.hits || []).map((hit) => ({id: `${hit.cli_name}:${hit.id}`, title: `${hit.cli_name} ${hit.id}`, desc: hit.excerpt, group: kindOf(hit.cli_name), hit})));

async function find() {
    const words = terms.value.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return void (answer.value = null);
    searching.value = true;
    chosen.value = null;
    context.state["results.terms"] = words.join(" ");
    if (picked.value.size) context.state["results.model"] = [...picked.value].join(",");
    else delete context.state["results.model"];
    await context.reload("results");
    const result = context.props.results;
    searching.value = false;
    failure.value = result.failure.value;
    answer.value = failure.value ? null : result.data.value;
}

function toggle(model) {
    const next = new Set(picked.value);
    if (next.has(model)) next.delete(model);
    else next.add(model);
    picked.value = next;
    find();
}

// a hit opens its row in the inspector of its model; a model with no inspector shows the hit's text in a dialog
function openHit(hit) {
    const table = tableOfWord(hit.cli_name);
    if (table) peekRef(`${table}:${hit.id}`);
    else shown.value = hit;
}

// a result is only read: its menu has Open and a copy, never Duplicate or Delete
const place = (item) => ({
    head: item.title,
    items: [
        {label: "Open", group: "open", run: () => openHit(item.hit)},
        {label: "Copy reference", group: "copy", run: ({say}) => copying(item.title, item.title, say)},
    ],
});
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="420" :place="place" :empty-title="answer ? 'No match' : 'Search'" pick-line="No result chosen" data-search>
        <template #top>
            <SearchBar v-model="terms" placeholder="Search" @keydown.enter.prevent="find">
                <Btn variant="primary" small data-search-go @click="find">Search</Btn>
            </SearchBar>
            <template v-if="models.length">
                <div class="search-chips">
                    <template v-for="model in models" :key="model">
                        <button type="button" :class="['search-chip', {on: picked.has(model)}]" :data-model="model" @click="toggle(model)">{{ model }}</button>
                    </template>
                </div>
            </template>
            <template v-if="failure">
                <p class="search-note">{{ failure }}</p>
            </template>
            <template v-else-if="answer && !answer.hits.length">
                <p class="search-note" data-no-hits>No results match all these words: {{ terms.trim() }}</p>
            </template>
            <template v-else-if="answer && answer.closest">
                <p class="search-note" data-closest>No result holds all these words: {{ terms.trim() }}, these hold most of them, the closest first</p>
            </template>
            <template v-else-if="answer">
                <p class="search-note" data-total>{{ answer.total }} {{ answer.total === 1 ? "result matches" : "results match" }} all these words: {{ terms.trim() }}{{ answer.total > answer.hits.length ? `, the newest ${answer.hits.length} are shown` : "" }}</p>
            </template>
            <template v-if="shown">
                <Dialog padded :title="`${shown.cli_name} ${shown.id}`" small data-hit-dialog @close="shown = null">
                    <p class="search-text">{{ shown.excerpt }}</p>
                </Dialog>
            </template>
        </template>
        <template #empty>
            <template v-if="searching"><Skeleton shape="rows" /></template>
            <template v-else-if="!answer">Type words and press Enter. A result holds every word.</template>
        </template>
        <template #reader="{item}">
            <Reader :title="item.title" :number="kindOf(item.hit.cli_name)" :facts="answer.closest ? [{name: 'holds', label: 'Holds', value: item.hit.matched_tokens.join(', ')}] : []" data-search-reader>
                <template #primary><Btn small variant="primary" data-search-open @click="openHit(item.hit)">Open</Btn></template>
                <p class="search-text" data-search-text>{{ item.hit.excerpt }}</p>
            </Reader>
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.search-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 0 var(--inset);
}

.search-chip {
    padding: 2px 10px;
    border: 0;
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
    cursor: pointer;
}

.search-chip.on {
    background: var(--accent);
    color: #fff;
}

.search-text {
    margin: 0;
    white-space: pre-wrap;
}

.search-note {
    margin: 0;
    padding: 4px var(--inset);
    color: var(--text-3);
    font-size: 12px;
}
</style>
