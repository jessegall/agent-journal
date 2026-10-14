<script setup>
import TextDisplay from "../kit/TextDisplay.vue";
import {ago} from "../format/time.js";

defineProps({comments: {type: Array, required: true}});
</script>

<template>
    <template v-if="comments.length">
        <section class="comments" aria-label="Comments">
            <h2 class="comments-title">Comments · {{ comments.length }}</h2>
            <ul class="comments-list">
                <template v-for="comment in comments" :key="comment.key">
                    <li :class="['comment', comment.who]">
                        <span class="comment-head">
                            <span class="comment-who">{{ comment.who === "user" ? "You" : "Agent" }}</span>
                            <span class="comment-age">{{ comment.waiting ? "Waiting to send" : ago(comment.created) }}</span>
                        </span>
                        <TextDisplay :text="comment.text" />
                    </li>
                </template>
            </ul>
        </section>
    </template>
</template>

<style scoped>
.comments {
    margin-top: 24px;
}

.comments-title {
    margin: 0 0 8px;
    color: var(--text-2);
    font-size: 0.824rem;
    font-weight: 600;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.comment {
    padding: 10px 14px;
    border-radius: 14px;
    background: var(--raised);
    font-size: 0.941em;
}

.comment.user {
    background: color-mix(in oklab, var(--accent) 12%, var(--raised));
}

.comment-head {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 2px;
    color: var(--text-2);
    font-size: 0.765rem;
}

.comment-who {
    font-weight: 600;
}

.comment :deep(.md > :last-child) {
    margin-bottom: 0;
}
</style>
