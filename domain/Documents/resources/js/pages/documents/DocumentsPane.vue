<script setup lang="ts">
import PaneRows from '@kit/PaneRows';
import type { DocumentsPaneData } from '@generated/types/documents';

defineProps<DocumentsPaneData>();
</script>

<template>
    <PaneRows :items="items" :full-url="fullUrl" full-label="Open documents" />
</template>
