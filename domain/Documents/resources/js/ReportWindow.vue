<script setup lang="ts">
import type { RecordPageData } from '@generated/types/documents';
import CommentsPanel from './CommentsPanel.vue';
import RecordWindow from './RecordWindow.vue';

/**
 * A report's page: its text, and the comments users wrote on it.
 */
const props = defineProps<{ data: RecordPageData }>();

const number = props.data.label.replace('report ', '');
</script>

<template>
    <div class="flex flex-col gap-4">
        <RecordWindow :data="data" />
        <CommentsPanel :comments="data.comments" :action="`/documents/reports/${number}/comments`" :body="data.body" />
    </div>
</template>
