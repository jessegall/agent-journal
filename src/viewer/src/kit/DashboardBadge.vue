<script setup>
defineProps({text: {type: String, required: true}, tone: {type: String, default: ""}});
</script>

<template>
    <span :class="['badge', tone]">{{ text }}</span>
</template>

<style scoped>
.badge {
    padding: 1px 7px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    color: var(--text-2);
    font-size: 11px;
}

.badge.danger {
    border-color: var(--tone-danger);
    color: var(--tone-danger);
}

.badge.warn {
    border-color: var(--tone-warn);
    color: var(--tone-warn);
}

.badge.good {
    border-color: var(--tone-good, var(--green));
    color: var(--tone-good, var(--green));
}
</style>
