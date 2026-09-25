<script setup>
import OptionsPicker from "../resource/OptionsPicker.vue";

defineProps({question: {type: Object, required: true}, chat: Boolean});
</script>

<template>
    <div :class="['asked', {chat}]">
        <p class="title">{{ question.title }}</p>
        <template v-if="question.abstract">
            <p class="context">{{ question.abstract }}</p>
        </template>
        <OptionsPicker class="choices" :resource="question" buttons-only immediate :tiles="!chat" :steady="chat" />
    </div>
</template>

<style scoped>
.asked {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.asked.chat {
    animation: asked-rise 0.24s var(--ease) both;
}

.asked:not(.chat) {
    flex: 1;
    justify-content: center;
    margin-right: -32px;
    padding-bottom: 6px;
}

.asked:not(.chat) .title {
    padding-right: 32px;
}

.asked:not(.chat) .choices {
    margin-top: 14px;
}

.chat .title {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
}

.chat .choices {
    margin: 8px 0 0;
}

.title {
    margin: 0;
    color: var(--text);
    font-size: 17px;
    font-weight: 500;
    line-height: 26px;
}

.context {
    margin: 10px 0 8px;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.chat .context {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}

@keyframes asked-rise {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .asked.chat {
        animation: none;
    }
}
</style>
