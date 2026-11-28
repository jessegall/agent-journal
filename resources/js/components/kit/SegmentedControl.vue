<script setup lang="ts" generic="TValue extends string">
import { radioGroupChoice } from '@/composables/radioGroupKeys';
import { computed, nextTick, provide, useTemplateRef } from 'vue';
import SegmentedItem from './SegmentedItem.vue';
import { segmentedKey } from './segmented';

/**
 * One of a few short settings, as a radio group of SegmentedItems: an inline box with a --border-2 border, radius 7
 * and padding 2. Left and Right (and Up, Down, Home and End) move the choice and the focus, round the ends. An item's
 * icon comes through the icon slot.
 */
const props = defineProps<{
    label: string;
    items: readonly { value: TValue; label: string }[];
    bare?: boolean;
    disabled?: boolean;
}>();
const chosen = defineModel<TValue>({ required: true });

defineSlots<{ items?: () => unknown; icon?: (props: { value: TValue; isOn: boolean }) => unknown }>();

const root = useTemplateRef<HTMLElement>('root');

function choose(value: string): void {
    if (!props.disabled) {
        chosen.value = value as TValue;
    }
}

provide(segmentedKey, { chosen: computed(() => chosen.value), choose });

async function moveBy(event: KeyboardEvent): Promise<void> {
    if (props.disabled) {
        return;
    }

    const next = radioGroupChoice(
        event.key,
        props.items.map((item) => item.value),
        chosen.value,
    );

    if (next === null) {
        return;
    }

    event.preventDefault();
    chosen.value = next;
    await nextTick();
    root.value?.querySelector<HTMLElement>(`[data-segment="${next}"]`)?.focus();
}
</script>

<template>
    <div
        ref="root"
        role="radiogroup"
        :aria-label="label"
        :class="bare ? undefined : 'inline-flex gap-0.5 rounded-button border border-border-2 p-0.5'"
        @keydown="moveBy"
    >
        <slot name="items">
            <template v-for="item in items" :key="item.value">
                <SegmentedItem :value="item.value" :disabled="disabled">
                    <span class="inline-flex items-center gap-2">
                        <slot name="icon" :value="item.value" :is-on="chosen === item.value" />
                        {{ item.label }}
                    </span>
                </SegmentedItem>
            </template>
        </slot>
    </div>
</template>
