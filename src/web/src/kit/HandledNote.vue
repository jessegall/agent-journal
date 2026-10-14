<script setup>
import Icon from "./Icon.vue";
</script>

<template>
    <div class="handled-note">
        <span class="handled-label">
            <Icon name="check" :size="12" />
            Closed
        </span>
        <span class="handled-text"><slot /></span>
    </div>
</template>

<style scoped>
.handled-note {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 8px;
    border-radius: 7px;
    background: color-mix(in srgb, var(--tone-good) 10%, transparent);
    color: var(--tone-good);
    font-size: 12px;
}

.handled-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
}

.handled-text {
    min-width: 0;
    color: var(--text-2);
}

.handled-text:empty {
    display: none;
}

.handled-text :deep(p) {
    display: inline;
    margin: 0;
}
</style>
