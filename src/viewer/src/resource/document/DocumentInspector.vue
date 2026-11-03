<script setup>
import {computed, ref, watch} from "vue";
import {shareAddress} from "../../route.js";
import {render} from "../../text/index.js";
import {cliOf} from "../../domain/resourceKinds.js";
import Btn from "../../kit/Btn.vue";
import CloseButton from "../../kit/CloseButton.vue";
import DropList from "../../kit/DropList.vue";
import Icon from "../../kit/Icon.vue";
import Skeleton from "../../kit/Skeleton.vue";
import TimeAgo from "../../../kit/TimeAgo.vue";
import {useMeasuredWidth} from "../../composables/measuredWidth.js";
import RowMoves from "../RowMoves.vue";
import CommentCard from "./CommentCard.vue";
import CommentComposer from "./CommentComposer.vue";
import CommentRail from "./CommentRail.vue";
import DocumentEditDialog from "./DocumentEditDialog.vue";
import DocumentLinks from "./DocumentLinks.vue";
import DocumentRevisions from "./DocumentRevisions.vue";
import DocumentText from "./DocumentText.vue";
import {numbered} from "./documentMarks.js";

// a document or a report: its title, its tabs, its text with the comments beside it, and at the foot the comment box and the actions, which never scroll away
const NARROW_WIDTH = 760;
const KIND_LABELS = {doc: "Document", report: "Report"};
const props = defineProps({table: {type: String, required: true}, id: {type: Number, required: true}, backed: Boolean, read: {type: Function, required: true}});
const emit = defineEmits(["close", "back"]);
const panel = ref(null);
const width = useMeasuredWidth(panel);
const narrow = computed(() => width.value !== null && width.value < NARROW_WIDTH);
const kind = computed(() => cliOf(props.table));
const row = ref(null);
const failure = ref("");
const links = ref([]);
const revisions = ref([]);
const tab = ref("text");
const hot = ref(0);
const inline = ref(0);
const lost = ref([]);
const selection = ref(null);
const draft = ref("");
const editing = ref(false);
const words = ref(null);
const composer = ref(null);
let reading = 0;

const comments = computed(() => numbered(row.value?.comments ?? []));
const html = computed(() => (row.value?.body ? render(row.value.body, {env: "", rowNames: false}) : ""));
const chapters = computed(() => (row.value?.body ?? "").split("\n").filter((line) => /^#{1,4} /.test(line)).map((line, position) => ({key: String(position), value: position, label: line.replace(/^#+ /, "")})));
const inlineComment = computed(() => comments.value.find((comment) => comment.id === inline.value));
const stateLabel = computed(() => (row.value?.close_reason ? "Closed" : "Open"));
const shownTab = computed(() => (tab.value === "comments" && !narrow.value ? "text" : tab.value));
const rowsOf = (answer) => (answer.ok ? answer.value.rows ?? [] : []);

async function load() {
    const turn = ++reading;
    const answer = await props.read([kind.value, "inspect", String(props.id)]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    row.value = answer.ok ? answer.value : null;
    links.value = rowsOf(await props.read(["link", "list", "--source", `${kind.value}:${props.id}`]));
    if (kind.value === "doc") revisions.value = rowsOf(await props.read(["doc", "revisions", String(props.id)]));
}

async function send(words) {
    const flags = selection.value ? ["--quote", selection.value.quote, "--position", String(selection.value.position), "--selection-type", selection.value.selection_type] : [];
    const answer = await props.read([kind.value, "comment", String(props.id), ...flags, "--", words]);
    if (!answer.ok) throw new Error(answer.error);
    selection.value = null;
    await load();
}

function clearSelection() {
    if (!draft.value.trim()) selection.value = null;
}

function linked(id) {
    hot.value = id;
    if (narrow.value) inline.value = inline.value === id ? 0 : id;
    else panel.value.querySelector(`[data-comment-id="${id}"]`)?.scrollIntoView({block: "nearest"});
}

async function showInText(id) {
    tab.value = "text";
    hot.value = id;
    await words.value?.nextTick();
    words.value?.show(id);
}

function saved() {
    editing.value = false;
    load();
}

watch(() => `${props.table}:${props.id}`, () => {
    row.value = null;
    tab.value = "text";
    hot.value = 0;
    inline.value = 0;
    selection.value = null;
    load();
}, {immediate: true});
</script>

<template>
    <div ref="panel" class="document-inspector" data-document-inspector>
        <header class="document-head">
            <template v-if="backed">
                <button type="button" class="document-back" data-resource-back aria-label="Back" @click="emit('back')">←</button>
            </template>
            <div class="document-names">
                <p class="document-kind">{{ KIND_LABELS[kind] }} {{ id }}<template v-if="row"> · {{ stateLabel }}</template></p>
                <h2 data-resource-title>{{ row?.title }}</h2>
                <template v-if="row?.abstract">
                    <p class="document-abstract">{{ row.abstract }}</p>
                </template>
            </div>
            <CloseButton title="Close the panel" data-resource-close @click="emit('close')" />
        </header>
        <nav class="document-tabs">
            <button type="button" :class="['document-tab-button', {on: shownTab === 'text'}]" data-document-tab="text" @click="tab = 'text'">Text</button>
            <template v-if="narrow">
                <button type="button" :class="['document-tab-button', {on: shownTab === 'comments'}]" data-document-tab="comments" @click="tab = 'comments'">Comments <em>{{ comments.length || "" }}</em></button>
            </template>
            <button type="button" :class="['document-tab-button', {on: shownTab === 'links'}]" data-document-tab="links" @click="tab = 'links'">Links <em>{{ links.length || "" }}</em></button>
            <template v-if="kind === 'doc'">
                <button type="button" :class="['document-tab-button', {on: shownTab === 'revisions'}]" data-document-tab="revisions" @click="tab = 'revisions'">Revisions <em>{{ revisions.length || "" }}</em></button>
            </template>
            <span class="document-tabs-space" />
            <template v-if="shownTab === 'text' && chapters.length > 1">
                <DropList :label="narrow ? '' : 'Chapters'" icon="list" :items="chapters" data-text-chapters @pick="words?.showHeading($event.value)" />
            </template>
        </nav>
        <div class="document-body">
            <template v-if="failure">
                <p class="document-failure" role="alert" data-resource-failure>{{ failure }}</p>
            </template>
            <template v-else-if="!row">
                <div class="document-loading"><Skeleton /></div>
            </template>
            <template v-else-if="shownTab === 'links'">
                <DocumentLinks :links="links" />
            </template>
            <template v-else-if="shownTab === 'revisions'">
                <DocumentRevisions :id="id" :revisions="revisions" :read="read" />
            </template>
            <template v-else-if="shownTab === 'comments'">
                <CommentRail tab :comments="comments" :hot="hot" :lost="lost" @show="showInText" />
            </template>
            <template v-else>
                <DocumentText ref="words" :html="html" :comments="comments" :hot="hot" :pending="selection" :inline="inline" @select="selection = $event" @clear="clearSelection" @number="linked" @write="composer?.focus()" @lost="lost = $event">
                    <template #inline>
                        <template v-if="inlineComment">
                            <CommentCard :comment="inlineComment" hot @show="showInText(inlineComment.id)" />
                        </template>
                    </template>
                    <dl class="document-details" data-resource-fields>
                        <h4>Details</h4>
                        <dt>State</dt><dd>{{ stateLabel }}</dd>
                        <template v-if="row.close_reason">
                            <dt>Why closed</dt><dd>{{ row.close_reason }}</dd>
                        </template>
                        <dt>Created</dt><dd><TimeAgo :at="row.created_at" /></dd>
                        <dt>Updated</dt><dd><TimeAgo :at="row.updated_at" /></dd>
                    </dl>
                </DocumentText>
                <template v-if="!narrow">
                    <CommentRail :comments="comments" :hot="hot" :lost="lost" @show="showInText" />
                </template>
            </template>
        </div>
        <template v-if="row">
            <CommentComposer ref="composer" v-model:draft="draft" :selection="selection" :send="send" :narrow="narrow" @clear="selection = null" />
            <footer class="document-foot" data-document-foot>
                <a class="document-share" data-resource-share :href="shareAddress(`${table}:${id}`)"><Icon name="share" :size="12" />Share</a>
                <Btn bordered data-text-edit @click="editing = true">Edit</Btn>
                <span class="document-tabs-space" />
                <RowMoves inline :kind="kind" :id="id" :row="row" :read="read" @done="load" />
            </footer>
        </template>
        <template v-if="editing">
            <DocumentEditDialog :kind="kind" :id="id" :row="row" :read="read" @close="editing = false" @saved="saved" />
        </template>
    </div>
</template>

<style scoped>
.document-inspector {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.document-head {
    display: flex;
    flex: none;
    gap: 12px;
    align-items: flex-start;
    padding: 18px 14px 12px 24px;
}

.document-back {
    flex: none;
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font-size: 16px;
    cursor: pointer;
}

.document-names {
    flex: 1;
    min-width: 0;
}

.document-kind {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 12px;
}

h2 {
    margin: 0;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
}

.document-abstract {
    max-width: 640px;
    margin: 6px 0 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.document-tabs {
    display: flex;
    flex: none;
    gap: 2px;
    align-items: center;
    padding: 0 14px 0 20px;
    border-bottom: 1px solid var(--border);
}

.document-tab-button {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    height: 36px;
    margin: 0 4px;
    padding: 0 6px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.document-tab-button.on {
    border-bottom-color: var(--accent);
    color: var(--text);
}

.document-tab-button em {
    color: var(--text-4);
    font-size: 11.5px;
    font-style: normal;
}

.document-tabs-space {
    flex: 1;
}

.document-body {
    display: flex;
    flex: 1;
    min-height: 0;
}

.document-loading {
    flex: 1;
    padding: 22px 24px;
}

.document-failure {
    margin: 22px 24px;
    color: var(--danger);
    font-size: 12.5px;
}

.document-details {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 4px 12px;
    max-width: 660px;
    margin: 26px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    font-size: 12px;
}

.document-details h4 {
    grid-column: 1 / -1;
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
}

.document-details dt {
    color: var(--text-4);
}

.document-details dd {
    margin: 0;
    color: var(--text-2);
}

.document-foot {
    display: flex;
    flex: none;
    gap: 6px;
    align-items: center;
    padding: 9px 14px 10px 20px;
    border-top: 1px solid var(--border);
    background: var(--bg);
}

.document-share {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    height: 28px;
    padding: 0 11px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    color: var(--text-2);
    font-size: 12.5px;
    text-decoration: none;
}

.document-share:hover {
    background: var(--hover);
    color: var(--text);
}

@media (max-width: 760px) {
    .document-head {
        padding: 16px 10px 10px 16px;
    }

    h2 {
        font-size: 17px;
    }

    .document-tabs {
        padding: 0 10px 0 12px;
    }

    .document-foot {
        padding: 8px 12px 9px;
    }
}
</style>
