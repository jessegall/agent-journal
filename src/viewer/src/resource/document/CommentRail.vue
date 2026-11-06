<script setup>
import CommentCard from "./CommentCard.vue";

// the comments of a document, in the margin beside its text or on their own tab
defineProps({comments: {type: Array, required: true}, hot: {type: Number, default: 0}, lost: {type: Array, default: () => []}, tab: Boolean, total: {type: Number, default: 0}});
defineEmits(["show"]);
</script>

<template>
    <aside :class="['comment-rail', {tab}]" aria-label="Comments" data-comment-rail>
        <div class="rail-head">
            <h3>Comments</h3>
            <template v-if="comments.length">
                <span>{{ total || comments.length }}</span>
            </template>
        </div>
        <template v-if="comments.length">
            <template v-for="comment in comments" :key="comment.id">
                <CommentCard :comment="comment" :hot="comment.id === hot" :lost="lost.includes(comment.id)" @show="$emit('show', comment.id)" />
            </template>
        </template>
        <template v-else>
            <p class="rail-none">No comments yet. Select a piece of the text to comment on it, or write one in the box below.</p>
        </template>
    </aside>
</template>

<style scoped>
.comment-rail {
    flex: 0 0 310px;
    min-width: 0;
    overflow-y: auto;
    padding: 14px 16px 20px;
    border-left: 1px solid var(--border);
    background: var(--bg-2);
}

.comment-rail.tab {
    flex: 1;
    border-left: 0;
}

.rail-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 0 0 12px;
    color: var(--text-3);
    font-size: 12px;
}

h3 {
    margin: 0;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.rail-none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.55;
}
</style>
