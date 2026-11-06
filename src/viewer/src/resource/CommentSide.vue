<script setup>
import CloseButton from "../kit/CloseButton.vue";
import MoreItems from "../../kit/MoreItems.vue";

// the comments on a document, in a column beside its text, or under it when it is shown below
defineProps({comments: {type: Array, required: true}, words: {type: Function, required: true}, below: Boolean,
    more: Boolean, loading: Boolean, failure: {type: String, default: ""}});
defineEmits(["close", "more"]);
</script>

<template>
    <aside :class="['comment-side', {below}]" data-comment-side aria-label="Comments">
        <header class="comment-side-head">
            <h3>Comments</h3>
            <CloseButton title="Close the comments" @click="$emit('close')" />
        </header>
        <template v-if="!comments.length && !loading && !failure">
            <p class="comment-none">No comments yet</p>
        </template>
        <template v-for="row in comments" :key="row.id">
            <section>
                <template v-if="row.quote"><blockquote>{{ row.quote }}</blockquote></template>
                <template v-if="row.revision"><span class="comment-none">Revision {{ row.revision }}</span></template>
                <p class="comment" data-comment>{{ words(row) }}</p>
            </section>
        </template>
        <MoreItems :more="more" :loading="loading" :failure="failure" label="More comments" @more="$emit('more')" />
    </aside>
</template>

<style scoped>
.comment-side {
    flex: none;
    box-sizing: border-box;
    width: clamp(240px, 34%, 400px);
    overflow-y: auto;
    padding: 12px 16px;
    border-left: 1px solid var(--border);
}

.comment-side.below {
    width: auto;
    max-height: 40%;
    border-top: 1px solid var(--border);
    border-left: 0;
}

.comment-side-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

h3 {
    margin: 0;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
}

.comment,
.comment-none {
    margin: 10px 0 0;
    font-size: 13px;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
}

.comment-none {
    color: var(--text-3);
}
</style>
