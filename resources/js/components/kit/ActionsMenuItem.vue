<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Spinner from './Spinner.vue';

/**
 * One action in an ActionsMenu: a link when it goes somewhere, otherwise a button, which a form around it may submit.
 * A pending item shows a spinner and cannot be chosen twice.
 */
withDefaults(
    defineProps<{
        href?: string;
        type?: 'button' | 'submit';
        pending?: boolean;
        disabled?: boolean;
    }>(),
    { href: undefined, type: 'button', pending: false, disabled: false },
);
</script>

<template>
    <component
        :is="href ? Link : 'button'"
        :href="href"
        :type="href ? undefined : type"
        :disabled="href ? undefined : disabled || pending"
        :aria-busy="pending || undefined"
        role="menuitem"
        tabindex="-1"
        class="flex w-full items-center gap-2 rounded-control px-2 py-1.5 text-left text-small text-text outline-none hover:bg-hover focus-visible:bg-hover focus-visible:outline-2 focus-visible:outline-text disabled:cursor-default disabled:opacity-45"
    >
        <slot />
        <template v-if="pending">
            <Spinner class="ml-auto" />
        </template>
    </component>
</template>
