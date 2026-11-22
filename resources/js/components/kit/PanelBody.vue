<script setup lang="ts">
/**
 * The body of a Panel: it takes the height the header leaves and scrolls when its content is taller.
 */
</script>

<template>
    <div class="min-h-0 flex-1 overflow-y-auto">
        <slot />
    </div>
</template>
