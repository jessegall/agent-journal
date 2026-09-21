<script setup>
import {computed, nextTick, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import {route} from "../route.js";
import {age, quoted, rows, withQuote} from "../store.js";
import Compose from "../chat/Compose.vue";
import Markdown from "./Markdown.vue";

const props = defineProps({
    resource: Object,
    quote: {type: String, default: ""},
    showThread: {type: Boolean, default: true},
    compose: {type: Boolean, default: true},
    focus: {type: Number, default: 0},
});
const emit = defineEmits(["sent"]);
const list = ref(null);
const thread = computed(() =>
    rows("comment")
        .filter((c) => c.refs.includes(props.resource.ref) && !c.deleted)
        .map((c) => ({...c, ...quoted(c.brief)}))
);
const groups = computed(() => {
    const replies = props.resource.type === "message" ? thread.value.filter((c) => c.seen[0] === "agent") : [];
    return [
        {title: "Replies", rows: replies},
        {title: "Comments", rows: thread.value.filter((c) => !replies.includes(c))},
    ].filter((g) => g.rows.length);
});

async function focusComment() {
    if (!props.focus) return;
    await nextTick();
    const row = list.value?.querySelector(`[data-comment="${props.focus}"]`);
    if (row) row.scrollIntoView({behavior: "smooth", block: "center"});
}

watch([() => props.focus, thread], focusComment, {immediate: true, flush: "post"});

const editing = reactive({n: 0, text: "", error: ""});

function edit(c) {
    Object.assign(editing, {n: c.n, text: c.brief, error: ""});
}

async function save() {
    editing.error = "";
    try {
        await api.act("comment", editing.n, "update", {brief: editing.text.trim()});
        editing.n = 0;
    } catch (e) {
        editing.error = e.message;
    }
}

async function remove(c) {
    await api.act("comment", c.n, "delete", {why: "deleted from the viewer"});
}

async function send(text) {
    const written = await api.act(props.resource.type, props.resource.n, "comment", {text: withQuote(props.quote, text)});
    emit("sent");
    await nextTick();
    const row = document.querySelector(`[data-comment="${written.n}"]`);
    if (row) row.scrollIntoView({behavior: "smooth", block: "nearest"});
}
</script>

<template>
    <template v-if="props.showThread">
        <section ref="list" class="comments">
            <template v-if="!thread.length">
                <p class="none">No comments yet.</p>
            </template>
            <template v-for="group in groups" :key="group.title">
                <h3>{{ group.title }}</h3>
                <template v-for="c in group.rows" :key="c.n">
                    <div :class="['comment', c.seen[0], {focused: c.n === props.focus}]" :data-comment="c.n">
                        <span class="who">
                            {{ c.seen[0] }} · {{ age(c.created) }}
                            <span class="tools">
                                <button type="button" class="tool" title="Edit this comment" @click="edit(c)">Edit</button>
                                <button type="button" class="tool" title="Delete this comment" @click="remove(c)">Delete</button>
                            </span>
                        </span>
                        <template v-if="editing.n === c.n">
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
                            <template v-if="c.quote">
                                <span class="quoted">{{ c.quote }}</span>
                            </template>
                            <Markdown :text="c.text" />
                        </template>
                        <template v-if="c.completed">
                            <p class="done">
                                <span class="done-label">Handled:</span>
                                <Markdown class="done-text" :text="c.outcome" />
                            </p>
                        </template>
                    </div>
                </template>
            </template>
        </section>
    </template>
    <template v-if="props.compose">
        <div class="comment-write">
            <Compose placeholder="Comment…" submit="Comment" :quote="quote" :send="send" @unquote="emit('sent')" />
        </div>
    </template>
</template>

<style scoped>
.comments {
    margin-top: 20px;
}

.comment + h3 {
    margin-top: 18px;
}

h3 {
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.comment {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 12px;
    margin-bottom: 6px;
    border-radius: 8px;
    background: var(--raised);
}

.comment.agent {
    border-left: 2px solid var(--accent);
}

.comment.focused {
    outline: 1px solid var(--accent);
    outline-offset: 2px;
}

.who {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-3);
    font-size: 11.5px;
}

.tools {
    margin-left: auto;
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.comment:hover .tools,
.comment:focus-within .tools {
    opacity: 1;
}

.tool {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-3);
    font-size: 11px;
    cursor: pointer;
}

.tool:hover {
    color: var(--text);
}

textarea {
    width: 100%;
    margin-top: 4px;
    padding: 6px 8px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    font: inherit;
    resize: vertical;
}

.edit-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
}

.error {
    color: var(--danger);
    font-size: 11.5px;
}

.done {
    margin: 6px 0 0;
    color: var(--text-3);
}

.done-label {
    margin-right: 5px;
    color: var(--text-2);
}

.done-text {
    display: inline;
}

.done-text :deep(p) {
    display: inline;
    margin: 0;
}

.quoted {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 2px 0 6px;
    padding: 2px 0 2px 9px;
    border-left: 2px solid var(--accent);
    white-space: pre-wrap;
    color: var(--text-3);
    font-size: 12px;
}

.comment-write {
    position: sticky;
    bottom: 0;
    margin: 12px -20px 0;
    padding: 10px 20px 14px;
    background: var(--bg);
}
</style>
