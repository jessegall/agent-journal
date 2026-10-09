<script setup>
import {computed, watchEffect} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import MarkedText from "../kit/MarkedText.vue";
import {standing} from "../domain/documents.js";
import {ago} from "../format/time.js";
import {whole} from "../sync/rows.js";
import ChoiceCard from "./ChoiceCard.vue";
import ResourceFiles from "./ResourceFiles.vue";

const props = defineProps({doc: {type: Object, default: null}, words: {type: Array, default: () => []}, searching: Boolean});
const emit = defineEmits(["open", "hide"]);
const state = computed(() => props.doc && standing(props.doc));
const files = computed(() => Object.entries(props.doc?.data.files || {}));
watchEffect(() => {
    if (props.doc?.summary) whole("doc", props.doc.n).catch((error) => console.error(error));
});
const empty = computed(() => props.doc && !props.doc.abstract && !props.doc.brief && !props.doc.sections.length);
</script>

<template>
    <div class="preview">
        <template v-if="!doc">
            <EmptyState :title="searching ? 'No document to show' : 'Choose a document to read it here'">
                {{ searching ? "Clear the search to see every document again." : "Choose a document on the left to see its text here." }}
            </EmptyState>
        </template>
        <template v-else>
            <article :key="doc.ref" class="preview-document">
                <header class="preview-top">
                    <span>This is a preview. Open the whole document to edit, comment, share or close it.</span>
                    <Btn kind="primary" @click="emit('open', doc)">Open the whole document</Btn>
                    <Btn kind="icon" v-tip="'Hide the preview'" aria-label="Hide the preview" @click="emit('hide')">×</Btn>
                </header>
                <div class="preview-content">
                    <p class="preview-meta">Document {{ doc.n }} · {{ state.label }} · changed {{ ago(doc.updated || doc.created) }}</p>
                    <h2><MarkedText :text="doc.title" :words="words" /></h2>
                    <template v-if="['answer', 'approve', 'answered'].includes(state.key)"><ChoiceCard :resource="doc" preview /></template>
                    <template v-if="state.key === 'writing'">
                        <p class="preview-note">
                            {{ empty ? "No text yet. " : "" }}The agent is still writing this document. It becomes final when finished.
                        </p>
                    </template>
                    <template v-if="empty && state.key !== 'writing'"><p class="preview-note">No text yet.</p></template>
                    <template v-if="doc.abstract"><TextDisplay :text="doc.abstract" /></template>
                    <template v-if="doc.brief"><TextDisplay :text="doc.brief" /></template>
                    <template v-for="section in doc.sections" :key="section.title">
                        <section class="preview-section">
                            <h3>{{ section.title }}</h3>
                            <TextDisplay :text="section.body" />
                        </section>
                    </template>
                    <template v-if="files.length"><ResourceFiles :resource="doc" :files="files" /></template>
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
