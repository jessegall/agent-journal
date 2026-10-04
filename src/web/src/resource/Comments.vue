<script setup>
import HandledNote from "../kit/HandledNote.vue";
import Byline from "../kit/Byline.vue";
import {computed, inject, nextTick, reactive, ref, watch} from "vue";
import {useScope} from "../composables/scope.js";
import Btn from "../kit/Btn.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {quoted, withQuote} from "../format/quote.js";
import {age} from "../format/time.js";
import {markPassage, passageIn} from "../platform/passage.js";
import {usePromised} from "../composables/promised.js";
import Compose from "../chat/Compose.vue";

const props = defineProps({
    resource: Object,
    quote: {type: String, default: ""},
    showThread: {type: Boolean, default: true},
    compose: {type: Boolean, default: true},
    focus: {type: Number, default: 0},
});
const emit = defineEmits(["sent"]);
const talk = inject("talk", null);
const scope = useScope();
const list = ref(null);
const {pending, promise, change, keep, link, keyOf} = usePromised();
const saved = computed(() => scope.rows("comment").filter((c) => !c.deleted));
const unsaved = computed(() => pending.value.filter((p) => !p.written || !saved.value.some((c) => c.ref === p.written)));
watch(unsaved, keep);
const alive = computed(() => [...saved.value, ...unsaved.value]);
const thread = computed(() => alive.value.filter((c) => c.refs.includes(props.resource.ref)).map((c) => ({...c, ...quoted(c.brief)})));
const answers = computed(() => {
    const by = {};
    for (const c of alive.value) for (const ref of c.refs) if (ref.startsWith("comment:")) (by[ref] ||= []).push(c);
    return by;
});
const answersTo = (c) => answers.value[`comment:${c.n}`] || [];
const groups = computed(() => {
    const replies = props.resource.type === "message" ? thread.value.filter((c) => c.seen[0] === "agent") : [];
    return [
        {title: "Replies", rows: replies},
        {title: "Comments", rows: thread.value.filter((c) => !replies.includes(c))},
    ].filter((g) => g.rows.length);
});
const WHO = {user: "You", agent: "Agent"};
const who = (c) => c.data?.visitor || WHO[c.seen[0]] || c.seen[0] || "Someone";
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
const SHOWN = "comment-passage-shown";
const SHOWN_FOR = 2400;

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
    markPassage(SHOWN, range);
    setTimeout(() => markPassage(SHOWN, null), SHOWN_FOR);
}

const editing = reactive({n: 0, text: "", error: ""});

function edit(c) {
    Object.assign(editing, {n: c.n, text: c.brief, error: ""});
}

async function save() {
    editing.error = "";
    try {
        await scope.api.updateComment(editing.n, editing.text.trim());
        editing.n = 0;
    } catch (e) {
        editing.error = e.message;
    }
}

async function remove(c) {
    await scope.api.deleteComment(c.n);
}

const replying = reactive({n: 0, text: ""});

function reply(c) {
    Object.assign(replying, {n: c.n, text: ""});
}

async function post(made) {
    change(made, {failed: false});
    try {
        const written = await scope.api.act(made.target.type, made.target.n, made.target.action, {text: made.brief});
        link(`comment:${written.n}`, made.ref);
        change(made, {written: `comment:${written.n}`});
    } catch (e) {
        change(made, {failed: true});
    }
}

function comment(target, refs, brief) {
    const made = promise({type: "comment", brief, refs, target});
    post(made);
    return made;
}

function answer() {
    const text = replying.text.trim();
    if (!text) return;
    comment({type: "comment", n: replying.n, action: "reply"}, [`comment:${replying.n}`], text);
    Object.assign(replying, {n: 0, text: ""});
}

async function send(text) {
    const made = comment(
        {type: props.resource.type, n: props.resource.n, action: "comment"},
        [props.resource.ref],
        withQuote(props.quote, text)
    );
    emit("sent");
    await nextTick();
    const row = list.value?.querySelector(`[data-comment="${made.ref}"]`);
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
            <template v-for="group in groups" :key="group.title">
                <template v-if="groups.length > 1 || !talk">
                    <SectionHeading>{{ group.title }}</SectionHeading>
                </template>
                <template v-for="c in group.rows" :key="keyOf(c)">
                    <article
                        :class="['comment', {focused: c.n && c.n === props.focus, handled: c.completed, failed: c.failed}]"
                        :data-comment="c.pending ? c.ref : c.n"
                        @mouseenter="hover(c)"
                        @mouseleave="hover(null)"
                    >
                        <Byline :side="c.seen[0]" :name="who(c)" :when="age(c.created)">
                            <template v-if="!c.pending">
                                <span class="tools">
                                    <button type="button" class="tool" title="Edit this comment" @click="edit(c)">
                                        <Icon name="pencil" :size="12" />
                                    </button>
                                    <button type="button" class="tool" title="Delete this comment" @click="remove(c)">
                                        <Icon name="close" :size="12" />
                                    </button>
                                </span>
                            </template>
                        </Byline>
                        <template v-if="c.quote">
                            <button type="button" class="comment-quote" title="Show this passage in the document" @click="show(c)">
                                {{ plain(c.quote) }}
                            </button>
                        </template>
                        <template v-if="editing.n && editing.n === c.n">
                            <textarea v-model="editing.text" rows="3" @keydown.esc="editing.n = 0" @keydown.meta.enter.prevent="save" />
                            <span class="edit-row">
                                <Btn kind="primary" small @click="save">Save</Btn>
                                <Btn small @click="editing.n = 0">Cancel</Btn>
                                <template v-if="editing.error">
                                    <span class="error">{{ editing.error }}</span>
                                </template>
                            </span>
                        </template>
                        <template v-else>
                            <TextDisplay class="said" :text="c.text" />
                        </template>
                        <template v-if="c.failed">
                            <p class="unsaved">
                                Couldn't save ·
                                <button type="button" @click="post(c)">Try again</button>
                            </p>
                        </template>
                        <template v-if="c.completed">
                            <HandledNote>
                                <template v-if="c.outcome">
                                    <TextDisplay :text="c.outcome" />
                                </template>
                            </HandledNote>
                        </template>
                        <template v-if="answersTo(c).length">
                            <div class="answers">
                                <template v-for="a in answersTo(c)" :key="keyOf(a)">
                                    <div :class="['answer', {failed: a.failed}]" :data-comment="a.pending ? a.ref : a.n">
                                        <Byline :side="a.seen[0]" :name="who(a)" :when="age(a.created)" small />
                                        <TextDisplay class="said" :text="a.brief" />
                                        <template v-if="a.failed">
                                            <p class="unsaved">
                                                Couldn't save ·
                                                <button type="button" @click="post(a)">Try again</button>
                                            </p>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </template>
                        <template v-if="replying.n && replying.n === c.n">
                            <div class="reply-box">
                                <textarea
                                    v-model="replying.text"
                                    rows="2"
                                    placeholder="Reply…"
                                    @vue:mounted="({el}) => el.focus()"
                                    @keydown.esc="replying.n = 0"
                                    @keydown.enter.exact.prevent="answer"
                                />
                                <span class="edit-row">
                                    <Btn kind="primary" small @click="answer">Reply</Btn>
                                    <Btn small @click="replying.n = 0">Cancel</Btn>
                                </span>
                            </div>
                        </template>
                        <template v-else-if="!c.pending">
                            <button type="button" class="comment-reply-open" @click="reply(c)">
                                <Icon name="reply" :size="11" />
                                Reply
                            </button>
                        </template>
                    </article>
                </template>
            </template>
        </section>
    </template>
    <template v-if="props.compose">
        <div class="comment-write">
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

::highlight(comment-passage-shown) {
    background-color: color-mix(in srgb, var(--accent) 42%, transparent);
    color: var(--text);
}
</style>
