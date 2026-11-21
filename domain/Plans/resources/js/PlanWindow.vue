<script setup lang="ts">
import type { PlanReaderData } from '@generated/types/plans';
import { useHostProp } from '@kit/hostProp';
import ShareButton from '@kit/ShareButton';
import PlanReader from './PlanReader.vue';

/**
 * One plan, on its own page or in the inspector: the same reader the plans list shows.
 */
defineProps<{ data: PlanReaderData }>();

const refresh = [useHostProp()];
</script>

<template>
    <div class="flex flex-col gap-4">
        <ShareButton :reference="`plan ${data.card.number}`" />
        <PlanReader
            :reader="data"
            :selection-missing="false"
            :refresh="refresh"
        />
    </div>
</template>
