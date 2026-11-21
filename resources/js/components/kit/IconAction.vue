<script setup lang="ts">
import Button from './Button.vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

/**
 * Version 5's flush icon button with its tooltip: a 24 px square in one quiet grey, a slight fill on hover, and its
 * tip, with a small pointer toward the button, shown on hover or keyboard focus after a short delay, above the button
 * or to its left where above would leave its container. The label says the whole action for a screen reader; the
 * icon may draw smaller inside the same square. Every other attribute, a click or disabled among them, belongs to the
 * button, not to the box around it.
 */
defineOptions({ inheritAttrs: false });

withDefaults(
    defineProps<{
        icon: IconName;
        tip: string;
        label: string;
        isPressed?: boolean;
        iconSize?: number;
        tipSide?: 'top' | 'left';
    }>(),
    { isPressed: undefined, iconSize: 16, tipSide: 'top' },
);
</script>

<template>
    <span class="group/tip relative inline-flex">
        <Button
            v-bind="$attrs"
            variant="icon"
            :aria-label="label"
            :aria-pressed="isPressed === undefined ? undefined : isPressed"
        >
            <Icon :name="icon" :size="iconSize" />
        </Button>
        <span
            role="tooltip"
            class="pointer-events-none absolute z-10 rounded-button border border-(--tip-edge) bg-(--tip-bg) px-2 py-1 text-small whitespace-nowrap text-text opacity-0 shadow-(--tip-shadow) transition-opacity delay-0 group-focus-within/tip:opacity-100 group-hover/tip:opacity-100 group-hover/tip:delay-300"
            :class="
                tipSide === 'left'
                    ? 'top-1/2 right-full mr-2 -translate-y-1/2'
                    : 'bottom-full left-1/2 mb-2 -translate-x-1/2'
            "
            >{{ tip
            }}<span
                aria-hidden="true"
                class="absolute size-2 rotate-45 border-(--tip-edge) bg-(--tip-bg)"
                :class="
                    tipSide === 'left'
                        ? 'top-1/2 -right-1 -translate-y-1/2 border-t border-r'
                        : '-bottom-1 left-1/2 -translate-x-1/2 border-r border-b'
                "
            ></span
        ></span>
    </span>
</template>
