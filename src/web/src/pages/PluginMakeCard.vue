<script setup>
import Icon from "../kit/Icon.vue";
import PlaceholderCard from "../kit/PlaceholderCard.vue";
</script>

<template>
    <PlaceholderCard class="make">
        <span class="make-mark"><Icon name="plus" :size="16" /></span>
        <span class="make-title">Make a plugin</span>
        <span class="make-text">Ask the agent to build one for you, or read how plugins are made.</span>
    </PlaceholderCard>
</template>

<style scoped>
.make {
    flex-direction: column;
    gap: 4px;
    min-height: 160px;
    border-radius: 14px;
}

.make-mark {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    margin-bottom: 8px;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    transition:
        border-color 0.2s,
        color 0.2s;
}

.make:hover .make-mark {
    border-color: var(--accent);
    color: var(--accent-text);
}

.make-title {
    color: var(--text-2);
    font-weight: 500;
}

.make-text {
    max-width: 240px;
    color: var(--text-4);
    font-size: 12px;
    line-height: 1.45;
    text-align: center;
}
</style>
