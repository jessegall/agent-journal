<script setup lang="ts">
import type { RuleFiltersData, RuleListData } from '@generated/types/rules';
import { useWindowQuery } from '@kit/useWindowQuery';
import { ruleQuery } from './ruleLooks';
import RulesView from './RulesView.vue';

/**
 * The rules window, on Home and on its own page: its links change only its own part of the query.
 */
defineProps<{ data: RuleListData }>();

const windowUrl = useWindowQuery();

function urlForFilters(filters: RuleFiltersData): string {
    return windowUrl(ruleQuery(filters));
}
</script>

<template>
    <RulesView :rules="data" :url-for-filters="urlForFilters" />
</template>
