<script setup>
import Icon from "./Icon.vue";
</script>

<template>
    <div class="handled-note">
        <Icon name="check" :size="12" />
        <span class="handled-label">Closed</span>
        <span class="handled-text"><slot /></span>
    </div>
</template>

<style scoped>
.handled-note {
    display: flex;
    align-items: baseline;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 7px;
    background: color-mix(in srgb, var(--tone-good) 10%, transparent);
    color: var(--tone-good);
    font-size: 12px;
}

.handled-note .ico {
    flex: none;
    align-self: center;
}

.handled-label {
    flex: none;
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
