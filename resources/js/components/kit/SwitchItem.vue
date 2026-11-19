<script setup lang="ts" generic="TField extends string, TItem extends Record<TField, string>">
/**
 * Renders the named slot matching the item's `by` field, handing that slot the item narrowed to its case, so a slot
 * reads the fields only its case has without testing the field again; with no matching slot the `default` slot renders.
 */
import { computed } from 'vue';

const props = defineProps<{
    item: TItem;
    by: TField;
}>();

const slots = defineSlots<
    { [TCase in TItem[TField]]?: (props: { item: Extract<TItem, Record<TField, TCase>> }) => unknown } & {
        default?: (props: { item: TItem }) => unknown;
    }
>();

// The slot is chosen by the item's own field, so the item is that slot's case: the one claim a generic cannot prove.
const caseItem = computed(() => props.item as Extract<TItem, Record<TField, string>>);

const activeSlot = computed<TItem[TField] | 'default'>(() => {
    const value = props.item[props.by];
    return value in slots ? value : 'default';
});
</script>

<template>
    <slot v-if="activeSlot !== 'default'" :name="activeSlot" :item="caseItem" />
    <slot v-else name="default" :item="item" />
</template>
