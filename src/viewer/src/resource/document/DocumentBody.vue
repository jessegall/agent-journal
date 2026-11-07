<script setup>
import {computed, ref, watch} from "vue";
import {render} from "../../text/index.js";
import Btn from "../../kit/Btn.vue";
import DropList from "../../kit/DropList.vue";
import Skeleton from "../../kit/Skeleton.vue";
import TimeAgo from "../../../kit/TimeAgo.vue";
import {useMeasuredWidth} from "../../composables/measuredWidth.js";
import CommentCard from "./CommentCard.vue";
import CommentComposer from "./CommentComposer.vue";
import DocumentSidebar from "./DocumentSidebar.vue";
import DocumentEditDialog from "./DocumentEditDialog.vue";
import {useTextComments} from "../../composables/textComments.js";
import DocumentRevisions from "./DocumentRevisions.vue";
import DocumentText from "./DocumentText.vue";
import {numbered} from "./documentMarks.js";

// the body of a document or a report: its tabs, its text with the comments beside it, and at the foot the comment box; the head, the actions and the links belong to the shared inspector layout
const NARROW_WIDTH = 760;
const props = defineProps({noun: {type: String, required: true}, id: {type: Number, required: true}, read: {type: Function, required: true}});
const panel = ref(null);
const width = useMeasuredWidth(panel);
const narrow = computed(() => width.value !== null && width.value < NARROW_WIDTH);
const row = ref(null);
const failure = ref("");
const revisions = ref([]);
const questions = ref([]);
const questionFailure = ref("");
const notesMode = ref("comments");
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

const textComments = useTextComments(() => row.value ? {noun: props.noun, id: props.id, title: row.value.title} : {}, (line) => props.read(line));
const comments = computed(() => numbered(textComments.comments.value));
const annotations = computed(() => notesMode.value === "questions" ? numbered(questions.value) : comments.value);
const annotationTotal = computed(() => notesMode.value === "questions" ? annotations.value.length : textComments.total.value);
const html = computed(() => (row.value?.body ? render(row.value.body, {env: "", rowNames: false, document: true}) : ""));
const chapters = computed(() => (row.value?.body ?? "").split("\n").filter((line) => /^#{1,4} /.test(line)).map((line, position) => ({key: String(position), value: position, label: line.replace(/^#+ /, "")})));
const inlineComment = computed(() => comments.value.find((comment) => comment.id === inline.value));
const stateLabel = computed(() => (row.value?.close_reason ? "Closed" : "Open"));
const shownTab = computed(() => (tab.value === "comments" && !narrow.value ? "text" : tab.value));
const rowsOf = (answer) => (answer.ok ? answer.value.rows ?? [] : []);

async function load() {
    const turn = ++reading;
    const answer = await props.read([props.noun, "inspect", String(props.id)]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    row.value = answer.ok ? answer.value : null;
    const questionsAnswer = await props.read(["question", "list", "--all", "--row", `${props.noun}:${props.id}`]);
    const revisionsAnswer = props.noun === "doc" ? await props.read(["doc", "revisions", String(props.id)]) : null;
    if (turn !== reading) return;
    questions.value = rowsOf(questionsAnswer);
    questionFailure.value = questionsAnswer.ok ? "" : questionsAnswer.error;
    revisions.value = revisionsAnswer ? rowsOf(revisionsAnswer) : [];
}

async function send(words) {
    const flags = selection.value ? ["--quote", selection.value.quote, "--position", String(selection.value.position), "--selection-type", selection.value.selection_type] : [];
    const answer = await props.read([props.noun, "comment", String(props.id), ...flags, "--", words]);
    if (!answer.ok) throw new Error(answer.error);
    selection.value = null;
    await Promise.all([load(), textComments.load()]);
}

async function closeRevision() {
    const answer = await props.read(["doc", "close", String(props.id)]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) await load();
}

function clearSelection() {
    if (!draft.value.trim()) selection.value = null;
}

function linked(id) {
    hot.value = id;
    if (narrow.value && notesMode.value === "questions") {
        tab.value = "comments";
        return;
    }
    if (narrow.value) inline.value = inline.value === id ? 0 : id;
    else panel.value.querySelector(notesMode.value === "questions" ? `[data-question-id="${id}"]` : `[data-comment-id="${id}"]`)?.scrollIntoView({block: "nearest"});
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

watch(() => `${props.noun}:${props.id}`, () => {
    row.value = null;
    tab.value = "text";
    hot.value = 0;
    inline.value = 0;
    selection.value = null;
    questions.value = [];
    questionFailure.value = "";
    load();
}, {immediate: true});

watch(notesMode, () => {
    hot.value = 0;
    inline.value = 0;
});
</script>

<template>
    <div ref="panel" class="document-inspector" data-document-inspector>
        <template v-if="row">
            <div class="document-edit" data-document-actions>
                <Btn bordered data-text-edit @click="editing = true">Edit</Btn>
            </div>
        </template>
        <nav class="document-tabs">
            <button type="button" :class="['document-tab-button', {on: shownTab === 'text'}]" data-document-tab="text" @click="tab = 'text'">Text</button>
            <template v-if="narrow">
                <button type="button" :class="['document-tab-button', {on: shownTab === 'comments'}]" data-document-tab="comments" @click="tab = 'comments'">{{ notesMode === 'questions' ? 'Questions' : 'Comments' }} <em>{{ annotationTotal || "" }}</em></button>
            </template>
            <template v-if="noun === 'doc'">
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
            <template v-else-if="shownTab === 'revisions'">
                <DocumentRevisions :id="id" :revisions="revisions" :text="row.body" :read="read" :editing="row.open_author_id !== null && row.open_author_id !== undefined" @close-revision="closeRevision" @restored="load" />
            </template>
            <template v-else-if="shownTab === 'comments'">
                <DocumentSidebar v-model:mode="notesMode" tab :comments="comments" :questions="questions" :hot="hot" :lost="lost" :failure="questionFailure" :read="read" :comment-more="Boolean(textComments.nextPage.value)" :comment-loading="textComments.loading.value" :comment-failure="textComments.failure.value" :comment-total="textComments.total.value" @more="textComments.loadMore" @show="showInText" @changed="load" />
            </template>
            <template v-else>
                <DocumentText ref="words" :html="html" :comments="annotations" :annotation-label="notesMode === 'questions' ? 'Question' : 'Comment'" :hot="hot" :pending="selection" :inline="inline" @select="selection = $event" @clear="clearSelection" @number="linked" @write="composer?.focus()" @lost="lost = $event">
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
                    <DocumentSidebar v-model:mode="notesMode" :comments="comments" :questions="questions" :hot="hot" :lost="lost" :failure="questionFailure" :read="read" :comment-more="Boolean(textComments.nextPage.value)" :comment-loading="textComments.loading.value" :comment-failure="textComments.failure.value" :comment-total="textComments.total.value" @more="textComments.loadMore" @show="showInText" @changed="load" />
                </template>
            </template>
        </div>
        <template v-if="row">
            <CommentComposer ref="composer" v-model:draft="draft" :selection="selection" :send="send" :narrow="narrow" @clear="selection = null" />
        </template>
        <template v-if="editing">
            <DocumentEditDialog :noun="noun" :id="id" :row="row" :read="read" @close="editing = false" @saved="saved" />
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

.document-edit {
    display: flex;
    flex: none;
    justify-content: flex-end;
    padding: 8px 16px 0;
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

@media (max-width: 760px) {
    .document-tabs {
        padding: 0 10px 0 12px;
    }

}
</style>
