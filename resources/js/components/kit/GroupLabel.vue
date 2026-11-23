<script setup lang="ts">
/**
 * The heading of a group: small caps. Its margin follows its place: a menu has its own, while a settings section's head and the graph place it themselves.
 */
withDefaults(defineProps<{ place?: 'section' | 'menu' | 'graph' }>(), { place: 'section' });
</script>

<template>
    <div
        class="text-group font-semibold tracking-[0.06em] text-text-3 uppercase"
        :class="{ 'mx-2 mt-2 mb-[3px]': place === 'menu' }"
    >
        <slot />
    </div>
</template>
