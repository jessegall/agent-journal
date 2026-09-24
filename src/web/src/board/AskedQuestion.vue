<script setup>
import OptionsPicker from "../resource/OptionsPicker.vue";

defineProps({question: {type: Object, required: true}});
</script>

<template>
    <div class="asked">
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

@keyframes asked-in {
    from {
        opacity: 0;
    }
}
</style>
