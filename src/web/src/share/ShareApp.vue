<script setup>
import {sharedData} from "../api/shared.js";
import {computed, provide, ref, watch} from "vue";
import {usePoll} from "../poll.js";
import Icon from "../kit/Icon.vue";
import {counted} from "../format/number.js";
import {narrow} from "../platform/view.js";
import CollectionPage from "../resource/CollectionPage.vue";
import DocumentPage from "../resource/DocumentPage.vue";
import PlanPage from "../resource/PlanPage.vue";
import CommentBar from "./CommentBar.vue";
import ShareComments from "./ShareComments.vue";
import ShareStrip from "./ShareStrip.vue";
import PlanTimeline from "../resource/PlanTimeline.vue";
import ResourceBody from "../resource/ResourceBody.vue";
import {peek, route} from "../route.js";
import {store} from "../state/store.js";

const KINDS = {
    doc: {title: "Document", icon: "file", view: "document", labels: {}},
    collection: {title: "Collection", icon: "folder", view: "small", labels: {abstract: "What belongs in it"}},
    report: {title: "Report", icon: "report", view: "document", labels: {}},
    plan: {title: "Plan", icon: "flag", view: "document", labels: {}},
    todo: {title: "To-do", icon: "ring", view: "small", labels: {}},
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
const LOOKS = {
    doc: {noun: "document", icon: "docs"},
    report: {noun: "report", icon: "reports"},
    collection: {noun: "collection", icon: "folder"},
    plan: {noun: "plan", icon: "plan"},
};
const WORDS_PER_MINUTE = 220;
const reading = (r) => {
    const words = [r.abstract, r.brief, ...(r.sections || []).map((section) => section.body)].join(" ").split(/\s+/).filter(Boolean).length;
    const sections = (r.sections || []).length;
    return [`${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`, ...(sections ? [counted(sections, "section")] : [])];
};
const FACTS = {
    plan: (r) => [counted((r.data.phases || []).length, "phase"), counted(r.refs.length, "to-do")],
    collection: (r) => [counted(r.refs.length, "item")],
};
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
const rowOf = (ref) => {
    const [type, n] = (ref || ":").split(":");
    return (store.rows[type] || []).find((r) => r.n === Number(n)) || null;
};
const shown = computed(() => rowOf(shownRef.value));
const target = computed(() => rowOf(data.value?.share.target));
const kind = computed(() => target.value?.type || "");
const look = computed(() => LOOKS[kind.value] || {noun: kind.value, icon: "docs"});
const facts = computed(() => (target.value ? (FACTS[kind.value] || reading)(target.value) : []));
const sideline = computed(() => timeline.value.length > 0 && !narrow.value);
const sent = ref([]);
const thread = computed(() => {
    const known = data.value?.comments || [];
    return [...known, ...sent.value.filter((c) => !known.some((k) => k.n === c.n))]
        .filter((c) => c.about === shownRef.value)
        .sort((a, b) => a.created - b.created);
});
const read = ref(0);
const timelineOpen = ref(false);

function follow(e) {
    const box = e.target;
    if (!box.classList?.contains("document-body")) return;
    read.value = box.scrollTop / Math.max(1, box.scrollHeight - box.clientHeight);
}

function showThread() {
    document.getElementById("share-comments")?.scrollIntoView({behavior: "smooth", block: "start"});
}
const timeline = computed(() => (shown.value?.type === "plan" ? data.value?.timeline || [] : []));
const away = computed(() => shownRef.value !== data.value?.share.target);
const ends = computed(() => {
    const at = data.value?.share.expires;
    return at ? new Date(at * 1000).toLocaleDateString(undefined, {day: "numeric", month: "long", year: "numeric"}) : "";
});

watch(shown, (item) => item && (document.title = item.title));
watch(shownRef, () => (read.value = 0));
</script>

<template>
    <div :class="['share-app', `kind-${kind}`]">
        <template v-if="failed">
            <main class="gone">
                <Icon name="lock" :size="18" />
                <h1>This link doesn't open anything</h1>
                <p>It may have ended, or the address is not complete.</p>
            </main>
        </template>
        <template v-else-if="shown">
            <ShareStrip
                :icon="look.icon"
                :noun="look.noun"
                :facts="facts"
                :back="away ? target.title : ''"
                :comments="data.share.comments"
                :ends="ends"
                :read="['doc', 'report'].includes(kind) ? read : -1"
            />
            <div :class="['view', {aside: sideline}]">
                <div class="reading" @scroll.capture="follow">
                    <DocumentPage :key="shownRef" :resource="shown" read-only>
                        <template v-if="shown.type === 'collection'">
                            <CollectionPage :resource="shown" read-only />
                        </template>
                        <template v-else-if="shown.type === 'plan'">
                            <PlanPage :resource="shown" read-only pin-progress />
                        </template>
                        <template v-else>
                            <ResourceBody :resource="shown" :comments="false" :links="false" read-only />
                        </template>
                        <template v-if="timeline.length && narrow">
                            <div class="body">
                                <section class="inline-timeline">
                                    <button
                                        type="button"
                                        class="timeline-fold"
                                        :aria-expanded="timelineOpen"
                                        @click="timelineOpen = !timelineOpen"
                                    >
                                        <span class="timeline-heading">Timeline</span>
                                        <span class="timeline-count">{{ counted(timeline.length, "event") }}</span>
                                        <span class="timeline-toggle">{{ timelineOpen ? "Hide" : "Show" }}</span>
                                    </button>
                                    <template v-if="timelineOpen">
                                        <PlanTimeline :items="timeline" @open="(n) => peek('todo', n)" />
                                    </template>
                                </section>
                            </div>
                        </template>
                        <template v-if="data.share.comments">
                            <ShareComments :comments="thread" />
                        </template>
                        <template #foot>
                            <footer class="foot">
                                Shared from an agent journal
                                <template v-if="ends">· This link ends {{ ends }}</template>
                            </footer>
                        </template>
                    </DocumentPage>
                    <template v-if="data.share.comments">
                        <CommentBar :key="shownRef" v-model:sent="sent" :about="shownRef" :count="thread.length" @show="showThread" />
                    </template>
                </div>
                <template v-if="sideline">
                    <aside class="share-timeline">
                        <h2 class="timeline-heading">Timeline</h2>
                        <PlanTimeline :items="timeline" @open="(n) => peek('todo', n)" />
                    </aside>
                </template>
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
    --kind: var(--accent);
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg);
}

.kind-report {
    --kind: var(--tone-commit);
}

.kind-collection {
    --kind: var(--tone-warn);
}

.kind-plan {
    --kind: var(--progress);
}

.view {
    flex: 1;
    min-height: 0;
}

.reading {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    min-height: 0;
}

.reading > .document {
    flex: 1;
    height: auto;
    min-height: 0;
}

.view.aside {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
}

.share-timeline {
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 36px 24px 40px;
    border-left: 1px solid var(--border);
    background: var(--side);
}

.inline-timeline {
    margin-bottom: 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--side);
}

.timeline-fold {
    display: flex;
    width: 100%;
    align-items: baseline;
    gap: 8px;
    padding: 14px 16px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.timeline-fold .timeline-heading {
    margin: 0;
}

.timeline-count {
    flex: 1;
    color: var(--text-3);
    font-size: 12.5px;
}

.timeline-toggle {
    color: var(--accent-text);
    font-size: 12.5px;
}

.inline-timeline > :not(.timeline-fold) {
    padding: 0 16px 12px;
}

.timeline-heading {
    margin: 0 0 6px;
    font-size: 13px;
    font-weight: 600;
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
