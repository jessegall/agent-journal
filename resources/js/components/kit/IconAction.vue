<script setup lang="ts">
import { ref } from 'vue';
import Button from './Button.vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

/**
 * The flush icon button with its tooltip: a 24 px square in a quiet grey, filled slightly on hover, its tip shown on
 * hover or focus after a short delay. The label names the whole action for a screen reader, and every other attribute
 * belongs to the button.
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
        expanded?: boolean;
        controls?: string;
    }>(),
    { isPressed: undefined, iconSize: 16, tipSide: 'top', expanded: undefined, controls: undefined },
);

const box = ref<HTMLElement | null>(null);

/**
 * Moves focus to the button itself, as a closed panel returns it there.
 */
function focus(): void {
    box.value?.querySelector<HTMLElement>('button, a')?.focus();
}

defineExpose({ focus });
</script>

<template>
    <span ref="box" class="group/tip relative inline-flex">
        <Button
            v-bind="$attrs"
            variant="icon"
            :aria-label="label"
            :aria-pressed="isPressed === undefined ? undefined : isPressed"
            :aria-expanded="expanded"
            :aria-controls="controls"
        >
            <Icon :name="icon" :size="iconSize" />
        </Button>
        <slot />
        <span
            role="tooltip"
            class="pointer-events-none absolute z-10 rounded-button border border-(--tip-edge) bg-(--tip-bg) px-2 py-1 text-small whitespace-nowrap text-text opacity-0 shadow-pop transition-opacity delay-0 group-focus-within/tip:opacity-100 group-hover/tip:opacity-100 group-hover/tip:delay-300"
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
