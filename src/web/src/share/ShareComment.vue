<script setup>
import {age} from "../format/time.js";

defineProps({
    name: {type: String, required: true},
    text: {type: String, required: true},
    created: {type: Number, required: true},
    waiting: {type: Boolean, default: false},
    replies: {type: Array, default: () => []},
});

const hue = (name) => [...name].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 360, 7);
</script>

<template>
    <article :class="['comment', {waiting}]" :style="{'--hue': hue(name)}">
        <span class="mark">{{ name.slice(0, 1) }}</span>
        <div class="said">
            <header class="who">
                <span class="name">{{ name }}</span>
                <span class="when">{{ waiting ? "sending" : age(created) }}</span>
            </header>
            <p class="text">{{ text }}</p>
            <template v-if="replies.length">
                <div class="replies">
                    <template v-for="reply in replies" :key="reply.n">
                        <ShareComment :name="reply.name" :text="reply.text" :created="reply.created" />
                    </template>
                </div>
            </template>
        </div>
    </article>
</template>

<style scoped>
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

.replies {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
    padding-left: 12px;
    border-left: 2px solid var(--border);
}
</style>
