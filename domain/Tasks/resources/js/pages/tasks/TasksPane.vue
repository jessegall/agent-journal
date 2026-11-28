<script setup lang="ts">
import PaneRows from '@/components/panes/PaneRows.vue';
import type { TasksPaneData } from '@generated/types/tasks';

defineProps<TasksPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open tasks" />
</template>
