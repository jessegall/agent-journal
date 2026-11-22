<script setup lang="ts">
/**
 * A keyboard shortcut. Boxed (the keyboard help) has a border at 28% of the text colour; bare (a menu item's
 * trailing slot) is plain muted mono text, hidden from assistive technology when the item's label already names it.
 */
withDefaults(defineProps<{ variant?: 'boxed' | 'bare'; decorative?: boolean }>(), {
    variant: 'boxed',
    decorative: false,
});
</script>

<template>
    <kbd
        :aria-hidden="decorative || undefined"
        class="font-mono text-meta"
        :class="
            variant === 'boxed'
                ? 'rounded-badge border border-[color-mix(in_srgb,currentColor_28%,transparent)] px-1.25'
                : 'text-text-3'
        "
        ><slot
    /></kbd>
</template>
