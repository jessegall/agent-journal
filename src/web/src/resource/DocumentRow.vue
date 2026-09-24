<script setup>
import {computed} from "vue";
import PageThumb from "../kit/PageThumb.vue";
import {age} from "../format/time.js";
import MarkedText from "../kit/MarkedText.vue";
import {standing} from "../domain/documents.js";
import {linkedTo} from "../domain/records.js";

const props = defineProps({
    doc: Object,
    hit: {type: Object, default: null},
    words: {type: Array, default: () => []},
    shelf: {type: String, default: ""},
});
const emit = defineEmits(["open"]);
const DAY = 86400;
const state = computed(() => standing(props.doc));
const files = computed(() => Object.keys(props.doc.data.files || {}).length);
const links = computed(() => new Set([...props.doc.refs, ...linkedTo(props.doc.ref).map((r) => r.ref)]).size);
const changed = computed(() => props.doc.updated || props.doc.created);
const fresh = computed(() => Date.now() / 1000 - changed.value < DAY);
const plural = (n, one) => `${n} ${one}${n === 1 ? "" : "s"}`;
const facts = computed(() =>
    [
        `Doc ${props.doc.n}`,
        props.doc.sections.length ? plural(props.doc.sections.length, "part") : "",
        files.value ? plural(files.value, "file") : "",
        links.value ? plural(links.value, "link") : "",
        props.shelf ? `in ${props.shelf}` : "",
    ].filter(Boolean)
);
const summary = computed(() => props.hit?.text || props.doc.abstract || props.doc.brief || "");
</script>

<template>
    <button type="button" :class="['doc-row', state.key]" @click="emit('open', doc)">
        <PageThumb :lines="doc.sections.length" :draft="state.key === 'draft'" :clipped="files > 0" :fresh="fresh" />
        <span class="doc-row-main">
            <span class="doc-row-title">
                <MarkedText :text="doc.title" :words="words" />
                <template v-if="state.key !== 'final'">
                    <span class="doc-row-state" :title="state.hint">{{ state.label }}</span>
                </template>
            </span>
            <template v-if="summary">
                <span class="doc-row-summary">
                    <template v-if="hit?.where">
                        <span class="doc-row-where">{{ hit.where }}</span>
                    </template>
                    <MarkedText :text="summary" :words="words" />
                </span>
            </template>
            <span class="doc-row-facts">
                <template v-for="(f, i) in facts" :key="f">
                    <template v-if="i">
                        <span class="doc-row-dot" aria-hidden="true">·</span>
                    </template>
                    <span>{{ f }}</span>
                </template>
            </span>
        </span>
        <span class="doc-row-age" :title="`Changed ${new Date(changed * 1000).toLocaleString()}`">{{ age(changed) }}</span>
    </button>
</template>

<style scoped>
.doc-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
    gap: 14px;
    width: 100%;
    padding: 12px 14px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition:
        background 0.15s,
        border-color 0.15s;
}

.doc-row:hover,
.doc-row:focus-visible {
    border-color: var(--border);
    background: var(--hover);
    outline: none;
}

.doc-row:hover :deep(.page-thumb-sheet),
.doc-row:focus-visible :deep(.page-thumb-sheet) {
    stroke: var(--accent);
}

.doc-row.replaced {
    opacity: 0.55;
}

.doc-row-main {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.doc-row-title {
    font-size: 14px;
    font-weight: 550;
    line-height: 1.35;
}

.doc-row-state {
    display: inline-block;
    margin-left: 8px;
    padding: 0 7px;
    border: 1px dashed var(--border-3);
    border-radius: 99px;
    color: var(--text-3);
    font-size: 10.5px;
    font-weight: 500;
    line-height: 17px;
    vertical-align: 1px;
    white-space: nowrap;
}

.doc-row-summary {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.5;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.doc-row-where {
    margin-right: 6px;
    color: var(--text-2);
    font-weight: 500;
}

.doc-row-where::after {
    content: ":";
}

.doc-row-facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0 6px;
    color: var(--text-4);
    font-size: 11.5px;
}

.doc-row-age {
    padding-top: 2px;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}
</style>
