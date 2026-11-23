<script setup lang="ts">
import { computed } from 'vue';
import NameBlock from './NameBlock.vue';

/**
 * One row of a list, full width, with a gap of 10, --text-field text and a --line border below: a lead slot (a number
 * 40 wide, a DriverMark or an Icon), a NameBlock fed by the title and subline slots, and a trail slot whose cells have
 * fixed widths so they line up from row to row. Single has padding 7 12, two has 8 12 and shows the subline, and grid
 * (accounts) has padding 8 12 and four columns of 16, a flexible one, 84 and 96 with a gap of 12, where the trail holds
 * the last two cells.
 * A static row is a plain div with the default cursor, unless it opens: then the whole row is the pointer target and
 * takes the hover, while its own link stays the control a keyboard reaches. Hover takes --hover, selected takes --sel,
 * and focus draws the ring at offset -2. In a listbox the row is an option and selected is aria-selected, and Up and Down
 * move between the options; in a list of links the selected row is aria-current. Enter opens it.
 */
const props = withDefaults(
    defineProps<{
        variant?: 'single' | 'two' | 'grid';
        selected?: boolean;
        static?: boolean;
        dim?: boolean;
        option?: boolean;
        opens?: boolean;
    }>(),
    { variant: 'single', selected: false, static: false, dim: false, option: false, opens: false },
);

const shape = computed(
    () =>
        ({
            single: 'flex items-center gap-2.5 px-3 py-[7px]',
            two: 'flex items-center gap-2.5 px-3 py-2',
            grid: 'grid grid-cols-[16px_minmax(0,1fr)_84px_96px] items-center gap-3 px-3 py-2',
        })[props.variant],
);

function moveBetweenOptions(event: KeyboardEvent): void {
    if (!props.option || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) {
        return;
    }

    const row = event.currentTarget as HTMLElement;
    const sibling = event.key === 'ArrowDown' ? row.nextElementSibling : row.previousElementSibling;

    if (sibling instanceof HTMLElement && sibling.getAttribute('role') === 'option') {
        event.preventDefault();
        sibling.focus();
    }
}
</script>

<template>
    <component
        :is="static ? 'div' : 'button'"
        :type="static ? undefined : 'button'"
        :role="option ? 'option' : undefined"
        :aria-selected="option ? selected : undefined"
        :aria-current="!option && !static && selected ? 'true' : undefined"
        :data-selected="selected ? '' : undefined"
        class="w-full border-b border-line text-left text-field outline-none"
        :class="[
            shape,
            static && !opens && 'cursor-default',
            static && opens && 'cursor-pointer',
            !static && 'focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset',
            (!static || opens) && !selected && 'hover:bg-hover',
            selected && 'bg-sel',
        ]"
        @keydown="moveBetweenOptions"
    >
        <slot name="lead" />
        <NameBlock :dim="dim">
            <template #title>
                <slot name="title" />
            </template>
            <template v-if="$slots.subline && variant !== 'single'" #subline>
                <slot name="subline" />
            </template>
        </NameBlock>
        <slot name="trail" />
    </component>
</template>
