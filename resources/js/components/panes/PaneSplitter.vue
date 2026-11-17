<script setup lang="ts">
import { ref } from 'vue';
import { KEYBOARD_STEP } from './paneLayout';

/**
 * Version 5's splitter (panes/ResizeHandle.vue): a 7 px hit area over the border between two panes, its 1 px line
 * showing on hover and turning accent while it rests in the middle. A drag moves it, a double-click puts it back in
 * the middle and the arrow keys move it by a step. It measures the split it sits in, its parent element.
 */
const props = defineProps<{ axis: 'row' | 'column'; ratio: number }>();

const emit = defineEmits<{
    move: [ratio: number, spaceSize: number];
    reset: [];
}>();

const handle = ref<HTMLElement | null>(null);
const isDragging = ref(false);

const keySteps: Record<'row' | 'column', Record<string, number>> = {
    row: { ArrowLeft: -1, ArrowRight: 1 },
    column: { ArrowUp: -1, ArrowDown: 1 },
};

function spaceOf(): DOMRect {
    return (
        handle.value?.parentElement ?? document.body
    ).getBoundingClientRect();
}

function moveTo(event: PointerEvent): void {
    const space = spaceOf();

    if (props.axis === 'row') {
        emit('move', (event.clientX - space.left) / space.width, space.width);

        return;
    }

    emit('move', (event.clientY - space.top) / space.height, space.height);
}

function startDrag(event: PointerEvent): void {
    event.preventDefault();
    isDragging.value = true;
    document.body.classList.add(
        props.axis === 'row' ? 'resizing' : 'resizing-y',
    );

    const stopDrag = (): void => {
        isDragging.value = false;
        document.body.classList.remove('resizing', 'resizing-y');
        window.removeEventListener('pointermove', moveTo);
        window.removeEventListener('pointerup', stopDrag);
    };

    window.addEventListener('pointermove', moveTo);
    window.addEventListener('pointerup', stopDrag);
}

function moveByKey(event: KeyboardEvent): void {
    const step = keySteps[props.axis][event.key];

    if (step === undefined) {
        return;
    }

    event.preventDefault();
    const space = spaceOf();
    emit(
        'move',
        props.ratio + step * KEYBOARD_STEP,
        props.axis === 'row' ? space.width : space.height,
    );
}
</script>

<template>
    <div
        ref="handle"
        role="separator"
        tabindex="0"
        :aria-orientation="axis === 'row' ? 'vertical' : 'horizontal'"
        :aria-valuenow="Math.round(ratio * 100)"
        aria-valuemin="0"
        aria-valuemax="100"
        title="Drag to resize; double-click to reset"
        class="group relative z-3 flex-none touch-none focus-visible:outline-none"
        :class="
            axis === 'row'
                ? '-mx-[3px] w-[7px] cursor-col-resize'
                : '-my-[3px] h-[7px] cursor-row-resize'
        "
        @pointerdown="startDrag"
        @dblclick="emit('reset')"
        @keydown="moveByKey"
    >
        <span
            class="absolute transition-colors duration-150 group-hover:bg-border-3 group-focus-visible:bg-brand"
            :class="[
                axis === 'row'
                    ? 'inset-x-[3px] inset-y-0'
                    : 'inset-x-0 inset-y-[3px]',
                isDragging && ratio === 0.5 ? 'bg-brand!' : 'bg-transparent',
            ]"
        ></span>
    </div>
</template>
