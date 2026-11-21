<script setup lang="ts">
import SwitchCase from '@/components/kit/SwitchCase.vue';
import LayoutBox from '@/components/layout/LayoutBox.vue';
import LayoutCollection from '@/components/layout/LayoutCollection.vue';
import LayoutNotice from '@/components/layout/LayoutNotice.vue';
import LayoutText from '@/components/layout/LayoutText.vue';
import type { LayoutPartData } from '@/generated/types/core';

// One part of a declared layout, handed to the component of its tag.
defineProps<{ part: LayoutPartData }>();
</script>

<template>
    <SwitchCase :value="part.tag">
        <template #box><LayoutBox :part="part" /></template>
        <template #text><LayoutText :part="part" /></template>
        <template #collection><LayoutCollection :part="part" /></template>
        <template #notice><LayoutNotice :part="part" /></template>
    </SwitchCase>
</template>
