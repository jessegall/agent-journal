<script setup>
// one comment as a card: who wrote it and when, a marker when the lines it is about have changed since, the words it quotes, what it says and the answer to it
// comment: {by, at, agent, outdated, quote, text, reply: {by, text}}
defineProps({comment: {type: Object, required: true}, hot: Boolean});
defineEmits(["show"]);
</script>

<template>
    <div :class="['comment-card', {hot}]" data-comment-card :data-comment="comment.id" @click="$emit('show')">
        <div class="comment-who">
            <span :class="['comment-by', {agent: comment.agent}]">{{ comment.by }}</span>
            <template v-if="comment.at"><span>{{ comment.at }}</span></template>
            <template v-if="comment.outdated"><span class="badge-quiet" data-comment-outdated>Lines changed</span></template>
        </div>
        <template v-if="comment.quote"><blockquote>{{ comment.quote }}</blockquote></template>
        <p class="comment-text">{{ comment.text }}</p>
        <template v-if="comment.reply">
            <div class="comment-who comment-reply"><span><b>{{ comment.reply.by }}</b>: {{ comment.reply.text }}</span></div>
        </template>
    </div>
</template>

<style scoped>
.comment-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    cursor: pointer;
}

.comment-card.hot {
    border-color: var(--accent);
}

.comment-who {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--text-3);
    font-size: 11px;
}

.comment-by {
    color: var(--text-2);
}

.comment-by.agent {
    color: var(--accent-text);
}

blockquote {
    margin: 0;
    padding-left: 8px;
    border-left: 2px solid var(--accent);
    color: var(--text-3);
    font-size: 12px;
}

.comment-text {
    margin: 0;
    color: var(--text);
    font-size: 12.5px;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
}

.comment-reply {
    padding-left: 8px;
    border-left: 1px solid var(--border-2);
}
</style>
