<script setup>
import EmptyState from "../kit/EmptyState.vue";
import Skeleton from "../kit/Skeleton.vue";
import TextInput from "../kit/TextInput.vue";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import {nextTick, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {tableOfWord} from "../domain/tables.js";
import {go, peek, route} from "../route.js";

const q = ref(route.value.q);
const found = ref([]);
const searching = ref(false);
const input = ref(null);
const models = ref([]);
const picked = ref([]);
const conversations = ref(false);
let request = 0;

onMounted(async () => {
    nextTick(() => input.value?.focus());
    models.value = (await api.search("")).models;
});

// No model picked searches them all; picking one narrows the search to the picked.
function pick(model) {
    picked.value = picked.value.includes(model) ? picked.value.filter((m) => m !== model) : [...picked.value, model];
    run();
}

function everything() {
    picked.value = [];
    run();
}

function withConversations(on) {
    conversations.value = on;
    run();
}

// A find names its row as "task 12"; a line of a conversation names no row and opens nothing.
const opens = (find) => {
    const [, word, id] = /^(\w+) (\d+)$/.exec(find.ref) || [];
    return word && tableOfWord(word) ? {table: tableOfWord(word), id: Number(id)} : null;
};

async function run() {
    const current = ++request;
    const words = q.value.trim();
    go("search", 0, q.value);
    found.value = [];
    searching.value = Boolean(words);
    if (!words) return;
    try {
        const got = await api.search(words, {models: picked.value, conversations: conversations.value});
        if (current === request) found.value = got.found;
    } finally {
        if (current === request) searching.value = false;
    }
}

function open(find) {
    const row = opens(find);
    if (row) peek(row.table, row.id);
}

watch(
    () => route.value.q,
    (v) => {
        q.value = v;
        run();
    },
    {immediate: true}
);
</script>

<template>
    <section class="search">
        <form class="box" @submit.prevent="run">
            <Icon name="search" />
            <TextInput ref="input" :value="q" placeholder="Search everything on this environment…" autofocus @input="q = $event.target.value" />
        </form>
        <div class="narrow">
            <button type="button" :class="['model', {on: !picked.length}]" @click="everything()">Everything</button>
            <template v-for="model in models" :key="model">
                <button type="button" :class="['model', {on: picked.includes(model)}]" @click="pick(model)">{{ model.replace("_", " ") }}</button>
            </template>
            <Switch class="conversations" :on="conversations" word="Also search the agents' conversations" beside @change="withConversations" />
        </div>
        <template v-if="searching">
            <Skeleton class="cards" shape="cards" :count="3" label="Searching" />
        </template>
        <template v-if="route.q && !searching && !found.length">
            <EmptyState class="empty">Nothing matches “{{ route.q }}”.</EmptyState>
        </template>
        <ul class="found">
            <template v-for="(find, i) in found" :key="`${find.ref}-${i}`">
                <li>
                    <button type="button" class="found-row" :disabled="!opens(find)" @click="open(find)">
                        <span class="found-ref">{{ find.ref }}</span>
                        <span class="found-passage">{{ find.passage }}</span>
                    </button>
                </li>
            </template>
        </ul>
    </section>
</template>

<style scoped>
.narrow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 10px 0 4px;
}

.model {
    padding: 2px 9px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    background: transparent;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}

.model.on {
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    color: var(--text);
}

.conversations {
    margin-left: auto;
}

.search {
    padding: 18px 22px;
}

.box {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 720px;
    padding: 10px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-3);
}

.box input {
    flex: 1;
    border: 0;
    background: none;
    outline: none;
    color: var(--text);
}

.empty {
    margin: 16px 0;
}

.more {
    margin: 16px 0;
    color: var(--text-3);
}

.switches {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 22px;
    margin-top: 12px;
}

.archived {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 4px 0;
    color: var(--text-3);
    font-size: 12px;
}

.removed-head {
    margin: 22px 0 8px;
    font-size: 13px;
    color: var(--text-2);
}

.removed {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 720px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.removed li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
}

.removed-place {
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.removed-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    grid-auto-rows: 1fr;
    gap: 12px;
    margin-top: 18px;
}

.hit {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.hit :deep(.card) {
    flex: 1;
}

.hit.filed :deep(.card) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.matches {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 10px;
    border: 1px solid var(--border);
    border-top: 0;
    border-radius: 0 0 10px 10px;
}

.matches a {
    display: flex;
    gap: 7px;
    min-width: 0;
    color: var(--accent-text);
}

.matches span,
.matches small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.matches small {
    color: var(--text-3);
}
</style>

<style scoped>
.found {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.found-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text-2);
    text-align: left;
    cursor: pointer;
}

.found-row:disabled {
    cursor: default;
}

.found-row:not(:disabled):hover {
    border-color: var(--border-2);
}

.found-ref {
    color: var(--text-3);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.found-passage {
    font-size: 13px;
}
</style>
