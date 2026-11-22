<script setup lang="ts">
/**
 * The corner grip that resizes a floating window: a 16 × 16 hit area with a 7 × 7 corner mark. It reports how far the
 * pointer moved since the last report; the window applies its own minimum (260 × 180) and the Desk's size.
 */
const emit = defineEmits<{ resize: [dx: number, dy: number] }>();

let last = { x: 0, y: 0 };
let holding = false;

function press(event: PointerEvent): void {
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    last = { x: event.clientX, y: event.clientY };
    holding = true;
}

function drag(event: PointerEvent): void {
    if (!holding) {
        return;
    }

    emit('resize', event.clientX - last.x, event.clientY - last.y);
    last = { x: event.clientX, y: event.clientY };
}
</script>

<template>
    <div
        aria-hidden="true"
        class="absolute right-0 bottom-0 size-4 cursor-nwse-resize touch-none"
        @pointerdown="press"
        @pointermove="drag"
        @pointerup="holding = false"
        @pointercancel="holding = false"
    >
        <span class="absolute right-1 bottom-1 size-[7px] border-r-[1.5px] border-b-[1.5px] border-border-3" />
    </div>
</template>
