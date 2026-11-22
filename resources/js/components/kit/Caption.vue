<script setup lang="ts">
/**
 * A centred pill of text over the Desk, 22px above its bottom edge: at most 520 wide, padding 8 14, --raised with a
 * --border-3 border, radius --radius-menu, --shadow-pop and --text-small text. It is a role status, so a screen
 * reader announces it politely.
 */
</script>

<template>
    <div
        role="status"
        class="absolute bottom-5.5 left-1/2 z-(--z-caption) max-w-130 -translate-x-1/2 rounded-menu border border-border-3 bg-raised px-3.5 py-2 text-small text-text shadow-(--shadow-pop)"
    >
        <slot />
    </div>
</template>
