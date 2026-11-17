<script setup lang="ts" generic="TValue extends string | number | symbol">
/**
 * Renders the named slot matching `value`, in place of a v-if/v-else-if chain that tests one value against
 * literals; with no matching slot the `default` slot renders, when there is one.
 */
import { computed } from 'vue';

const props = defineProps<{
    value: TValue;
}>();

const slots = defineSlots<Record<string, (() => unknown) | undefined>>();

const activeSlot = computed<string>(() => {
    const key = String(props.value);
    return slots[key] ? key : 'default';
});
</script>

<template>
    <slot v-if="activeSlot !== 'default'" :name="activeSlot" />
    <slot v-else name="default" />
</template>
