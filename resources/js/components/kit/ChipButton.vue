<script setup lang="ts">
/**
 * A chip that acts or toggles, such as a reaction, a sequence run, a window chip or a suggested answer, in four sizes,
 * square or pill, with a leading icon, dot or spinner and a trailing count. A toggle is pressed; `own` marks the
 * viewer's own reaction and `selected` the active window. Measures: docs/designs/kit-components.md.
 */
withDefaults(
    defineProps<{
        size?: 'xs' | 'sm' | 'md' | 'lg';
        shape?: 'square' | 'pill';
        tone?: 'normal' | 'quiet';
        count?: number;
        pressed?: boolean;
        selected?: boolean;
        own?: boolean;
    }>(),
    { size: 'sm', shape: 'square', tone: 'normal', count: undefined, pressed: undefined, selected: false, own: false },
);
</script>

<template>
    <button
        type="button"
        :aria-pressed="pressed"
        class="inline-flex shrink-0 items-center gap-1 border text-badge whitespace-nowrap transition-colors duration-(--duration-hover) hover:border-border-3 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
        :class="[
            { xs: 'h-5 px-1.5', sm: 'h-5.5 px-2', md: 'h-6 px-2', lg: 'h-7 px-3' }[size],
            shape === 'pill' ? 'rounded-full' : size === 'xs' || size === 'sm' ? 'rounded-seg' : 'rounded-button',
            size === 'lg' ? 'border-border-2 hover:bg-hover' : 'border-line',
            tone === 'quiet' ? 'text-text-3' : 'text-text-2',
            pressed && 'border-border-3 bg-sel text-text',
            selected && 'border-border-3 text-text',
            own && 'border-brand',
        ]"
    >
        <slot name="leading" />
        <slot />
        <template v-if="count !== undefined">
            <span class="tabular-nums">{{ count }}</span>
        </template>
    </button>
</template>
