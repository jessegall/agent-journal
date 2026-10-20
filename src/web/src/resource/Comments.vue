<script setup>
import Byline from "../kit/Byline.vue";
import {computed, inject, nextTick, reactive, ref, watch} from "vue";
import {useScope} from "../composables/scope.js";
import Btn from "../kit/Btn.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {quoted, withQuote} from "../format/quote.js";
import {age} from "../format/time.js";
import {markPassage, passageIn} from "../platform/passage.js";
import {pendingRow} from "../domain/placeholders.js";
import {createdAt, refOf} from "../domain/row.js";
import {optimistic} from "../sync/rows.js";
import Compose from "../chat/Compose.vue";
import QuickCommentBar from "../kit/QuickCommentBar.vue";

const props = defineProps({
    resource: Object,
    quote: {type: String, default: ""},
    showThread: {type: Boolean, default: true},
    compose: {type: Boolean, default: true},
    focus: {type: Number, default: 0},
});
const emit = defineEmits(["sent"]);
const talk = inject("talk", null);
const discussion = inject("discussion", null);
const scope = useScope();
const list = ref(null);
const on = computed(() => refOf(props.resource));
const onRow = computed(() =>
    scope
        .rows("comments")
        .filter((c) => (c.on || []).includes(on.value))
        .sort((a, b) => createdAt(a) - createdAt(b))
        .map((c) => ({...c, ...quoted(c.data?.visitor ? c.data.detail : c.text)}))
);
// the thread: each comment that answers none, followed by the replies under it, in order; a reply whose comment is gone stands on its own
const thread = computed(() => {
    const ids = new Set(onRow.value.map((c) => c.id));
    const tops = onRow.value.filter((c) => !c.reply_to || !ids.has(c.reply_to));
    return tops.flatMap((top) => [top, ...onRow.value.filter((c) => c.reply_to === top.id && c !== top).map((c) => ({...c, under: top.id}))]);
});
const replying = reactive({id: 0, text: "", error: ""});
const replyTo = (c) => Object.assign(replying, {id: c.id, text: "", error: ""});

async function sendReply() {
    const text = replying.text.trim();
    if (!text) return;
    replying.error = "";
    try {
        await scope.api.create("comments", {on: on.value, text, reply_to: replying.id});
        Object.assign(replying, {id: 0, text: ""});
    } catch (e) {
        replying.error = e.message;
    }
}
const WHO = {user: "You", agent: "Agent"};
const who = (c) => c.data?.visitor || WHO[c.author] || "Someone";
const plain = (text) => text.replace(/`/g, "");

async function focusComment() {
    if (!props.focus) return;
    await nextTick();
    const row = list.value?.querySelector(`[data-comment="${props.focus}"]`);
    if (row) row.scrollIntoView({behavior: "smooth", block: "center"});
}

watch([() => props.focus, thread], focusComment, {immediate: true, flush: "post"});

const page = () => list.value?.closest(".document")?.querySelector(".document-body");
const HOVERED = "comment-passage";
const MARKED = "comment-passage-marked";
const MARKED_FOR = 2400;

function hover(c) {
    markPassage(HOVERED, c && c.quote ? passageIn(page(), c.quote) : null);
}

async function show(c) {
    const range = passageIn(page(), c.quote);
    if (!range) return;
    const at = range.startContainer.parentElement;
    at.closest(".folded-body")?.dispatchEvent(new Event("reveal"));
    await nextTick();
    at.scrollIntoView({behavior: "smooth", block: "center"});
    markPassage(MARKED, range);
    setTimeout(() => markPassage(MARKED, null), MARKED_FOR);
}

const editing = reactive({id: 0, text: "", error: ""});

function edit(c) {
    Object.assign(editing, {id: c.id, text: c.text, error: ""});
}

async function save() {
    editing.error = "";
    try {
        await scope.api.change("comments", editing.id, {text: editing.text.trim()});
        editing.id = 0;
    } catch (e) {
        editing.error = e.message;
    }
}

const remove = (c) => scope.api.act("comments", c.id, "delete");
const notSaved = ref("");

function comment(text) {
    notSaved.value = "";
    const made = pendingRow("comments", {text, on: [on.value]}, {author: "user"});
    optimistic("comments", made, () => scope.api.comment(on.value, text)).catch((e) => (notSaved.value = e.message));
    return made;
}

const quick = (text) => comment(text);

async function send(text) {
    const made = comment(withQuote(props.quote, text));
    emit("sent");
    await nextTick();
    const row = list.value?.querySelector(`[data-comment="${made.key}"]`);
    if (row) row.scrollIntoView({behavior: "smooth", block: "nearest"});
}
</script>

<template>
    <template v-if="props.showThread">
        <section ref="list" class="comments">
            <template v-if="talk">
                <header class="comments-head">
                    <span class="comments-title">Comments</span>
                    <template v-if="thread.length">
                        <span class="comments-count">{{ thread.length }}</span>
                    </template>
                    <span class="grow" />
                    <template v-if="discussion">
                        <button type="button" :class="['discussion', {on: discussion.on.value}]" :title="discussion.on.value ? 'Back to the document alone' : 'Show the chat beside the document'" @click="discussion.toggle()">
                            {{ discussion.on.value ? "Close discussion" : "Discussion" }}
                        </button>
                    </template>
                    <CloseButton title="Close the comments" @click="talk.toggle()" />
                </header>
            </template>
            <template v-if="!thread.length">
                <div class="none">
                    <Icon name="bubble" :size="16" />
                    <p>No comments yet.</p>
                    <p class="none-hint">Select text in the document to comment on that passage.</p>
                </div>
            </template>
            <template v-for="c in thread" :key="c.key || c.id">
                <article
                    :class="['comment', {focused: c.id && c.id === props.focus, under: c.under}]"
                    :data-comment="c.id || c.key"
                    @mouseenter="hover(c)"
                    @mouseleave="hover(null)"
                >
                    <Byline :side="c.author" :name="who(c)" :when="age(createdAt(c))">
                        <template v-if="!c.pending">
                            <span class="tools">
                                <button type="button" class="tool" title="Reply under this comment" @click="replyTo(c)">
                                    <Icon name="bubble" :size="12" />
                                </button>
                                <template v-if="c.author === 'user'">
                                    <button type="button" class="tool" title="Edit this comment" @click="edit(c)">
                                        <Icon name="pencil" :size="12" />
                                    </button>
                                    <button type="button" class="tool" title="Delete this comment" @click="remove(c)">
                                        <Icon name="close" :size="12" />
                                    </button>
                                </template>
                            </span>
                        </template>
                    </Byline>
                    <template v-if="c.quote">
                        <button type="button" class="comment-quote" title="Show this passage in the document" @click="show(c)">
                            {{ plain(c.quote) }}
                        </button>
                    </template>
                    <template v-if="editing.id && editing.id === c.id">
                        <textarea v-model="editing.text" rows="3" @keydown.esc="editing.id = 0" @keydown.meta.enter.prevent="save" />
                        <span class="edit-row">
                            <Btn kind="primary" small @click="save">Save</Btn>
                            <Btn small @click="editing.id = 0">Cancel</Btn>
                            <template v-if="editing.error">
                                <span class="error">{{ editing.error }}</span>
                            </template>
                        </span>
                    </template>
                    <template v-else>
                        <TextDisplay class="said" :text="c.text" />
                    </template>
                    <template v-if="replying.id && replying.id === c.id">
                        <textarea v-model="replying.text" rows="2" placeholder="Reply…" @keydown.esc="replying.id = 0" @keydown.meta.enter.prevent="sendReply" />
                        <span class="edit-row">
                            <Btn kind="primary" small @click="sendReply">Reply</Btn>
                            <Btn small @click="replying.id = 0">Cancel</Btn>
                            <template v-if="replying.error">
                                <span class="error">{{ replying.error }}</span>
                            </template>
                        </span>
                    </template>
                </article>
            </template>
        </section>
    </template>
    <template v-if="props.compose">
        <template v-if="notSaved">
            <p class="unsaved">Couldn't save the comment: {{ notSaved }}</p>
        </template>
        <template v-if="!props.showThread">
            <QuickCommentBar :send="quick" :count="talk ? thread.length : 0" @show="talk.toggle()" />
        </template>
        <div v-else class="comment-write">
            <Compose
                :placeholder="quote ? 'Say something about this passage…' : 'Write a comment…'"
                submit="Comment"
                :quote="quote"
                :send="send"
                @unquote="emit('sent')"
            />
        </div>
    </template>
</template>

<style scoped>
.comments {
    margin-top: 20px;
}

.comments-head {
    position: sticky;
    top: -16px;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: -16px -16px 10px;
    padding: 12px 12px 10px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--side);
}

.discussion {
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.discussion:hover,
.discussion.on {
    border-color: var(--accent);
    color: var(--accent-text);
}

.comments-title {
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.comments-count {
    padding: 0 6px;
    border-radius: 99px;
    background: var(--hover);
    color: var(--text-3);
    font-size: 11px;
    line-height: 17px;
    font-variant-numeric: tabular-nums;
}

.grow {
    flex: 1;
}

.none {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 36px 12px;
    color: var(--text-3);
    text-align: center;
}

.none p {
    margin: 0;
    font-size: 12.5px;
}

.none .none-hint {
    color: var(--text-4);
    font-size: 12px;
}

.comment {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 8px;
    padding: 10px 12px 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
    transition: border-color 0.15s;
}

.comment:hover {
    border-color: var(--border-2);
}

.comment.focused {
    border-color: var(--accent);
}

.tools {
    display: flex;
    gap: 2px;
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.comment:hover .tools,
.comment:focus-within .tools {
    opacity: 1;
}

.tool {
    display: inline-grid;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.tool:hover {
    background: var(--hover);
    color: var(--text);
}

.unsaved {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}

.unsaved button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
}

.comment.failed,
.answer.failed .said {
    border-color: color-mix(in srgb, var(--danger) 40%, transparent);
}

.comment-quote {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    padding: 1px 0 1px 10px;
    border: 0;
    border-left: 2px solid color-mix(in srgb, var(--accent) 60%, transparent);
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    line-height: 1.5;
    text-align: left;
    white-space: pre-wrap;
    cursor: pointer;
}

.comment-quote:hover {
    border-left-color: var(--accent);
    color: var(--text-2);
}

.said {
    color: var(--text);
    font-size: 13px;
    line-height: 1.55;
}

.said :deep(p) {
    margin: 0 0 6px;
}

.said :deep(p:last-child) {
    margin-bottom: 0;
}

.comment.handled .said,
.comment.handled .comment-quote {
    opacity: 0.72;
}

.answers {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 2px 0 0 9px;
    padding-left: 12px;
    border-left: 1px solid var(--border-2);
}

.answer {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.answer .said {
    font-size: 12.5px;
}

.comment-reply-open {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin: 0 0 0 -4px;
    padding: 2px 6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-4);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
    transition: color 0.15s ease;
}

.comment:hover .comment-reply-open {
    color: var(--text-3);
}

.comment-reply-open:hover {
    background: var(--hover);
    color: var(--text);
}

.reply-box {
    display: flex;
    flex-direction: column;
}

textarea {
    width: 100%;
    box-sizing: border-box;
    margin-top: 2px;
    padding: 7px 9px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    resize: vertical;
}

textarea:focus {
    border-color: var(--accent);
    outline: none;
}

.comment.under {
    margin-left: 18px;
    padding-left: 10px;
    border-left: 2px solid var(--border);
}

.edit-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
}

.error {
    color: var(--danger);
    font-size: 11.5px;
}

.comment-write {
    position: sticky;
    bottom: 0;
    margin: 12px -16px 0;
    padding: 8px 16px 10px;
    background: var(--bg);
}

.comment-write :deep(textarea) {
    min-height: 34px;
    transition: min-height 0.15s ease-out;
}

.comment-write :deep(textarea:focus) {
    min-height: 74px;
}
</style>

<style>
::highlight(comment-passage) {
    background-color: color-mix(in srgb, var(--accent) 22%, transparent);
}

::highlight(comment-passage-marked) {
    background-color: color-mix(in srgb, var(--accent) 42%, transparent);
    color: var(--text);
}
</style>
