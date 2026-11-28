<script setup lang="ts">
import PaneRows from '@kit/PaneRows';
import type { RemindersPaneData } from '@generated/types/reminders';

defineProps<RemindersPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open reminders" />
</template>
