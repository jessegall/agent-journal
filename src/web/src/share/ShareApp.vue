<script setup>
import {sharedData} from "../api/shared.js";
import {computed, provide, ref, watch} from "vue";
import {usePoll} from "../poll.js";
import Icon from "../kit/Icon.vue";
import CollectionPage from "../resource/CollectionPage.vue";
import DocumentPage from "../resource/DocumentPage.vue";
import PlanPage from "../resource/PlanPage.vue";
import ShareComments from "./ShareComments.vue";
import ResourceBody from "../resource/ResourceBody.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";

const KINDS = {
    doc: {title: "Document", icon: "file", view: "document", labels: {}},
    collection: {title: "Collection", icon: "folder", view: "small", labels: {abstract: "What belongs in it"}},
    report: {title: "Report", icon: "report", view: "document", labels: {}},
    plan: {title: "Plan", icon: "flag", view: "document", labels: {}},
    todo: {title: "To-do", icon: "circle", view: "small", labels: {}},
    dump: {title: "Dump", icon: "inbox", view: "document", labels: {}},
};
const kindOf = (type, given = {}) => ({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    icon: "docs",
    view: "document",
    labels: {},
    ...KINDS[type],
    ...given,
    fields: {},
    shown_fields: [],
    command_names: {},
    takes_comments: false,
    choices: {},
});
const REFRESH_MS = 20000;
const data = ref(null);
const failed = ref(false);

provide("fileUrl", (type, n, name) => `./files/${type}/${n}/${encodeURIComponent(name)}`);

function row(ref, given) {
    const [type, n] = ref.split(":");
    const files = Object.fromEntries((given.files || []).map((name) => [name, ""]));
    return {
        ...given,
        type,
        n: Number(n),
        ref,
        refs: given.members || [],
        seen: [],
        data: {...given.data, files, pictures: given.pictures || {}},
        completed: given.completed || 0,
        deleted: 0,
        outcome: "",
    };
}

function stock(rows, types = {}) {
    const names = [...new Set([...Object.keys(KINDS), ...Object.keys(rows).map((ref) => ref.split(":")[0])])];
    store.spec = {priority: names, types: Object.fromEntries(names.map((name) => [name, kindOf(name, types[name])]))};
    const grouped = {};
    for (const [ref, given] of Object.entries(rows)) (grouped[ref.split(":")[0]] ||= []).push(row(ref, given));
    store.rows = grouped;
}

function take(got) {
    stock(got.rows || {}, got.types || {});
    data.value = got;
}

function ask() {
    return sharedData().catch((e) => {
        if (!data.value) failed.value = true;
        throw e;
    });
}

usePoll("shared", ask, REFRESH_MS, take);

const shownRef = computed(() => {
    const open = route.value.open;
    const asked = open ? `${open.type}:${open.n}` : "";
    return data.value?.rows[asked] ? asked : data.value?.share.target;
});
const shown = computed(() => {
    const [type, n] = (shownRef.value || ":").split(":");
    return (store.rows[type] || []).find((r) => r.n === Number(n)) || null;
});
const away = computed(() => shownRef.value !== data.value?.share.target);
const home = computed(() => data.value?.rows[data.value.share.target]);
const ends = computed(() => {
    const at = data.value?.share.expires;
    const kind = data.value?.share.comments ? "Read and comment" : "View only";
    if (!at) return kind;
    const day = new Date(at * 1000).toLocaleDateString(undefined, {day: "numeric", month: "long", year: "numeric"});
    return `${kind} · this link ends ${day}`;
});

watch(shown, (item) => item && (document.title = item.title));
</script>

<template>
    <div class="share-app">
        <template v-if="failed">
            <main class="gone">
                <Icon name="lock" :size="18" />
                <h1>This link doesn't open anything</h1>
                <p>It may have ended, or the address is not complete.</p>
            </main>
        </template>
        <template v-else-if="shown">
            <div class="strip">
                <template v-if="away && home">
                    <a class="back" href="#">
                        <Icon name="back" :size="12" />
                        {{ home.title }}
                    </a>
                </template>
                <span class="view-only">
                    <Icon name="lock" :size="11" />
                    {{ ends }}
                </span>
            </div>
            <div class="view">
                <DocumentPage :key="shownRef" :resource="shown" read-only>
                    <template v-if="shown.type === 'collection'">
                        <CollectionPage :resource="shown" read-only />
                    </template>
                    <template v-else-if="shown.type === 'plan'">
                        <PlanPage :resource="shown" read-only />
                    </template>
                    <template v-else>
                        <ResourceBody :resource="shown" :comments="false" :links="false" read-only />
                    </template>
                    <template v-if="data.share.comments">
                        <ShareComments :about="shownRef" :comments="data.comments" />
                    </template>
                    <template #foot>
                        <footer class="foot">Shared from an agent journal</footer>
                    </template>
                </DocumentPage>
            </div>
        </template>
        <template v-else>
            <main class="loading">
                <span class="loading-bar" />
                <span class="loading-bar short" />
            </main>
        </template>
    </div>
</template>

<style scoped>
.share-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg);
}

.strip {
    flex: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
    padding: 7px 18px;
    border-bottom: 1px solid var(--border);
    background: var(--side);
    color: var(--text-3);
    font-size: 11.5px;
}

.back {
    display: inline-flex;
    max-width: 100%;
    min-width: 0;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.back:hover {
    color: var(--text);
}

.view-only {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
}

.view {
    flex: 1;
    min-height: 0;
}

.foot {
    max-width: 800px;
    margin: 0 auto;
    padding: 8px 32px 40px;
    color: var(--text-4);
    font-size: 12px;
    text-align: center;
}

.gone {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px;
    color: var(--text-3);
    text-align: center;
}

.gone h1 {
    margin: 6px 0 0;
    color: var(--text);
    font-size: 17px;
    font-weight: 600;
}

.gone p {
    margin: 0;
}

.loading {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 60px 24px;
}

.loading-bar {
    display: block;
    width: 70%;
    height: 14px;
    border-radius: 7px;
    background: var(--border);
}

.loading-bar.short {
    width: 40%;
}
</style>
