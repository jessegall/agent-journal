<script setup>
import ShareComment from "./ShareComment.vue";

defineProps({comments: {type: Array, default: () => []}});
</script>

<template>
    <div class="body">
        <section id="share-comments" class="share-comments" aria-label="Comments">
            <h2 class="heading">
                Comments
                <span class="count">{{ comments.length }}</span>
            </h2>
            <template v-if="!comments.length">
                <p class="empty">No comments yet. Leave the first one with the bar at the bottom.</p>
            </template>
            <template v-for="c in comments" :key="c.n">
                <ShareComment :n="c.n" :name="c.name" :text="c.text" :created="c.created" :waiting="c.waiting" :replies="c.replies" :options="c.options" :answer="c.answer" />
            </template>
        </section>
    </div>
</template>

<style scoped>
.share-comments {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    scroll-margin-top: 24px;
}

.heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
}

.count {
    min-width: 20px;
    padding: 1px 6px;
    border-radius: 9px;
    background: var(--raised);
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 500;
    text-align: center;
}

.empty {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}
</style>
