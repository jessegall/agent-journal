<script setup>
import {meta} from "../domain/spec.js";
import EmptyState from "../kit/EmptyState.vue";
import {computed, inject, reactive, ref, watchEffect} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import {peekThere, route} from "../route.js";
import {usePoll} from "../composables/poll.js";
import {byRef, refParts} from "../domain/records.js";
import {age} from "../format/time.js";
import ResourceBody from "./ResourceBody.vue";
import ResourceRow from "./ResourceRow.vue";
import TabBar from "../kit/TabBar.vue";

const props = defineProps({resource: Object, readOnly: Boolean});
const fileUrl = inject("fileUrl", (type, n, name) => api.fileUrl(type, n, name));
const emit = defineEmits(["close"]);
const fetched = reactive({});
const loading = new Set();

const ELSEWHERE_EVERY = 5000;

async function read(ref) {
    const {env, type, n} = refParts(ref);
    try {
        return await (env ? api.in(env) : api).show(type, n);
    } catch {
        return null;
    }
}

async function load(ref) {
    if (fetched[ref] || loading.has(ref)) return;
    loading.add(ref);
    fetched[ref] = await read(ref);
    loading.delete(ref);
}

const refs = computed(() => (props.resource.refs || []).filter((ref) => ref !== props.resource.data?.source));
const elsewhere = computed(() => refs.value.filter((ref) => refParts(ref).env));
const held = (ref) => byRef(ref) || fetched[ref];
watchEffect(() => !props.readOnly && refs.value.filter((ref) => !held(ref)).forEach(load));
usePoll(
    `collection-elsewhere:${props.resource.ref}`,
    () => Promise.all(elsewhere.value.map(async (ref) => [ref, await read(ref)])),
    ELSEWHERE_EVERY,
    (found) => found.forEach(([ref, row]) => (fetched[ref] = row)),
    () => !props.readOnly && elsewhere.value.length > 0
);

const fetching = computed(() => refs.value.some((ref) => !held(ref) && !(ref in fetched)));
const members = computed(() =>
    refs.value
        .map((ref) => (held(ref) ? {...held(ref), at: ref, env: refParts(ref).env} : null))
        .filter((r) => r && !r.deleted)
        .sort((a, b) => (b.updated || b.created) - (a.updated || a.created))
);
const open = (r) => peekThere(r.env || route.value.env, r.type, r.n);
const filePath = (r, name) => (r.env ? api.in(r.env) : api).fileUrl(r.type, r.n, name);

const cards = computed(() => members.value.filter((r) => r.type !== "todo"));
const todos = computed(() => members.value.filter((r) => r.type === "todo"));
const tab = ref("cards");
const tabs = computed(() => [
    {key: "cards", title: "Cards", count: cards.value.length},
    {key: "todos", title: "To-dos", count: todos.value.length},
]);

const firstLine = (r) =>
    String(r.abstract || r.brief || "")
        .split("\n")
        .find((line) => line.trim()) || "";
const hidden = reactive(new Set());
const picture = (r) => (r.data?.hide_preview || hidden.has(r.at) ? "" : Object.keys(r.data?.pictures || {})[0] || "");

function hidePreview(r) {
    hidden.add(r.at);
    (r.env ? api.in(r.env) : api).hidePreview(r.type, r.n).catch(() => hidden.delete(r.at));
}
</script>

<template>
    <ResourceBody :resource="resource" :comments="false" :links="false" :read-only="readOnly" @close="emit('close')">
        <template v-if="todos.length">
            <TabBar v-model="tab" class="tabs" :tabs="tabs" />
        </template>
        <template v-if="todos.length && tab === 'todos'">
            <section class="todos" aria-label="To-dos in this collection">
                <template v-for="r in todos" :key="r.at">
                    <ResourceRow :resource="r" @click="open(r)" />
                </template>
            </section>
        </template>
        <template v-else>
            <section class="cards" aria-label="In this collection">
                <template v-if="!members.length">
                    <EmptyState class="empty" :loading="fetching" shape="cards">
                        Nothing in this collection yet. Add an item to this collection.
                    </EmptyState>
                </template>
                <template v-for="r in cards" :key="r.at">
                    <div class="card-wrap">
                        <button type="button" class="card" @click="open(r)">
                            <template v-if="picture(r)">
                                <img class="thumb" :src="r.env ? filePath(r, picture(r)) : fileUrl(r.type, r.n, picture(r))" :alt="picture(r)" loading="lazy" />
                            </template>
                            <span class="kind">
                                <Icon :name="meta(r.type).icon" :size="12" />
                                {{ meta(r.type).title }} {{ r.n }}
                                <span class="grow" />
                                <span class="when">{{ age(r.updated || r.created) }}</span>
                            </span>
                            <span class="title">{{ r.title }}</span>
                            <template v-if="firstLine(r)">
                                <span class="line">{{ firstLine(r) }}</span>
                            </template>
                        </button>
                        <template v-if="picture(r) && !readOnly">
                            <button type="button" class="unpreview" title="Stop showing this preview image" @click="hidePreview(r)">
                                <Icon name="x" :size="12" />
                            </button>
                        </template>
                    </div>
                </template>
            </section>
        </template>
    </ResourceBody>
</template>

<style scoped>
.tabs {
    margin-bottom: 12px;
}

.todos {
    display: flex;
    flex-direction: column;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    padding: 4px 0 16px;
}

.empty {
    grid-column: 1 / -1;
    font-size: 13px;
}

.card-wrap {
    position: relative;
    display: flex;
    min-width: 0;
}

.card-wrap > .card {
    flex: 1;
}

.unpreview {
    position: absolute;
    top: 18px;
    right: 18px;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    color: var(--text-2);
    opacity: 0;
    pointer-events: none;
    cursor: pointer;
    transition: opacity 0.15s;
}

.card-wrap:has(.thumb:hover) .unpreview,
.unpreview:hover {
    opacity: 1;
    pointer-events: auto;
    transition-delay: 1s;
}

.unpreview:hover {
    transition-delay: 0s;
    color: var(--text);
}

.card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.card:hover {
    border-color: var(--border-2);
    background: #1b1c20;
}

.thumb {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    background: var(--border);
}

.kind {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.grow {
    flex: 1;
}

.when {
    text-transform: none;
    letter-spacing: 0;
}

.title {
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.35;
}

.line {
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>
