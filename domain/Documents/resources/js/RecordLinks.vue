<script setup lang="ts">
import type { RecordLinksPartData } from '@generated/types/documents';
import LinksPanel from './LinksPanel.vue';

/**
 * A record's links as a native part of its layout: the links panel with its form to add one.
 */
defineProps<RecordLinksPartData>();
</script>

<template>
    <LinksPanel :source="source" :links="links" />
</template>
