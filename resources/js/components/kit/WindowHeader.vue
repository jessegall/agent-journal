<script setup lang="ts">
/**
 * The header of a pane or a floating window: the strip form holds Tabs in the default slot, and the bar form holds a
 * leading icon, the title and the actions slot, with a grab cursor. Measures: docs/designs/kit-components.md.
 */
withDefaults(defineProps<{ variant?: 'strip' | 'bar'; title?: string; active?: boolean }>(), {
    variant: 'strip',
    title: undefined,
    active: false,
});
</script>

<template>
    <div
        class="flex h-8.5 shrink-0 items-center gap-1.5 border-b border-border bg-side pr-1.25 pl-3 select-none"
        :class="variant === 'bar' && 'cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset'"
        :tabindex="variant === 'bar' ? 0 : undefined"
    >
        <template v-if="variant === 'strip'">
            <slot />
        </template>
        <template v-else>
            <slot name="leading" />
            <span
                class="min-w-0 flex-1 truncate text-badge tracking-[0.03em]"
                :class="active ? 'text-text' : 'text-text-3'"
                >{{ title }}</span
            >
            <slot name="actions" />
        </template>
    </div>
</template>
