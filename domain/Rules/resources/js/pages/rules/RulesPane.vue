<script setup lang="ts">
import PaneRows from '@/components/panes/PaneRows.vue';
import type { RulesPaneData } from '@generated/types/rules';

defineProps<RulesPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open rules" />
</template>
