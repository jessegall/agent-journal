<script setup lang="ts">
/** A small static label. Faint swaps the stronger border and text for the hairline and muted text. */
withDefaults(defineProps<{ variant?: 'default' | 'faint' }>(), { variant: 'default' });
</script>

<template>
    <span
        class="inline-flex items-center gap-1 rounded-badge border px-1.5 text-badge leading-[17px]"
        :class="variant === 'faint' ? 'border-line text-text-3' : 'border-border-2 text-text-2'"
        ><slot
    /></span>
</template>
