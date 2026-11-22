<script setup lang="ts">
import { computed, watch } from 'vue';
import { type CompassTarget, type Point, compassSize, compassTargetAt, compassTargets } from './compassTargets';

/**
 * Five targets (centre, left, right, up, down) in a 3 by 3 grid of 26px cells with a gap of 3, centred on a pane while
 * a window is dragged over it. A cell is --raised with a 1px --text-4 border, radius --radius-control and --shadow-pop;
 * the one the pointer aims at fills with --brand. The pointer aims at a cell when it is within 14px of the cell's point,
 * 29px from the centre for a side (compassTargetAt). The aimed cell is sent through aim. The compass has no keyboard
 * path: every target is also a menu item (compassTargets holds its label) on the window bar and tab menus.
 */
const props = defineProps<{ center: Point; pointer: Point }>();

const emit = defineEmits<{ aim: [target: CompassTarget | null] }>();

const aimed = computed(() => compassTargetAt(props.pointer, props.center));
const place = computed(() => ({
    left: `${props.center.x - compassSize / 2}px`,
    top: `${props.center.y - compassSize / 2}px`,
}));
const cells = Object.entries(compassTargets) as [CompassTarget, (typeof compassTargets)[CompassTarget]][];

watch(aimed, (target) => emit('aim', target), { immediate: true });
</script>

<template>
    <div
        aria-hidden="true"
        class="pointer-events-none absolute z-(--z-drop-compass) grid grid-cols-[repeat(3,26px)] grid-rows-[repeat(3,26px)] gap-0.75"
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
