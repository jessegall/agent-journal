<script setup>
import TimeAgo from "../../../kit/TimeAgo.vue";

// one comment: its number and the words it is on, what was said, and for one on a selection a way back to it
const props = defineProps({comment: {type: Object, required: true}, hot: Boolean, lost: Boolean});
defineEmits(["show"]);
const isCode = () => props.comment.selection_type === "code";
</script>

<template>
    <article :class="['comment-card', {hot}]" data-comment-card :data-comment-id="comment.id">
        <template v-if="comment.quote">
            <div class="comment-top">
                <span class="comment-mark">{{ comment.number }}</span>
                <span :class="['comment-quote', {mono: isCode()}]" data-comment-quote>{{ comment.quote }}</span>
            </div>
        </template>
        <p class="comment-body" data-comment>{{ comment.body }}</p>
        <div class="comment-foot">
            <template v-if="comment.created_at">
                <TimeAgo :at="comment.created_at" />
            </template>
            <template v-if="lost">
                <span data-comment-lost>The text has changed here</span>
            </template>
            <template v-else-if="comment.quote">
                <button type="button" class="comment-show" data-comment-show @click="$emit('show')">Show in the text</button>
            </template>
        </div>
    </article>
</template>

<style scoped>
.comment-card {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin: 0 0 10px;
    padding: 11px 12px 10px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--bg);
}

.comment-card.hot {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, var(--bg));
}

.comment-top {
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.comment-mark {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 17px;
    height: 17px;
    margin-top: 1px;
    border-radius: 9px;
    background: var(--accent);
    color: #fff;
    font-size: 10.5px;
    font-weight: 600;
}

.comment-quote {
    display: -webkit-box;
    flex: 1;
    min-width: 0;
    padding: 4px 8px;
    overflow: hidden;
    border-radius: 6px;
    background: var(--chip);
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.45;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.comment-quote.mono {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
}

.comment-body {
    margin: 0;
    color: var(--text);
    font-size: 13px;
    line-height: 1.55;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
}

.comment-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-4);
    font-size: 11.5px;
}

.comment-show {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.comment-show:hover {
    color: var(--text);
}
</style>
