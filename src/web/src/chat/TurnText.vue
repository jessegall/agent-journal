<script setup>
import Folded from "../kit/Folded.vue";

defineProps({html: {type: String, required: true}, foldAt: {type: Number, required: true}, keep: {type: Number, required: true}});
const emit = defineEmits(["activate"]);
</script>

<template>
    <Folded :at="foldAt" :keep="keep">
        <div class="thread-text" @click="emit('activate', $event)" v-html="html" />
    </Folded>
</template>

<style scoped>
.thread-text :deep(p) {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    text-wrap: pretty;
}

.thread-text :deep(p + p) {
    margin-top: 0.7em;
}

.thread-text :deep(code) {
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.92em;
}

.thread-text :deep(:not(pre) > code) {
    white-space: nowrap;
}

.thread-text :deep(pre.chat-code) {
    margin: 6px 0;
    padding: 9px 11px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre;
}

.thread-text :deep(pre.chat-code code) {
    padding: 0;
    background: none;
    font-size: inherit;
}

.thread-text :deep(table) {
    display: block;
    max-width: 100%;
    margin: 6px 0;
    overflow-x: auto;
    border-collapse: collapse;
    font-size: 12px;
}

.thread-text :deep(th),
.thread-text :deep(td) {
    padding: 4px 8px;
    border: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
    white-space: nowrap;
}

.thread-text :deep(th) {
    color: var(--text);
    background: var(--raised);
    font-weight: 600;
}

.thread-text :deep(a) {
    color: var(--accent-text);
}

.thread-text :deep(.file-pill) {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
}

.thread-text :deep(.file-pill .ico) {
    width: 11px;
    height: 11px;
}

.thread-text :deep(.console-card) {
    position: relative;
    margin: 0.5em 0 0.8em;
    padding: 10px 12px 9px;
    border: 1px solid #3a2a2a;
    border-radius: 8px;
    background: #121012;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    line-height: 1.5;
    overflow-x: auto;
}

.thread-text :deep(.console-label) {
    position: absolute;
    bottom: 5px;
    right: 9px;
    font-size: 9.5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #6b5c5c;
}

.thread-text :deep(.console-entry + .console-entry) {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #2a2222;
}

.thread-text :deep(.console-head) {
    color: #f0a0a0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.thread-text :deep(.console-frame) {
    padding-left: 1.6em;
    color: var(--text-3);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.thread-text :deep(.console-more) {
    margin-top: 6px;
}

.thread-text :deep(.console-more summary) {
    cursor: pointer;
    list-style: none;
    color: var(--accent-text);
    font-size: 11px;
}

.thread-text :deep(.console-more-expanded) {
    display: none;
}

.thread-text :deep(.console-more[open] .console-more-collapsed) {
    display: none;
}

.thread-text :deep(.console-more[open] .console-more-expanded) {
    display: inline;
}
</style>
