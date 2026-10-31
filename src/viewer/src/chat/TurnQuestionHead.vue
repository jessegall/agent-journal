<script setup>
import MarkIcon from "../kit/MarkIcon.vue";

defineProps({question: {type: Object, required: true}});
</script>

<template>
    <div :class="['thread-results', {live: !question.closedAt}]">
        <MarkIcon name="question" />
        <p class="thread-ask-label">Question {{ question.id }} · {{ question.closedAt ? "you answered" : "the agent waits for your answer" }}</p>
    </div>
</template>

<style scoped>
.thread-results {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 5px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
}

.thread-results.live {
    color: var(--tone-warn);
}

.thread-results :deep(svg) {
    width: 13px;
    height: 13px;
}

.thread-ask-label {
    margin: 0 auto 0 0;
}
</style>
