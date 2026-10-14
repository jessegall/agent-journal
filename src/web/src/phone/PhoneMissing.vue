<script setup>
defineProps({title: {type: String, required: true}, words: {type: String, default: ""}, back: {type: String, default: "Back"}});
const emit = defineEmits(["back", "retry"]);
</script>

<template>
    <div class="missing" role="status">
        <h2 class="missing-title" tabindex="-1">{{ title }}</h2>
        <template v-if="words">
            <p class="missing-words">{{ words }}</p>
        </template>
        <div class="missing-actions">
            <button type="button" class="missing-back" @click="emit('back')">Back to {{ back }}</button>
            <slot />
        </div>
    </div>
</template>

<style scoped>
.missing {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 32px 8px;
    text-align: center;
}

.missing-title:focus {
    outline: none;
}

.missing-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
}

.missing-words {
    max-width: 320px;
    margin: 0;
    color: var(--text-2);
    line-height: 1.4;
}

.missing-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
}

.missing-back,
.missing-actions :deep(button) {
    min-height: 44px;
    padding: 0 18px;
    border: 0;
    border-radius: 12px;
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
}
</style>
