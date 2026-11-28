<script setup lang="ts">
import { computed } from 'vue';
import NameBlock from './NameBlock.vue';

/**
 * One row of a list: a lead slot, a NameBlock of the title and subline, and a trail of fixed-width cells that line up
 * from row to row, in the single, two or grid form. A row that opens is the pointer target while its link stays the
 * keyboard's control; in a listbox it is an option. Measures: docs/designs/kit-components.md.
 */
const props = withDefaults(
    defineProps<{
        variant?: 'single' | 'two' | 'grid';
        selected?: boolean;
        static?: boolean;
        dim?: boolean;
        option?: boolean;
        opens?: boolean;
        bare?: boolean;
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
        :class="bare ? undefined : [
            'w-full border-b border-line text-left text-field outline-none',
            shape,
            static && !opens && 'cursor-default',
            static && opens && 'cursor-pointer',
            !static && 'focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset',
            (!static || opens) && !selected && 'hover:bg-hover',
            selected && 'bg-sel',
        ]"
        @keydown="moveBetweenOptions"
    >
        <template v-if="bare">
            <slot />
        </template>
        <template v-else>
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
        </template>
    </component>
</template>
