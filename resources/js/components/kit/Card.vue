<script setup lang="ts">
/**
 * A bordered surface. Raised uses --raised, plain uses --bg; active takes the stronger border; interactive adds the
 * hover border and the focus ring; lifting (a drag) scales it to .96 at .45 opacity over 180 ms.
 */
withDefaults(
    defineProps<{
        tone?: 'raised' | 'plain';
        active?: boolean;
        radius?: 'card' | 'field';
        padding?: 'md' | 'sm';
        interactive?: boolean;
        lifting?: boolean;
    }>(),
    { tone: 'raised', active: false, radius: 'card', padding: 'md', interactive: false, lifting: false },
);
</script>

<template>
    <div
        :tabindex="interactive ? 0 : undefined"
        class="border transition-[border-color,scale,opacity] duration-(--duration-pop)"
        :class="[
            tone === 'raised' ? 'bg-raised' : 'bg-bg',
            active ? 'border-border-3' : 'border-line',
            radius === 'card' ? 'rounded-card' : 'rounded-field',
            padding === 'md' ? 'px-3 py-2.5' : 'py-2 pr-2 pl-3',
            interactive && 'hover:border-border-3 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus',
            lifting && 'scale-[.96] opacity-45',
        ]"
    >
        <slot />
    </div>
</template>
