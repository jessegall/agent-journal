<script setup lang="ts">
import type { PlanReaderData } from '@generated/types/plans';
import PlanReader from './PlanReader.vue';

/**
 * One plan, on its own page or in the inspector: the same reader the plans list shows.
 */
defineProps<{ data: PlanReaderData }>();
</script>

<template>
    <PlanReader :reader="data" :selection-missing="false" />
</template>
