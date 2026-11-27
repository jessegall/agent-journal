<script setup lang="ts">
/**
 * The strip across the top of a window's content: 32 high for every toolbar, with a --line border below and padding
 * 0 10 0 12. The default slot holds what leads it (Tabs, or a Status) and the actions slot holds Buttons, pushed to the
 * right edge. It is a role toolbar, so a screen reader names it by its label.
 */
defineProps<{ label: string }>();
</script>

<template>
    <div role="toolbar" :aria-label="label" class="flex h-8 shrink-0 items-center gap-2 border-b border-line pr-2.5 pl-3">
        <slot />
        <template v-if="$slots.actions">
            <div class="ml-auto flex items-center gap-1.5">
                <slot name="actions" />
            </div>
        </template>
    </div>
</template>
