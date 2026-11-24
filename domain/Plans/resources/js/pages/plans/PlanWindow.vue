<script setup lang="ts">
import type { PlanReaderData } from '@generated/types/plans';
import ShareButton from '@kit/ShareButton';
import PlanReader from './partials/PlanReader.vue';

/**
 * One plan's richer interactions, a native part under its layout's header and facts, on its own page or in the
 * inspector: Share and the same reader the plans list shows, with its outline, start and review.
 */
const data = defineProps<PlanReaderData>();
</script>

<template>
    <div class="flex flex-col gap-4">
        <ShareButton :reference="`plan ${data.card.number}`" />
        <PlanReader :reader="data" :selection-missing="false" />
    </div>
</template>
