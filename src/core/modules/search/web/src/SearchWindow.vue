<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {Btn, Dialog, ListReaderLayout, Markdown, Reader, SearchBar, Skeleton, copying, peekRef, stateLabel, tableOfWord, titleOfWord, useWindow} from "@journal/window-kit";

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

// a kind's name over its group is the plural of its name in words: Documents, Tasks, Memories
const groupOf = (name) => titleOfWord(name).replace(/y$/, "ie") + "s";
const referenceOf = (hit) => `${titleOfWord(hit.cli_name)} ${hit.id}`;
// the results are grouped by kind; a row says the row's title, what matched and its reference
const items = computed(() => (answer.value?.hits || []).map((hit) => ({id: `${hit.cli_name}:${hit.id}`, title: hit.title || referenceOf(hit), desc: hit.excerpt, group: groupOf(hit.cli_name), hit})));

async function find() {
    clearTimeout(typing);
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

// the search runs a moment after the typing stops, and at once on Enter or when the field is cleared
const TYPING_PAUSE_MS = 300;
let typing = null;
watch(terms, (words) => {
    clearTimeout(typing);
    if (!words.trim()) return void find();
    typing = setTimeout(find, TYPING_PAUSE_MS);
}, {flush: "sync"});
onUnmounted(() => clearTimeout(typing));

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
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="420" :place="place" :empty-title="answer ? 'No match' : 'Search the journal'" pick-line="No result chosen" data-search>
        <template #top>
            <SearchBar v-model="terms" placeholder="Search" @keydown.enter.prevent="find" />
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
        <template #meta="{item}">
            <template v-if="item.hit.state"><span class="search-state" data-search-state>{{ stateLabel(item.hit.cli_name, item.hit.state) }}</span></template>
        </template>
        <template #line="{item}">
            <span class="search-line"><span>{{ item.desc }}</span><span class="search-reference" data-search-reference>{{ referenceOf(item.hit) }}</span></span>
        </template>
        <template #empty>
            <template v-if="searching"><Skeleton shape="rows" /></template>
            <template v-else-if="!answer"><span data-search-empty>Type words to find documents, tasks, memories and everything else the journal keeps. A result contains every word.</span></template>
        </template>
        <template #reader="{item}">
            <Reader :title="item.title" :number="referenceOf(item.hit)" :facts="answer.closest ? [{name: 'holds', label: 'Holds', value: item.hit.matched_tokens.join(', ')}] : []" data-search-reader>
                <template #primary><Btn small variant="primary" data-search-open @click="openHit(item.hit)">Open</Btn></template>
                <Markdown :text="item.hit.body || item.hit.excerpt" data-search-text />
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

.search-line {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.search-line > span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.search-state {
    color: var(--text-4);
    font-size: 12px;
    white-space: nowrap;
}

.search-reference {
    color: var(--accent);
    font-size: 11px;
}

.search-note {
    margin: 0;
    padding: 4px var(--inset);
    color: var(--text-3);
    font-size: 12px;
}
</style>
