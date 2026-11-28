<script setup lang="ts">
import PaneRows from '@kit/PaneRows';
import type { TasksPaneData } from '@generated/types/tasks';

defineProps<TasksPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open tasks" />
</template>
