<script setup lang="ts">
/**
 * The body of a Dialog: it takes the height the frame leaves between the header and the footer and scrolls when its
 * content is taller, with a padding of 14 above and below and 16 at the sides.
 */
</script>

<template>
    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-3.5">
        <slot />
    </div>
</template>
