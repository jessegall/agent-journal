<script setup lang="ts">
/**
 * The heading of a group: small caps. Its margin follows its place: a settings section, a menu or the graph.
 */
withDefaults(defineProps<{ place?: 'section' | 'menu' | 'graph' }>(), { place: 'section' });
</script>

<template>
    <div
        class="text-group font-semibold tracking-[0.06em] text-text-3 uppercase"
        :class="{ 'mt-4.5 mb-2': place === 'section', 'mx-2 mt-2 mb-[3px]': place === 'menu' }"
    >
        <slot />
    </div>
</template>
