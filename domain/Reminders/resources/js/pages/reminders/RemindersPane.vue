<script setup lang="ts">
import PaneRows from '@/components/panes/PaneRows.vue';
import type { RemindersPaneData } from '@generated/types/reminders';

defineProps<RemindersPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open reminders" />
</template>
