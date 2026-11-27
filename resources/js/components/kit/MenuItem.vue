<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed, inject, ref } from 'vue';
import Icon from './Icon.vue';
import { listBoxActiveKey } from './listBoxActive';
import Spinner from './Spinner.vue';

/**
 * One row of a Menu: a leading slot, the label and subline, and a trailing slot. It is a link with an href, else a
 * button; a ticked item is a menuitemcheckbox or menuitemradio, a pending item shows a spinner, and in a ListBox it is
 * an option with the active look. Measures: docs/designs/kit-components.md.
 */
const props = withDefaults(
    defineProps<{
        id?: string;
        option?: boolean;
        href?: string;
        type?: 'button' | 'submit';
        checked?: boolean;
        radio?: boolean;
        pending?: boolean;
        disabled?: boolean;
        active?: boolean;
    }>(),
    {
        id: undefined,
        option: false,
        href: undefined,
        type: 'button',
        checked: undefined,
        radio: false,
        pending: false,
        disabled: false,
        active: false,
    },
);

const listBoxActiveId = inject(listBoxActiveKey, ref(null));
const isLink = computed(() => props.href !== undefined && !props.disabled);
const isActive = computed(() => props.active || (props.id !== undefined && props.id === listBoxActiveId.value));

const role = computed(() => {
    if (props.option) {
        return 'option';
    }

    if (props.checked === undefined) {
        return 'menuitem';
    }

    return props.radio ? 'menuitemradio' : 'menuitemcheckbox';
});

function clickLinkOnSpace(event: KeyboardEvent): void {
    if (!isLink.value || event.key !== ' ') {
        return;
    }

    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
}
</script>

<template>
    <component
        :is="isLink ? Link : 'button'"
        :href="isLink ? href : undefined"
        :type="isLink ? undefined : type"
        :disabled="isLink ? undefined : disabled || pending"
        :id="id"
        :role="role"
        :aria-selected="option ? isActive : undefined"
        :aria-checked="checked === undefined || option ? undefined : checked"
        :aria-busy="pending || undefined"
        tabindex="-1"
        class="flex w-full items-center gap-[9px] rounded-control px-2 py-1.5 text-left text-small text-text-2 outline-none hover:bg-hover hover:text-text focus-visible:bg-sel focus-visible:text-text focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus disabled:cursor-default disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-text-2"
        :class="{ 'bg-sel text-text ring-2 ring-inset ring-focus': isActive }"
        @keydown="clickLinkOnSpace"
    >
        <template v-if="$slots.leading">
            <span class="flex shrink-0 items-center">
                <slot name="leading" />
            </span>
        </template>
        <span class="flex min-w-0 flex-1 flex-col">
            <slot />
        </span>
        <template v-if="checked">
            <span class="flex shrink-0 items-center">
                <Icon name="tick" :size="14" />
            </span>
        </template>
        <template v-if="pending">
            <Spinner />
        </template>
        <template v-if="$slots.trailing">
            <span class="flex shrink-0 items-center">
                <slot name="trailing" />
            </span>
        </template>
    </component>
</template>
