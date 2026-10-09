<script setup>
import {meta} from "../domain/spec.js";
import EmptyState from "../kit/EmptyState.vue";
import {computed, inject, reactive, ref, watchEffect} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import {peekThere, route, showTab} from "../route.js";
import {usePoll} from "../composables/poll.js";
import {byRef, refParts} from "../domain/records.js";
import {PLAN_STATE_WORDS, planProgress} from "../domain/plans.js";
import {age} from "../format/time.js";
import {fileSize, isPicture} from "../format/files.js";
import BoardLanes from "./BoardLanes.vue";
import Chip from "../kit/Chip.vue";
import DetailRow from "../kit/DetailRow.vue";
import {originOf} from "../domain/origin.js";
import ResourceBody from "./ResourceBody.vue";
import ResourceRow from "./ResourceRow.vue";
import ProgressBar from "../kit/ProgressBar.vue";
import TabBar from "../kit/TabBar.vue";

const props = defineProps({resource: Object, readOnly: Boolean});
const fileUrl = inject("fileUrl", (type, n, name) => api.fileUrl(type, n, name));
const emit = defineEmits(["close"]);
const fetched = reactive({});
const loading = new Set();

const ELSEWHERE_EVERY = 5000;
const STATUS_EVERY = 10000;

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
const planOf = (r) => {
    if (props.readOnly) return (r.refs || []).find((ref) => refParts(ref).type === "plan") || "";
    return r.data?.plan && r.data?.work_environment ? `${r.data.work_environment}/plan:${r.data.plan}` : "";
};
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

const FILES_EVERY = 10000;
const files = ref(props.resource.held_files || []);
usePoll(
    `collection-files:${props.resource.ref}`,
    () => api.collectionFiles(props.resource.n),
    FILES_EVERY,
    (found) => (files.value = found),
    () => !props.readOnly
);
const fileHref = (f) => (f.env ? api.in(f.env) : api).fileUrl(f.type, f.n, f.name);
const downloadHref = (f) => (props.readOnly ? fileUrl(f.type, f.n, f.name) : fileHref(f));
const pictureFiles = computed(() => files.value.filter((f) => f.image || isPicture(f.name)));
const otherFiles = computed(() => files.value.filter((f) => !pictureFiles.value.includes(f)));

const OWN_TABS = ["plan", "todo", "ticket", "board"];
const ofType = (type) => members.value.filter((r) => r.type === type);
const resources = computed(() => members.value.filter((r) => !OWN_TABS.includes(r.type)));
const plans = computed(() => ofType("plan"));
const todos = computed(() => ofType("todo"));
const tickets = computed(() => ofType("ticket"));
const boards = computed(() => ofType("board"));
const tabs = computed(() =>
    [
        {key: "resources", title: "Resources", count: resources.value.length},
        {key: "plans", title: "Plans", count: plans.value.length},
        {key: "todos", title: "To-dos", count: todos.value.length},
        {key: "tickets", title: "Tickets", count: tickets.value.length},
        {key: "boards", title: "Boards", count: boards.value.length},
        {key: "files", title: "Files", count: files.value.length},
    ].filter((t) => t.key === "resources" || t.count)
);
const tab = computed({
    get: () => (tabs.value.some((t) => t.key === route.value.tab) ? route.value.tab : "resources"),
    set: showTab,
});
const phaseOf = (r) => r.data?.phases?.[(r.data.current || 1) - 1]?.title || "";
const openPlan = (r) => {
    const {env, type, n} = refParts(planOf(r));
    peekThere(env, type, n);
};

const waitsOf = (r) =>
    Object.entries(r.data?.dependencies || {})
        .filter(([, stance]) => stance === "confirmed")
        .map(([ref]) => tickets.value.find((t) => `ticket:${t.n}` === ref && t.env === r.env) || {title: ref.replace(":", " ")})
        .filter((other) => !other.completed)
        .map((other) => other.title);

const statuses = reactive({});
const statusOf = (r) => (props.readOnly ? r.data?.status : statuses[r.at]);
usePoll(
    `collection-tickets:${props.resource.ref}`,
    () => Promise.all(tickets.value.map(async (r) => [r.at, await (r.env ? api.in(r.env) : api).ticketStatus(r.n).catch(() => null)])),
    STATUS_EVERY,
    (found) => found.forEach(([at, status]) => (statuses[at] = status)),
    () => !props.readOnly && tickets.value.length > 0
);

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
    <ResourceBody :resource="resource" :comments="false" :links="false" :attached="false" :read-only="readOnly" @close="emit('close')">
        <template v-if="tabs.length > 1">
            <TabBar v-model="tab" class="tabs" :tabs="tabs" />
        </template>
        <template v-if="files.length && tab === 'files'">
            <section class="files" aria-label="Files in this collection">
                <template v-if="pictureFiles.length">
                    <div class="pictures">
                        <template v-for="f in pictureFiles" :key="`${f.ref}/${f.name}`">
                            <a class="picture" :href="downloadHref(f)" target="_blank" :title="`${f.name}, ${fileSize(f.size)}, from ${f.title}`">
                                <img :src="downloadHref(f)" :alt="f.name" loading="lazy" />
                                <span class="picture-name">{{ f.name }}</span>
                            </a>
                        </template>
                    </div>
                </template>
                <template v-for="f in otherFiles" :key="`${f.ref}/${f.name}`">
                    <div class="file">
                        <Icon name="clip" :size="14" />
                        <span class="file-name">{{ f.name }}</span>
                        <span class="file-line">{{ fileSize(f.size) }} · from {{ f.title }}</span>
                        <a class="download" :href="downloadHref(f)" :download="f.name" :title="`Download ${f.name}`">Download</a>
                    </div>
                </template>
            </section>
        </template>
        <template v-else-if="boards.length && tab === 'boards'">
            <template v-for="r in boards" :key="r.at">
                <BoardLanes :board="r" :plan-of="planOf" @open="open" @plan="openPlan" />
            </template>
        </template>
        <template v-else-if="plans.length && tab === 'plans'">
            <section class="rows" aria-label="Plans in this collection">
                <template v-for="r in plans" :key="r.at">
                    <DetailRow :title="r.title" :label="`Open plan ${r.n}, ${r.title}`" @open="open(r)">
                        <template #side>
                            <template v-if="originOf(r)">
                                <Chip :title="`From ${originOf(r)}`">{{ originOf(r) }}</Chip>
                            </template>
                            <span class="detail-row-note">{{ PLAN_STATE_WORDS[planProgress(r).status] || planProgress(r).status }}</span>
                        </template>
                        <span class="detail-row-line">Phase {{ planProgress(r).phase }} of {{ planProgress(r).total }}<template v-if="phaseOf(r)">: {{ phaseOf(r) }}</template></span>
                        <ProgressBar
                            class="detail-row-bar"
                            :value="planProgress(r).finished"
                            :max="Math.max(1, planProgress(r).total)"
                            :tone="planProgress(r).status === 'done' ? 'good' : planProgress(r).status === 'waiting' ? 'warn' : ''"
                            thin
                        />
                        <span class="detail-row-line">{{ planProgress(r).finished }} of {{ planProgress(r).total }} done</span>
                    </DetailRow>
                </template>
            </section>
        </template>
        <template v-else-if="tickets.length && tab === 'tickets'">
            <section class="rows" aria-label="Tickets in this collection">
                <template v-for="r in tickets" :key="r.at">
                    <DetailRow :title="r.title" @open="open(r)">
                        <template #side>
                            <span class="detail-row-note">{{ r.data?.stage }}</span>
                            <template v-if="planOf(r)">
                                <button type="button" class="detail-row-link" :title="`Open the plan of ticket ${r.n}, ${r.title}`" @click="openPlan(r)">Open plan of ticket {{ r.n }}</button>
                            </template>
                        </template>
                        <template v-if="waitsOf(r).length">
                            <span class="detail-row-line">Waits on {{ waitsOf(r).join(", ") }}</span>
                        </template>
                        <template v-if="statusOf(r)?.plan">
                            <span class="detail-row-line">{{ statusOf(r).plan }}</span>
                            <ProgressBar class="detail-row-bar" :value="statusOf(r).done" :max="Math.max(1, statusOf(r).total)" :tone="statusOf(r).kind === 'you' ? 'warn' : ''" thin />
                            <span class="detail-row-line">{{ statusOf(r).done }} of {{ statusOf(r).total }} done</span>
                        </template>
                        <template v-if="statusOf(r)?.now">
                            <span class="detail-row-line">Now: {{ statusOf(r).now }}</span>
                        </template>
                        <template v-if="statusOf(r)?.state">
                            <span :class="['detail-row-line', statusOf(r).kind]">{{ statusOf(r).state }}</span>
                        </template>
                    </DetailRow>
                </template>
            </section>
        </template>
        <template v-else-if="todos.length && tab === 'todos'">
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
                <template v-for="r in resources" :key="r.at">
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
                            <template v-if="originOf(r)">
                                <Chip class="origin" :title="`From ${originOf(r)}`">{{ originOf(r) }}</Chip>
                            </template>
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

.pictures {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 14px;
}

.picture {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    color: inherit;
    text-decoration: none;
}

.picture img {
    width: 100%;
    height: 120px;
    object-fit: cover;
}

.picture-name {
    padding: 0 8px 6px;
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--line, #e5e5e5);
}

.file-name {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
}

.file-line {
    font-size: 12px;
    opacity: 0.7;
}

.download {
    color: var(--accent-text);
}

.todos,
.rows {
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
