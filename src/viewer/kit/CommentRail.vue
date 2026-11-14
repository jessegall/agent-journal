<script setup>
import Btn from "../src/kit/Btn.vue";
import Icon from "../src/kit/Icon.vue";
import CommentCard from "./CommentCard.vue";

// the comments in the margin of a text; the cross hides it and the comment box's count brings it back. Narrow, it floats over the text instead of taking a column.
defineProps({comments: {type: Array, required: true}, hot: {type: Number, default: 0}, floating: Boolean, empty: {type: String, default: "No comments"}});
defineEmits(["show", "close"]);
</script>

<template>
    <aside :class="['comment-rail', {floating}]" aria-label="Comments" data-comment-rail>
        <div class="rail-head">
            <h3>Comments</h3>
            <span class="rail-count">{{ comments.length }}</span>
            <span class="rail-grow" />
            <Btn small title="Hide" aria-label="Hide the comments" data-rail-close @click="$emit('close')"><Icon name="close" :size="12" /></Btn>
        </div>
        <div class="rail-list">
            <template v-if="!comments.length">
                <p class="rail-empty">{{ empty }}</p>
            </template>
            <template v-for="comment in comments" :key="comment.id">
                <CommentCard :comment="comment" :hot="hot === comment.id" @show="$emit('show', comment.id)" />
            </template>
        </div>
    </aside>
</template>

<style scoped>
.comment-rail {
    display: flex;
    flex: none;
    flex-direction: column;
    width: clamp(260px, 30%, 360px);
    min-height: 0;
    border-left: 1px solid var(--border);
    background: var(--bg);
}

.comment-rail.floating {
    position: absolute;
    z-index: 8;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(340px, 90%);
    box-shadow: -16px 0 32px rgb(0 0 0 / 0.35);
}

.rail-head {
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
    height: 37px;
    padding: 0 var(--s3) 0 var(--inset);
    border-bottom: 1px solid var(--border);
}

h3 {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.rail-count {
    color: var(--text-4);
    font-size: 11px;
}

.rail-grow {
    flex: 1;
}

.rail-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    padding: var(--s3) var(--inset);
    overflow: auto;
}

.rail-empty {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
