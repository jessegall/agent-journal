<script setup lang="ts">
/**
 * The bottom row of a Dialog: the secondary slot holds the secondary actions on the left, and the default slot holds
 * Cancel and the primary action on the right, unless it brings its own spacer. Measures:
 * docs/designs/kit-components.md.
 */
</script>

<template>
    <div class="flex shrink-0 items-center justify-end gap-2 border-t border-line py-2.5 pr-3 pl-4">
        <template v-if="$slots.secondary">
            <slot name="secondary" />
            <span class="flex-1" />
        </template>
        <slot />
    </div>
</template>
