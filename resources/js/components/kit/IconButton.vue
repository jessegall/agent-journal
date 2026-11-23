<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';
import Tooltip from './Tooltip.vue';

/**
 * Renders its default slot as it is, with no tooltip around it and nothing to describe it.
 */
const PlainSlot = (_props: unknown, { slots }: { slots: { default?: (scope: { describedBy: undefined }) => unknown } }) =>
    slots.default?.({ describedBy: undefined });

/**
 * An icon-only action. The label is required: it is the aria-label and the text of the tooltip (never a title
 * attribute) unless `tooltip` is off for an icon that says it all, such as a dialog's close. md is 26 px, sm 20 px and
 * xs 18 px (a tab's close); `dense` draws the md icon at 13 px as in the topbar and strips. A badge goes in the badge
 * slot; haspopup marks a menu or dialog trigger.
 */
const props = withDefaults(
    defineProps<{
        icon: IconName;
        label: string;
        size?: 'md' | 'sm' | 'xs';
        dense?: boolean;
        pressed?: boolean;
        disabled?: boolean;
        haspopup?: 'menu' | 'dialog';
        expanded?: boolean;
        tooltip?: boolean;
    }>(),
    {
        size: 'md',
        dense: false,
        pressed: undefined,
        disabled: false,
        haspopup: undefined,
        expanded: undefined,
        tooltip: true,
    },
);

defineOptions({ inheritAttrs: false });

const iconSize = computed(() => (props.size === 'xs' || props.dense ? 'sm' : 'md'));
</script>

<template>
    <component :is="tooltip ? Tooltip : PlainSlot" :text="label">
        <template #default="{ describedBy }">
            <button
                v-bind="$attrs"
                type="button"
                :aria-label="label"
                :aria-describedby="describedBy"
                :aria-pressed="pressed"
                :aria-haspopup="haspopup"
                :aria-expanded="expanded"
                :disabled="disabled"
                class="relative inline-flex shrink-0 items-center justify-center rounded-control transition-colors duration-(--duration-hover) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-40"
                :class="[
                    { md: 'size-6.5', sm: 'size-5', xs: 'size-4.5' }[size],
                    pressed ? 'bg-sel text-text' : 'text-text-3 hover:bg-hover hover:text-text',
                ]"
            >
                <Icon :name="icon" :size="iconSize" />
                <slot name="badge" />
            </button>
        </template>
    </component>
</template>
