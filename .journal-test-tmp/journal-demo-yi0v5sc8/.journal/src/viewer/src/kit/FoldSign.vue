<script setup>
import MarkIcon from "./MarkIcon.vue";

// The one fold sign: a chevron after a title, pointing down while folded and turned up once open, on marks, cards and docks alike
defineProps({open: Boolean});
</script>

<template>
    <span :class="['fold', {open}]" aria-hidden="true"><MarkIcon name="fold" /></span>
</template>

<style scoped>
.fold {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 12px;
    height: 12px;
    margin-left: -3px;
    color: var(--text-4);
    transition:
        transform 0.3s var(--ease),
        color 0.15s ease,
        opacity 0.12s ease;
}

.fold :deep(svg) {
    width: 11px;
    height: 11px;
    stroke-width: 1.6;
}

.fold.open {
    transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
    .fold {
        transition: none;
    }
}
</style>
