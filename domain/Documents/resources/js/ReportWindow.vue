<script setup lang="ts">
import type { RecordPageData } from '@generated/types/documents';
import CommentsPanel from '@kit/CommentsPanel';
import LinksPanel from '@kit/LinksPanel';
import ShareButton from '@kit/ShareButton';
import RecordStatus from './RecordStatus.vue';
import RecordWindow from './RecordWindow.vue';

/**
 * A report's page: its text, and the comments left on it.
 */
const props = defineProps<{ data: RecordPageData }>();

const number = props.data.label.replace('report ', '');
</script>

<template>
    <div class="flex flex-col gap-4">
        <RecordWindow :data="data" />
        <ShareButton :reference="data.label" />
        <RecordStatus :data="data" editing="free" :settle-action="`/documents/reports/${number}/settle`" />
        <LinksPanel :source="data.label" :links="data.links" />
        <template v-if="data.publiclyShared">
            <p class="text-text-3">This report is shared publicly: a comment you leave here will be public.</p>
        </template>
        <CommentsPanel :comments="data.comments" :target="data.label" version="1" />
    </div>
</template>
