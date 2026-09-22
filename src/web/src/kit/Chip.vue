<script setup>
defineProps({tone: {type: String, default: ""}});
</script>

<template>
    <span :class="['chip', tone]"><slot /></span>
</template>

<style scoped>
.chip {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 5px;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    color: var(--text-2);
    font-size: 11px;
    white-space: nowrap;
}

.chip.accent {
    color: var(--accent-text);
}

.chip.danger {
    border-color: var(--danger);
    color: var(--danger);
    font-weight: 700;
}
</style>
