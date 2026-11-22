<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import Spinner from './Spinner.vue';

/**
 * Doc 4's button: ghost by default, bordered, primary (dim fill, choice 3), danger or icon; small, normal or large.
 * A pending button keeps its width, hides its label behind a spinner and cannot be pressed twice.
 */
const props = withDefaults(
    defineProps<{
        variant?: 'ghost' | 'bordered' | 'primary' | 'danger' | 'icon';
        size?: 'small' | 'normal' | 'large';
        type?: 'button' | 'submit';
        href?: string;
        pending?: boolean;
        disabled?: boolean;
    }>(),
    {
        variant: 'ghost',
        size: 'normal',
        type: 'button',
        href: undefined,
        pending: false,
        disabled: false,
    },
);

const look = computed(
    () =>
        ({
            ghost: 'text-text-2 hover:bg-hover hover:text-text',
            bordered:
                'border-border-2 text-text-2 hover:bg-hover hover:text-text',
            primary:
                'border-brand bg-brand-dim text-brand-text hover:bg-brand hover:text-on-brand',
            danger: 'border-[color-mix(in_srgb,var(--danger)_55%,var(--border-2))] text-danger hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]',
            icon: 'size-6 justify-center p-0 text-text-3 hover:bg-[color-mix(in_srgb,var(--border-3)_70%,transparent)] hover:text-text',
        })[props.variant],
);

const height = computed(() =>
    props.variant === 'icon'
        ? ''
        : {
              small: 'h-6 px-[9px] text-small',
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
        class="relative inline-flex items-center gap-1.5 rounded-button border border-transparent transition-colors duration-(--duration-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default disabled:opacity-45"
        :class="[look, height]"
    >
        <span
            :class="{ invisible: pending }"
            class="inline-flex items-center gap-1.5"
            ><slot
        /></span>
        <template v-if="pending">
            <Spinner class="absolute inset-0 m-auto" />
        </template>
    </component>
</template>
