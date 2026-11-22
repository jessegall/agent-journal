<script setup lang="ts">
import { useId } from 'vue';
import GroupLabel from './GroupLabel.vue';

/**
 * A titled run of MenuItems inside a Menu: a GroupLabel in its menu place above the items in the default slot.
 * The items sit in a role group named by the heading. The group takes no key: the Menu moves between its items.
 */
defineProps<{ label: string }>();

const labelId = `menu-group-${useId()}`;
</script>

<template>
    <div role="group" :aria-labelledby="labelId">
        <GroupLabel :id="labelId" place="menu">{{ label }}</GroupLabel>
        <slot />
    </div>
</template>
