<script setup>
import {age} from "../format/time.js";

defineProps({comments: {type: Array, default: () => []}});

const hue = (name) => [...name].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 360, 7);
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
                <article :class="['comment', {waiting: c.waiting}]" :style="{'--hue': hue(c.name)}">
                    <span class="mark">{{ c.name.slice(0, 1) }}</span>
                    <div class="said">
                        <header class="who">
                            <span class="name">{{ c.name }}</span>
                            <span class="when">{{ c.waiting ? "sending" : age(c.created) }}</span>
                        </header>
                        <p class="text">{{ c.text }}</p>
                    </div>
                </article>
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

.comment {
    display: flex;
    gap: 12px;
}

.comment.waiting {
    opacity: 0.6;
}

.mark {
    display: grid;
    flex: none;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: oklch(0.45 0.09 var(--hue));
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.said {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    gap: 3px;
}

.who {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 12.5px;
}

.name {
    color: var(--text);
    font-weight: 600;
}

.when {
    color: var(--text-3);
}

.text {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    line-height: 1.55;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
