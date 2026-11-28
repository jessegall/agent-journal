<script setup lang="ts">
import PaneRows from '@/components/panes/PaneRows.vue';
import type { DocumentsPaneData } from '@generated/types/documents';

defineProps<DocumentsPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open documents" />
</template>
