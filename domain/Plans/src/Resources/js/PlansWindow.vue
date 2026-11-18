<script setup lang="ts">
import type { PlanFiltersData, PlanListData } from '@generated/types/plans';
import { useWindowQuery } from '@kit/useWindowQuery';
import PlansView from './PlansView.vue';
import { planQuery } from './planUrls';

/**
 * The plans window, on Home and on its own page: its links change only its own part of the query.
 */
defineProps<{ data: PlanListData }>();

const windowUrl = useWindowQuery();

function urlForFilters(filters: PlanFiltersData): string {
    return windowUrl(planQuery(filters));
}
</script>

<template>
    <PlansView :plans="data" :url-for-filters="urlForFilters" />
</template>
