<script setup lang="ts">
/**
 * The label of a MenuItem: one line of --text-small text that fills the room beside the item's icon and trailing
 * mark and ends in an ellipsis. It takes its colour from the item, so hover, active and disabled change it there.
 * It has no role of its own: the item's accessible name is this text.
 */
</script>

<template>
    <span class="min-w-0 flex-1 truncate text-small leading-[1.3]">
        <slot />
    </span>
</template>
