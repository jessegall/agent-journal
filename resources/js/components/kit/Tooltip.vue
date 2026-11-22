<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue';

/**
 * A short label on hover (after a delay) and on keyboard focus; it hides at once on leaving, and on Escape. The
 * trigger in the slot receives the tooltip's id as describedBy for its aria-describedby: the tooltip never holds
 * the only name of a control.
 */
const props = withDefaults(defineProps<{ text: string; side?: 'above' | 'right'; delay?: number }>(), {
    side: 'above',
    delay: 300,
});

const id = useId();
const shown = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function showSoon(): void {
    timer = setTimeout(() => (shown.value = true), props.delay);
}

function showAtOnce(event: FocusEvent): void {
    if ((event.target as Element).matches(':focus-visible')) {
        shown.value = true;
    }
}

function hide(): void {
    clearTimeout(timer);
    shown.value = false;
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
    <span
        class="relative inline-flex"
        @mouseenter="showSoon"
        @mouseleave="hide"
        @focusin="showAtOnce"
        @focusout="hide"
        @keydown.esc="hide"
    >
        <slot :described-by="id" />
        <span
            v-if="shown"
            :id="id"
            role="tooltip"
            class="pointer-events-none absolute z-(--z-menu) rounded-control border border-border-2 bg-raised px-2 py-[3px] text-small whitespace-nowrap text-text shadow-pop"
            :class="side === 'right' ? 'top-1/2 left-full ml-2 -translate-y-1/2' : 'bottom-full left-1/2 mb-1 -translate-x-1/2'"
            >{{ text }}</span
        >
    </span>
</template>
