<script setup lang="ts">
/**
 * The foot of a Dialog: a row under a --line border with padding 10 12 10 16. The secondary slot holds the secondary
 * actions on the left, a spacer follows, and the default slot holds Cancel and the primary action on the right; a
 * default slot that brings its own spacer places its actions on both sides itself.
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
