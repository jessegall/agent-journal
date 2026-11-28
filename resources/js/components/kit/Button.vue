<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import Spinner from './Spinner.vue';

/**
 * A text action: ghost, bordered, primary, quiet-to-primary (the Send button), danger, icon or word, in md or sm size.
 * A pending button keeps its width and shows a spinner, and a disabled one takes no pointer, so its reason goes on a
 * Tooltip around it. Measures: docs/designs/kit-components.md.
 */
const props = withDefaults(
    defineProps<{
        variant?: 'ghost' | 'bordered' | 'primary' | 'quiet-to-primary' | 'danger' | 'icon' | 'word' | 'bare';
        size?: 'sm' | 'md' | 'small' | 'normal' | 'large';
        type?: 'button' | 'submit';
        href?: string;
        pending?: boolean;
        disabled?: boolean;
        pressed?: boolean;
        filled?: boolean;
    }>(),
    {
        variant: 'ghost',
        size: 'md',
        type: 'button',
        href: undefined,
        pending: false,
        disabled: false,
        pressed: undefined,
        filled: false,
    },
);

const kind = computed(() => {
    if (props.variant !== 'quiet-to-primary') {
        return props.variant;
    }

    return props.filled ? 'primary' : 'quiet';
});

const look = computed(() => {
    if (props.pressed) {
        return 'border-border-3 bg-sel text-text';
    }

    return {
        ghost: 'border-transparent text-text-2 hover:bg-hover hover:text-text',
        bordered: 'border-border-2 bg-bg text-text hover:bg-hover',
        primary: 'border-brand bg-brand text-on-brand hover:brightness-112',
        quiet: 'border-border-2 text-text-3 hover:bg-hover hover:text-text',
        danger: 'border-[color-mix(in_srgb,var(--danger)_55%,var(--border-2))] text-danger hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]',
        icon: 'size-6 justify-center border-transparent p-0 text-text-3 hover:bg-[color-mix(in_srgb,var(--border-3)_70%,transparent)] hover:text-text',
        word: 'h-5 border-transparent px-1 text-badge text-text-3 hover:text-text',
        bare: '',
    }[kind.value];
});

const hasOwnSize = computed(() => props.variant === 'icon' || props.variant === 'word');

const height = computed(() =>
    hasOwnSize.value
        ? ''
        : {
              sm: 'h-6 px-[9px] text-small',
              small: 'h-6 px-[9px] text-small',
              md: 'h-7 px-[11px] text-field',
              normal: 'h-7 px-[11px] text-field',
              large: 'h-9 px-3.5 text-card',
          }[props.size],
);

const isInactive = computed(() => props.disabled || props.pending);
</script>

<template>
    <component
        :is="href ? Link : 'button'"
        :href="href"
        :type="href ? undefined : type"
        :disabled="href ? undefined : isInactive"
        :aria-busy="pending || undefined"
        :aria-pressed="pressed"
        :class="variant === 'bare' ? undefined : [
            'relative inline-flex items-center gap-1.5 rounded-button border whitespace-nowrap transition-colors duration-(--duration-hover) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-45',
            look,
            height,
        ]"
    >
        <template v-if="variant === 'bare'">
            <slot name="icon" />
            <slot />
        </template>
        <span v-else :class="[{ invisible: pending }, variant === 'word' ? 'gap-1' : 'gap-1.5']" class="inline-flex items-center">
            <slot name="icon" />
            <slot />
        </span>
        <template v-if="pending">
            <Spinner class="absolute inset-0 m-auto" />
        </template>
    </component>
</template>
