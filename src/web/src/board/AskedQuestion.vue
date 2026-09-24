<script setup>
import OptionsPicker from "../resource/OptionsPicker.vue";

defineProps({question: {type: Object, required: true}, chat: Boolean});
</script>

<template>
    <div :class="['asked', {chat}]">
        <template v-if="chat">
            <span class="tag">Question</span>
        </template>
        <p class="title">{{ question.title }}</p>
        <template v-if="question.abstract">
            <p class="context">{{ question.abstract }}</p>
        </template>
        <OptionsPicker :resource="question" buttons-only immediate />
    </div>
</template>

<style scoped>
.asked {
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: fade-in var(--fade) both;
}

.tag {
    color: var(--accent-text);
    font-size: 11px;
    letter-spacing: 0.02em;
}

.chat .title {
    font-size: 14px;
    line-height: 20px;
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
</style>
