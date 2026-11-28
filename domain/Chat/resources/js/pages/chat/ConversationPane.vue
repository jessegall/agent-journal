<script setup lang="ts">
import PaneRows from '@/components/panes/PaneRows.vue';
import type { ConversationPaneData } from '@generated/types/chat';

defineProps<ConversationPaneData>();
</script>

<template>
    <PaneRows :heading="label" :items="items" :full-url="fullUrl" full-label="Open conversation" />
</template>
