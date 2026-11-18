<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { DocumentPageData } from '@generated/types/documents';
import CommentsPanel from './CommentsPanel.vue';
import LinksPanel from './LinksPanel.vue';
import DockToSession from './DockToSession.vue';
import DraftEditor from './DraftEditor.vue';
import RecordStatus from './RecordStatus.vue';
import RecoverForm from './RecoverForm.vue';
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
        <RecordStatus :data="data.record" :editing="data.editing.state === 'free' ? 'free' : `held by ${data.editing.holder ?? 'you'}`" :settle-action="`/documents/docs/${data.number}/settle`" />
        <SwitchCase :value="data.editing.state">
            <template #yours>
                <DraftEditor :number="data.number" :draft="data.editing.draft!" />
            </template>
            <template #held>
                <template v-if="data.editing.held">
                    <RecoverForm :number="data.number" :holder="data.editing.holder ?? ''" :held="data.editing.held" />
                </template>
                <template v-else>
                    <p class="text-text-3">{{ data.editing.holder }} is editing this document.</p>
                </template>
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
        <DockToSession type="doc" :number="data.number" :sessions="data.record.sessions" />
        <LinksPanel :source="data.record.label" :links="data.record.links" />
        <CommentsPanel :comments="data.record.comments" :target="data.record.label" :body="data.record.body" :version="data.record.revision" />
    </div>
</template>
