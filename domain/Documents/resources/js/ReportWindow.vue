<script setup lang="ts">
import type { RecordPageData } from '@generated/types/documents';
import CommentsPanel from './CommentsPanel.vue';
import DockToSession from './DockToSession.vue';
import LinksPanel from './LinksPanel.vue';
import RecordStatus from './RecordStatus.vue';
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
        <RecordStatus :data="data" editing="free" :settle-action="`/documents/reports/${number}/settle`" />
        <DockToSession type="report" :number="number" :sessions="data.sessions" />
        <LinksPanel :source="data.label" :links="data.links" />
        <CommentsPanel :comments="data.comments" :action="`/documents/reports/${number}/comments`" :body="data.body" />
    </div>
</template>
