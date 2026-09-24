<script setup>
import OptionsPicker from "../resource/OptionsPicker.vue";

defineProps({question: {type: Object, required: true}});
</script>

<template>
    <div class="asked">
        <span class="tag">Question</span>
        <p class="title">{{ question.title }}</p>
        <template v-if="question.abstract">
            <p class="context">{{ question.abstract }}</p>
        </template>
        <OptionsPicker :resource="question" buttons-only />
    </div>
</template>

<style scoped>
.asked {
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: asked-in 0.25s both;
}

.tag {
    color: var(--accent-text);
    font-size: 11px;
    letter-spacing: 0.02em;
}

.title {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
}

.context {
    margin: 0 0 6px;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

@keyframes asked-in {
    from {
        opacity: 0;
    }
}
</style>
