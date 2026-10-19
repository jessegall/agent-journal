<script setup>
import SwitchCase from "../kit/SwitchCase.vue";
import {sharedData} from "../api/shared.js";
import {computed, reactive, ref, watch} from "vue";
import {refParts} from "../domain/records.js";
import {bodyOf, createdAt, sectionsOf, titleOf} from "../domain/row.js";
import {usePoll} from "../composables/poll.js";
import Icon from "../kit/Icon.vue";
import {counted} from "../format/number.js";
import DocumentPage from "../resource/DocumentPage.vue";
import PlanPage from "../resource/PlanPage.vue";
import CommentBar from "./CommentBar.vue";
import ShareComments from "./ShareComments.vue";
import ShareStrip from "./ShareStrip.vue";
import ResourceBody from "../resource/ResourceBody.vue";
import Lightbox from "../kit/Lightbox.vue";
import Notice from "../kit/Notice.vue";
import EmptyState from "../kit/EmptyState.vue";
import {route} from "../route.js";
import {store} from "../state/store.js";
import Skeleton from "../kit/Skeleton.vue";

const LOOKS = {
    docs: {noun: "document", icon: "docs"},
    reports: {noun: "report", icon: "reports"},
    plans: {noun: "plan", icon: "plan"},
};
const SHOWN = ["docs", "reports", "plans", "tasks"];
const WORDS_PER_MINUTE = 220;
const reading = (r) => {
    const words = [r.abstract, bodyOf(r)].join(" ").split(/\s+/).filter(Boolean).length;
    const sections = sectionsOf(r.body).length;
    return [`${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`, ...(sections ? [counted(sections, "section")] : [])];
};
const FACTS = {plans: (r) => [counted((r.phases || []).length, "phase"), counted((r.task_ids || []).length, "task")]};
const REFRESH_MS = 20000;
const data = ref(null);
const failed = ref(false);
const reconnecting = ref(false);
const drafts = reactive({});
const errors = reactive({});

function take(got) {
    store.rows = Object.fromEntries(SHOWN.map((table) => [table, got[table] || []]));
    data.value = got;
    failed.value = false;
    reconnecting.value = false;
}

function ask() {
    return sharedData().catch((e) => {
        if ([401, 404, 410].includes(e.status)) {
            failed.value = true;
            reconnecting.value = false;
        } else reconnecting.value = true;
        throw e;
    });
}

usePoll("shared", ask, REFRESH_MS, take, () => !failed.value);

const rowOf = (ref) => {
    const {table, id} = refParts(ref || ":");
    return (store.rows[table] || []).find((r) => r.id === id) || null;
};
const currentRef = computed(() => {
    const open = route.value.open;
    const asked = open ? `${open.table}:${open.id}` : "";
    return rowOf(asked) ? asked : data.value?.share.target;
});
const currentRow = computed(() => rowOf(currentRef.value));
const target = computed(() => rowOf(data.value?.share.target));
const kind = computed(() => target.value?.table || "");
const look = computed(() => LOOKS[kind.value] || {noun: kind.value, icon: "docs"});
const facts = computed(() => (target.value ? (FACTS[kind.value] || reading)(target.value) : []));
const sent = ref([]);
const said = (m) => ({id: m.id, on: m.data.row, name: m.data.visitor, text: m.data.detail, created: createdAt(m)});
const thread = computed(() => {
    const known = (data.value?.comments || []).map(said);
    return [...known, ...sent.value.filter((c) => !known.some((k) => k.text === c.text && k.name === c.name))]
        .filter((c) => c.on === currentRef.value)
        .sort((a, b) => a.created - b.created);
});
const read = ref(0);

function follow(e) {
    const box = e.target;
    if (!box.classList?.contains("document-body")) return;
    read.value = box.scrollTop / Math.max(1, box.scrollHeight - box.clientHeight);
}

function showThread() {
    document.getElementById("share-comments")?.scrollIntoView({behavior: "smooth", block: "start"});
}
const away = computed(() => currentRef.value !== data.value?.share.target);
const ends = computed(() => {
    const at = data.value?.share.expires_at;
    return at ? new Date(at).toLocaleDateString(undefined, {day: "numeric", month: "long", year: "numeric"}) : "";
});

watch(currentRow, (item) => item && (document.title = titleOf(item)));
watch(currentRef, () => (read.value = 0));
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
        <template v-else-if="currentRow">
            <template v-if="reconnecting">
                <Notice role="status">Reconnecting…</Notice>
            </template>
            <ShareStrip
                :icon="look.icon"
                :noun="look.noun"
                :facts="facts"
                :back="away ? titleOf(target) : ''"
                :comments="data.share.comments"
                :ends="ends"
                :read="['docs', 'reports'].includes(kind) ? read : -1"
            />
            <div class="view">
                <div class="reading" @scroll.capture="follow">
                    <DocumentPage :key="currentRef" :resource="currentRow" read-only>
                        <SwitchCase :value="currentRow.table">
                            <template #plans>
                                <PlanPage :resource="currentRow" read-only pin-progress />
                            </template>
                            <template #default>
                                <ResourceBody :resource="currentRow" :comments="false" :links="false" read-only />
                            </template>
                        </SwitchCase>
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
                        <CommentBar
                            :key="currentRef"
                            v-model:sent="sent"
                            v-model:draft="drafts[currentRef]"
                            v-model:error="errors[currentRef]"
                            :on="currentRef"
                            :count="thread.length"
                            @show="showThread"
                        />
                    </template>
                </div>
            </div>
        </template>
        <template v-else>
            <template v-if="reconnecting">
                <EmptyState title="Reconnecting…">The shared page will appear when the connection returns.</EmptyState>
            </template>
            <template v-else>
                <main class="loading">
                    <Skeleton shape="text" :count="2" label="Loading the shared page" />
                </main>
            </template>
        </template>
        <Lightbox />
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
</style>
