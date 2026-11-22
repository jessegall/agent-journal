<script setup lang="ts">
/**
 * The second line of a MenuItem: one line of --text-badge text in --text-3 under its label, ending in an ellipsis.
 * It has no role of its own: a screen reader reads it as part of the item.
 */
</script>

<template>
    <span class="block min-w-0 truncate text-badge text-text-3">
        <slot />
    </span>
</template>
