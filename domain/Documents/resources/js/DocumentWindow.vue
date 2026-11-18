<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { DocumentPageData } from '@generated/types/documents';
import CommentsPanel from './CommentsPanel.vue';
import DraftEditor from './DraftEditor.vue';
import RecordWindow from './RecordWindow.vue';
import Button from '@kit/Button';
import SwitchCase from '@kit/SwitchCase';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * A document's page: its published text, and the editor of its draft for whoever holds it.
 */
const props = defineProps<{ data: DocumentPageData }>();

function open(): void {
    router.post(`/documents/docs/${props.data.number}/open`, {}, { preserveScroll: true, ...formSendingHooks() });
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <RecordWindow :data="data.record" />
        <SwitchCase :value="data.editing.state">
            <template #yours>
                <DraftEditor :number="data.number" :draft="data.editing.draft!" />
            </template>
            <template #held>
                <p class="text-text-3">{{ data.editing.holder }} is editing this document.</p>
            </template>
            <template #free>
                <Button variant="primary" @click="open">Edit</Button>
            </template>
        </SwitchCase>
        <section class="flex flex-col gap-1">
            <h2 class="text-heading">History</h2>
            <template v-for="revision in data.revisions" :key="revision.number">
                <a class="flex gap-2" :href="`/documents/docs/${data.number}/revisions/${revision.number}`">
                    <span class="font-mono tabular-nums">revision {{ revision.number }}</span>
                    <span>{{ revision.title }}</span>
                    <span class="text-text-3">{{ revision.closedAt }}</span>
                </a>
            </template>
        </section>
        <CommentsPanel
            :comments="data.record.comments"
            :action="`/documents/docs/${data.number}/comments`"
            :body="data.record.body"
            :revision="data.record.revision"
            :revision-path="`/documents/docs/${data.number}/revisions`"
        />
    </div>
</template>
