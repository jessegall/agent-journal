<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import Icon from "../../kit/Icon.vue";
import {blockOf, drawMarks, selectionIn} from "./documentMarks.js";

// the document's text with its comments' selections drawn in it; selecting a piece of it offers a comment on it, and a selection's number leads to its comment
const props = defineProps({
    html: {type: String, required: true},
    comments: {type: Array, required: true},
    annotationLabel: {type: String, default: "Comment"},
    hot: {type: Number, default: 0},
    pending: {type: Object, default: null},
    inline: {type: Number, default: 0},
});
const emit = defineEmits(["select", "clear", "number", "write", "lost"]);
const box = ref(null);
const text = ref(null);
const pill = ref(null);
const selecting = ref(false);
const inlineHost = ref(null);

// drawing replaces the text, which would move a selection being made, so it waits until the selection has ended
function draw() {
    if (!text.value || selecting.value) return;
    text.value.innerHTML = props.html;
    const marks = props.comments.filter((comment) => comment.quote).map((comment) => ({...comment, label: props.annotationLabel, hot: comment.id === props.hot}));
    const lost = drawMarks(text.value, props.pending ? [...marks, {...props.pending, pending: true}] : marks);
    emit("lost", lost);
    const opened = props.inline && text.value.querySelector(`[data-comment="${props.inline}"]`);
    if (!opened) {
        inlineHost.value = null;
        return;
    }
    const host = document.createElement("div");
    host.className = "inline-comment";
    blockOf(opened).after(host);
    inlineHost.value = host;
}

function selectionChanged() {
    if (!text.value) return;
    const chosen = selectionIn(text.value);
    selecting.value = Boolean(chosen);
    if (!chosen) {
        pill.value = null;
        return;
    }
    const place = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const frame = box.value.getBoundingClientRect();
    pill.value = {left: `${Math.max(place.left - frame.left, 0)}px`, top: `${place.top - frame.top + box.value.scrollTop}px`};
    emit("select", chosen);
}

function clicked(event) {
    const number = event.target.closest("[data-comment-number]");
    if (number) emit("number", Number(number.dataset.commentNumber));
    else if (window.getSelection().isCollapsed) emit("clear");
}

function show(id) {
    text.value.querySelector(`[data-comment="${id}"]`)?.scrollIntoView({block: "center"});
}

function showHeading(position) {
    text.value.querySelectorAll("h3, h4, h5, h6")[position]?.scrollIntoView({block: "start"});
}

watch(() => [props.html, props.comments, props.annotationLabel, props.hot, props.inline, selecting.value, props.pending], draw, {flush: "post"});
onMounted(() => {
    draw();
    document.addEventListener("selectionchange", selectionChanged);
});
onBeforeUnmount(() => document.removeEventListener("selectionchange", selectionChanged));
defineExpose({show, showHeading, nextTick});
</script>

<template>
    <div ref="box" class="document-text">
        <div ref="text" class="md document-words" data-resource-text @click="clicked" />
        <template v-if="pill">
            <button type="button" class="comment-pill" :style="pill" data-comment-pill @mousedown.prevent @click="emit('write')"><Icon name="chat" :size="13" />Comment on this</button>
        </template>
        <template v-if="inlineHost">
            <Teleport :to="inlineHost"><slot name="inline" /></Teleport>
        </template>
        <slot />
    </div>
</template>

<style scoped>
.document-text {
    position: relative;
    flex: 1;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0;
}

.document-words {
    font-size: 14px;
    line-height: 1.7;
    overflow-wrap: anywhere;
}

.comment-pill {
    position: absolute;
    z-index: 4;
    display: inline-flex;
    gap: 6px;
    align-items: center;
    height: 28px;
    padding: 0 11px 0 9px;
    border: 0;
    border-radius: 14px;
    background: var(--text);
    color: var(--bg);
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: var(--shadow);
    cursor: pointer;
    transform: translateY(calc(-100% - 8px));
}

.document-words :deep(h3) {
    margin: 30px 0 8px;
    font-size: 16px;
    line-height: 1.35;
    font-weight: 600;
}

.document-words :deep(h3:first-child) {
    margin-top: 0;
}

.document-words :deep(p) {
    margin: 0 0 12px;
}

.document-words :deep(.chat-code-block) {
    position: relative;
    margin: 0 0 16px;
    padding-top: 29px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--code-bg);
    overflow: hidden;
}

.document-words :deep(.chat-code-block)::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 28px;
    padding-left: 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    content: attr(data-language);
    font-size: 11.5px;
    line-height: 28px;
}

.document-words :deep(.chat-code-copy) {
    position: absolute;
    z-index: 1;
    top: 4px;
    right: 6px;
    margin: 0;
}

.document-words :deep(pre.chat-code) {
    margin: 0;
    padding: 10px 0;
    border: 0;
    border-radius: 0;
    background: none;
    overflow-x: auto;
    overflow-y: hidden;
    font-size: 12px;
    line-height: 1.65;
    tab-size: 4;
}

.document-words :deep(pre.chat-code code) {
    display: block;
    width: max-content;
    min-width: 100%;
    padding: 0;
    background: none;
    font-size: inherit;
    overflow-wrap: normal;
}

.document-words :deep(.code-line) {
    display: block;
    padding: 0 14px;
    white-space: pre;
}

.document-words :deep(table) {
    display: block;
    width: max-content;
    max-width: 100%;
    margin: 0 0 16px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 9px;
    font-size: 13px;
    line-height: 1.5;
}

.document-words :deep(mark) {
    border-radius: 3px;
    padding: 1px 0;
    background: none;
    color: inherit;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
}

.document-words :deep(.selection-comment) {
    background: color-mix(in srgb, var(--accent) 22%, transparent);
}

.document-words :deep(mark.selection-comment) {
    box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--accent) 70%, transparent);
}

.document-words :deep(.selection-comment.hot) {
    background: color-mix(in srgb, var(--accent) 42%, transparent);
}

.document-words :deep(tr.selection-comment td) {
    background: color-mix(in srgb, var(--accent) 16%, transparent);
}

.document-words :deep(tr.selection-comment.hot td) {
    background: color-mix(in srgb, var(--accent) 32%, transparent);
}

.document-words :deep(.selection-pending) {
    background: color-mix(in srgb, var(--accent) 40%, transparent);
    box-shadow: inset 0 -2px 0 var(--accent);
}

.document-words :deep(.comment-number) {
    display: inline-grid;
    place-items: center;
    width: 17px;
    height: 17px;
    margin: 0 2px 0 4px;
    padding: 0;
    border: 0;
    border-radius: 9px;
    background: var(--accent);
    color: #fff;
    font-size: 10.5px;
    font-weight: 600;
    line-height: 1;
    vertical-align: 1px;
    cursor: pointer;
}

.document-words :deep(.code-line .comment-number) {
    position: sticky;
    left: 8px;
    margin: 0 8px 0 -6px;
}

.document-words :deep(.inline-comment) {
    margin: -2px 0 14px;
}
</style>
