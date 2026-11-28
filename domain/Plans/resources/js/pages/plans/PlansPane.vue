<script setup lang="ts">
import PaneRows from '@kit/PaneRows';
import type { PlansPaneData } from '@generated/types/plans';

defineProps<PlansPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open plans" />
</template>
