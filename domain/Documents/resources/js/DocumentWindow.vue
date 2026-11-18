<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { DocumentPageData } from '@generated/types/documents';
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
    </div>
</template>
