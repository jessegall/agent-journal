<script setup>
import {stateLabel} from "../../domain/states.js";
import RowMoves from "../RowMoves.vue";
import CommentRail from "./CommentRail.vue";
import MoreItems from "../../../kit/MoreItems.vue";

defineProps({mode: {type: String, default: "comments"}, comments: {type: Array, required: true}, questions: {type: Array, required: true}, hot: {type: Number, default: 0}, lost: {type: Array, default: () => []}, failure: {type: String, default: ""}, read: {type: Function, required: true}, tab: Boolean,
    commentMore: Boolean, commentLoading: Boolean, commentFailure: {type: String, default: ""}, commentTotal: {type: Number, default: 0}});
defineEmits(["update:mode", "show", "changed", "more"]);
</script>

<template>
    <div :class="['document-sidebar', {tab}]" data-document-sidebar>
        <nav class="sidebar-switch" aria-label="Document discussion">
            <button type="button" :aria-pressed="mode === 'comments'" data-document-notes="comments" @click="$emit('update:mode', 'comments')">Comments</button>
            <button type="button" :aria-pressed="mode === 'questions'" data-document-notes="questions" @click="$emit('update:mode', 'questions')">Questions</button>
        </nav>
        <template v-if="mode === 'comments'">
            <template v-if="comments.length || (!commentFailure && !commentLoading)">
                <CommentRail tab :comments="comments" :hot="hot" :lost="lost" :total="commentTotal" @show="$emit('show', $event)" />
            </template>
            <MoreItems :more="commentMore" :loading="commentLoading" :failure="commentFailure" label="More comments" @more="$emit('more')" />
        </template>
        <template v-else>
            <aside class="question-rail" aria-label="Questions" data-question-rail>
                <template v-if="failure">
                    <p role="alert">{{ failure }}</p>
                </template>
                <template v-else-if="!questions.length">
                    <p class="sidebar-none">No questions about this text yet.</p>
                </template>
                <template v-for="question in questions" :key="question.id">
                    <section :class="['document-question', {hot: question.id === hot}]" :data-question-id="question.id">
                        <span class="question-state">{{ stateLabel('question', question.state) }}</span>
                        <button type="button" class="question-show" :data-question-show="question.id" @click="$emit('show', question.id)">{{ question.text }}</button>
                        <template v-if="question.quote">
                            <blockquote>{{ question.quote }}</blockquote>
                            <template v-if="lost.includes(question.id)">
                                <p class="sidebar-none">The quoted text has changed.</p>
                            </template>
                        </template>
                        <template v-if="question.answer">
                            <p class="question-answer">Answered: {{ question.answer }}</p>
                        </template>
                        <RowMoves noun="question" :id="question.id" :row="question" :read="read" @done="$emit('changed')" />
                    </section>
                </template>
            </aside>
        </template>
    </div>
</template>

<style scoped>
.document-sidebar {
    display: flex;
    flex: 0 0 310px;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    border-left: 1px solid var(--border);
    background: var(--bg-2);
}

.document-sidebar.tab {
    flex: 1;
    border-left: 0;
}

.sidebar-switch {
    display: flex;
    flex: none;
    gap: 6px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
}

.sidebar-switch button,
.question-show {
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.sidebar-switch button[aria-pressed="true"] {
    color: var(--text);
    font-weight: 600;
}

.question-rail {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 14px 16px;
}

.document-question {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
    padding: 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
}

.document-question.hot {
    border-color: var(--accent);
}

.question-show {
    color: var(--text);
    font-weight: 600;
}

.question-state,
.sidebar-none {
    color: var(--text-3);
    font-size: 12px;
}

blockquote {
    margin: 0;
    padding-left: 8px;
    border-left: 2px solid var(--border-2);
    color: var(--text-2);
    font-size: 12px;
}

.question-answer {
    margin: 0;
    font-size: 12.5px;
}
</style>
