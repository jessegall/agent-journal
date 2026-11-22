<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';
import Menu from './Menu.vue';
import Spinner from './Spinner.vue';

/**
 * A button that shows what is chosen and opens a Menu, in three variants. The pill is 26px high and round, with a
 * --border-2 border on --raised, for an Icon or AvatarStack, a name and a Spinner while its agent works. The field is
 * 24px high with a --line border and medium weight, for an sm Avatar and a name. The who is bare, for a large Avatar or
 * AvatarStack, a name and a subline of --text-badge --text-3 that ends in an ellipsis; it takes --hover on hover. Each
 * ends in a caret. A drop target takes --hover with a 2px --focus outline at offset 1. The leading slot holds the
 * Icon or Avatar, the default slot the Menu's items. It opens with Enter, Space and Down (aria-haspopup menu and
 * aria-expanded, from the Menu).
 */
const props = withDefaults(
    defineProps<{
        variant?: 'pill' | 'field' | 'who';
        label: string;
        subline?: string;
        busy?: boolean;
        dropTarget?: boolean;
    }>(),
    { variant: 'pill', subline: undefined, busy: false, dropTarget: false },
);

const looks = {
    pill: 'h-6.5 gap-[7px] rounded-full border border-border-2 bg-raised pr-2.5 pl-2 text-small text-text-2 hover:border-border-3 hover:text-text',
    field: 'h-6 gap-1.5 rounded-button border border-line px-1.5 text-small font-medium text-text-2 hover:text-text',
    who: 'gap-2 rounded-field py-0.75 pr-1.5 pl-0.75 text-text hover:bg-hover',
};

const triggerClass = computed(() => [
    looks[props.variant],
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    props.dropTarget && 'bg-hover outline-2 outline-offset-1 outline-focus',
]);
</script>

<template>
    <Menu :label="label" align="left" :trigger-class="triggerClass.filter(Boolean).join(' ')">
        <template #trigger>
            <slot name="leading" />
            <span class="flex min-w-0 flex-col text-left">
                <span class="truncate whitespace-nowrap">{{ label }}</span>
                <template v-if="variant === 'who' && subline !== undefined">
                    <span class="max-w-85 truncate text-badge text-text-3">{{ subline }}</span>
                </template>
            </span>
            <template v-if="busy">
                <Spinner />
            </template>
            <Icon name="caret" :size="12" class="text-text-3" />
        </template>
        <slot />
    </Menu>
</template>
