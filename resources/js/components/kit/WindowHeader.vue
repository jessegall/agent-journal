<script setup lang="ts">
/**
 * The header of a pane or a floating window, 34 high on --side with a --border line below, padding 0 5 0 12 and no text
 * selection. The strip variant holds Tabs in the default slot. The bar variant holds the leading slot (an Icon), the
 * title in --text-badge with .03em spacing and an ellipsis (--text-3, or --text when active), and the actions slot
 * (IconButtons); it shows a grab cursor and takes focus with a ring at offset -1.
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
