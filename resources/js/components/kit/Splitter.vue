<script setup lang="ts">
import { computed, ref } from 'vue';

/**
 * The shared edge between two panes: an 8 px hit strip with a 2 px line on hover, on focus and while dragged. The
 * ratio (0 to 1, the first pane's share) is clamped so each pane keeps 140 px of the span. The arrows along its
 * axis move it 5%, a double click resets it to 50%, and a pointer drag starts after 5 px. The parent places it.
 */
const props = defineProps<{ axis: 'x' | 'y'; span: number }>();
const ratio = defineModel<number>({ default: 0.5 });

const MIN_PANE = 140;
const STEP = 0.05;
const DRAG_START = 5;

const lowest = computed(() => Math.min(MIN_PANE / props.span, 0.5));
const highest = computed(() => 1 - lowest.value);
const dragging = ref(false);
let origin = { point: 0, ratio: 0, moved: false };

function clamp(next: number): number {
    return Math.min(highest.value, Math.max(lowest.value, next));
}

function pointOf(event: PointerEvent): number {
    return props.axis === 'x' ? event.clientX : event.clientY;
}

function press(event: PointerEvent): void {
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    origin = { point: pointOf(event), ratio: ratio.value, moved: false };
    dragging.value = true;
}

function drag(event: PointerEvent): void {
    if (!dragging.value) {
        return;
    }

    const distance = pointOf(event) - origin.point;
    origin.moved = origin.moved || Math.abs(distance) >= DRAG_START;

    if (origin.moved) {
        ratio.value = clamp(origin.ratio + distance / props.span);
    }
}

function release(): void {
    dragging.value = false;
}

function step(event: KeyboardEvent): void {
    const along = props.axis === 'x' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    const direction = along.indexOf(event.key);

    if (direction === -1) {
        return;
    }

    event.preventDefault();
    ratio.value = clamp(ratio.value + (direction === 0 ? -STEP : STEP));
}
</script>

<template>
    <div
        role="separator"
        tabindex="0"
        aria-label="Resize panes"
        :aria-orientation="axis === 'x' ? 'vertical' : 'horizontal'"
        :aria-valuenow="Math.round(ratio * 100)"
        :aria-valuemin="Math.round(lowest * 100)"
        :aria-valuemax="Math.round(highest * 100)"
        class="group absolute z-(--z-strip) touch-none outline-none"
        :class="axis === 'x' ? 'h-full w-2 cursor-col-resize' : 'h-2 w-full cursor-row-resize'"
        @pointerdown="press"
        @pointermove="drag"
        @pointerup="release"
        @pointercancel="release"
        @dblclick="ratio = 0.5"
        @keydown="step"
    >
        <span
            aria-hidden="true"
            class="absolute bg-border-3 opacity-0 transition-opacity duration-(--duration-hover) group-hover:opacity-100 group-focus-visible:bg-focus group-focus-visible:opacity-100"
            :class="[
                axis === 'x' ? 'inset-y-0 left-1/2 w-0.5 -translate-x-1/2' : 'inset-x-0 top-1/2 h-0.5 -translate-y-1/2',
                dragging && 'opacity-100',
            ]"
        />
    </div>
</template>
