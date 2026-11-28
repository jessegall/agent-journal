<script setup lang="ts">
import PaneRows from '@kit/PaneRows';
import type { ActivityPaneData } from '@generated/types/web';

defineProps<ActivityPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open activity" />
</template>
