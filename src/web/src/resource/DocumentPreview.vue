<script setup>
import {computed, watchEffect} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import MarkedText from "../kit/MarkedText.vue";
import {ago} from "../format/time.js";
import {refOf, titleOf, updatedAt} from "../domain/row.js";
import {isWhole, whole} from "../sync/rows.js";

const props = defineProps({doc: {type: Object, default: null}, words: {type: Array, default: () => []}, searching: Boolean});
const emit = defineEmits(["open", "hide"]);
watchEffect(() => {
    if (props.doc && !isWhole(props.doc)) whole("docs", props.doc.id).catch((error) => console.error(error));
});
const empty = computed(() => props.doc && !props.doc.abstract && !props.doc.body);
</script>

<template>
    <div class="preview">
        <template v-if="!doc">
            <EmptyState :title="searching ? 'No document to show' : 'Choose a document to read it here'">
                {{ searching ? "Clear the search to see every document again." : "Choose a document on the left to see its text here." }}
            </EmptyState>
        </template>
        <template v-else>
            <article :key="refOf(doc)" class="preview-document">
                <header class="preview-top">
                    <span>This is a preview. Open the whole document to edit, comment or share it.</span>
                    <Btn kind="primary" @click="emit('open', doc)">Open the whole document</Btn>
                    <Btn kind="icon" v-tip="'Hide the preview'" aria-label="Hide the preview" @click="emit('hide')">×</Btn>
                </header>
                <div class="preview-content">
                    <p class="preview-meta">Document {{ doc.id }} · changed {{ ago(updatedAt(doc)) }}</p>
                    <h2><MarkedText :text="titleOf(doc)" :words="words" /></h2>
                    <template v-if="empty"><p class="preview-note">No text yet.</p></template>
                    <template v-if="doc.abstract"><TextDisplay :text="doc.abstract" /></template>
                    <template v-if="doc.body"><TextDisplay :text="doc.body" /></template>
                </div>
            </article>
        </template>
    </div>
</template>

<style scoped>
.preview {
    position: relative;
    min-width: 0;
    overflow-y: auto;
    border-left: 1px solid var(--border);
}
.preview :deep(.empty-state.titled) {
    position: relative;
    min-height: 330px;
}
.preview-top {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-3);
    font-size: 12px;
}
.preview-top > span {
    flex: 1;
}
.preview-content {
    max-width: 790px;
    margin: auto;
    padding: 24px 32px 80px;
}
.preview-meta {
    margin: 0 0 14px;
    color: var(--text-3);
    font-size: 12px;
}
h2 {
    margin: 0 0 18px;
    font-size: 23px;
    line-height: 1.2;
}
h3 {
    margin: 22px 0 9px;
    font-size: 15px;
}
.preview-note {
    padding: 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-2);
}
@media (max-width: 1080px) {
    .preview-top {
        flex-wrap: wrap;
    }
    .preview-content {
        padding: 20px;
    }
}
</style>
