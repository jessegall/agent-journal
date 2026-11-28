<script setup lang="ts">
import { computed, watch } from 'vue';
import { type DropZoneTarget, type Point, dropZonesSize, dropZoneTargetAt, dropZoneTargets } from './dropZoneTargets';

/**
 * Five drop targets (centre, left, right, up, down) in a 3 by 3 grid centred on a pane while a window is dragged over
 * it; the one the pointer aims at fills and is sent through aim. It has no keyboard path: each target is also a window
 * menu item. Measures: docs/designs/kit-components.md.
 */
const props = defineProps<{ center: Point; pointer?: Point; aimed?: DropZoneTarget | null }>();

const emit = defineEmits<{ aim: [target: DropZoneTarget | null] }>();

// A drag that already knows its target names it; else the pointer aims, within 14px of a cell.
const aimed = computed(() => {
    if (props.aimed !== undefined) {
        return props.aimed;
    }

    return props.pointer ? dropZoneTargetAt(props.pointer, props.center) : null;
});
const place = computed(() => ({
    left: `${props.center.x - dropZonesSize / 2}px`,
    top: `${props.center.y - dropZonesSize / 2}px`,
}));
const cells = Object.entries(dropZoneTargets) as [DropZoneTarget, (typeof dropZoneTargets)[DropZoneTarget]][];

watch(aimed, (target) => emit('aim', target), { immediate: true });
</script>

<template>
    <div
        aria-hidden="true"
        class="pointer-events-none absolute z-(--z-drop-drop zones) grid grid-cols-[repeat(3,26px)] grid-rows-[repeat(3,26px)] gap-0.75"
        :style="place"
    >
        <template v-for="[name, cell] in cells" :key="name">
            <div
                :data-target="name"
                class="rounded-control border border-text-4 shadow-(--shadow-pop)"
                :class="aimed === name ? 'border-brand bg-brand' : 'bg-raised'"
                :style="{ gridColumn: cell.column + 1, gridRow: cell.row + 1 }"
            />
        </template>
    </div>
</template>
