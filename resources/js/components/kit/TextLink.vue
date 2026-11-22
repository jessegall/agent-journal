<script setup lang="ts">
/**
 * An action that reads as part of the text: a button when it acts, an anchor when it goes somewhere. Inline is
 * underlined text; quiet (the reply link) is small and muted and darkens on hover.
 */
withDefaults(defineProps<{ variant?: 'inline' | 'quiet'; href?: string }>(), {
    variant: 'inline',
    href: undefined,
});
</script>

<template>
    <component
        :is="href ? 'a' : 'button'"
        :href="href"
        :type="href ? undefined : 'button'"
        class="inline cursor-pointer underline decoration-border-3 underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        :class="variant === 'quiet' ? 'text-badge text-text-3 hover:text-text-2' : 'text-text'"
        ><slot
    /></component>
</template>
