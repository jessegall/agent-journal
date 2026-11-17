<script setup lang="ts">
import type { DropZone } from './paneLayout';

/**
 * Version 5's drop compass (panes/DropCompass.vue): an accent shade over the part of the pane the window would take,
 * and five 26 px cells in a cross with the aimed one in accent.
 */
defineProps<{ zone: DropZone }>();

const shades: Record<DropZone, string> = {
    centre: 'top-1 left-1 h-[calc(100%-8px)] w-[calc(100%-8px)]',
    left: 'top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-6px)]',
    right: 'top-1 left-[calc(50%+2px)] h-[calc(100%-8px)] w-[calc(50%-6px)]',
    above: 'top-1 left-1 h-[calc(50%-6px)] w-[calc(100%-8px)]',
    below: 'top-[calc(50%+2px)] left-1 h-[calc(50%-6px)] w-[calc(100%-8px)]',
};

const cells: { zone: DropZone; place: string; mark: string }[] = [
    {
        zone: 'above',
        place: 'col-start-2 row-start-1',
        mark: 'inset-x-[3px] top-[3px] h-2',
    },
    {
        zone: 'left',
        place: 'col-start-1 row-start-2',
        mark: 'inset-y-[3px] left-[3px] w-2',
    },
    { zone: 'centre', place: 'col-start-2 row-start-2', mark: 'inset-[3px]' },
    {
        zone: 'right',
        place: 'col-start-3 row-start-2',
        mark: 'inset-y-[3px] right-[3px] w-2',
    },
    {
        zone: 'below',
        place: 'col-start-2 row-start-3',
        mark: 'inset-x-[3px] bottom-[3px] h-2',
    },
];
</script>

<template>
    <div class="pointer-events-none absolute inset-0 z-4">
        <div
            class="absolute rounded-control border border-brand/50 bg-brand/14 transition-all duration-150 ease-journal"
            :class="shades[zone]"
        ></div>
        <div
            class="absolute top-1/2 left-1/2 grid -translate-1/2 grid-cols-[repeat(3,26px)] grid-rows-[repeat(3,26px)] gap-1"
        >
            <template v-for="cell in cells" :key="cell.zone">
                <div
                    class="relative overflow-hidden rounded-seg border bg-raised transition-colors duration-150"
                    :class="[
                        cell.place,
                        cell.zone === zone ? 'border-brand' : 'border-border-3',
                    ]"
                >
                    <i
                        class="absolute rounded-[2px]"
                        :class="[
                            cell.mark,
                            cell.zone === zone ? 'bg-brand' : 'bg-border-3',
                        ]"
                    ></i>
                </div>
            </template>
        </div>
    </div>
</template>
