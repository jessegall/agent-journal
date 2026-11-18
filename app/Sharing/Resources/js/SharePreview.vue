<script setup lang="ts">
import type { SharePreviewData } from '@/types/generated';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import PageHeader from '@kit/PageHeader';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * The owner's preview of sharing one record: select which linked records go with it, read what the gateway provider
 * can see, and save the preview to confirm it.
 */
const props = defineProps<{ data: SharePreviewData }>();

const form = useForm({ selected: props.data.savedPreview?.selectedIds ?? props.data.candidates.filter((candidate) => candidate.shared).map((candidate) => candidate.id) });

function save(): void {
    form.post(`/sharing/${encodeURIComponent(props.data.rootReference)}/previews`, { preserveScroll: true, ...formSendingHooks() });
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader :title="`Share ${data.rootTitle}`" />
        <section class="flex flex-col gap-2" aria-label="Linked records">
            <p v-if="data.candidates.length === 0">No linked record can be shared with it.</p>
            <label v-for="candidate in data.candidates" :key="candidate.id" class="flex items-center gap-2">
                <input v-model="form.selected" type="checkbox" :value="candidate.id" />
                <span>{{ candidate.title }}</span>
                <span class="text-muted">Linked</span>
                <span v-if="!candidate.shared" class="text-muted">Not shared yet</span>
            </label>
        </section>
        <section class="flex flex-col gap-1" aria-label="Before you share">
            <p>The gateway provider can see the public address and everything this share shows.</p>
            <p>Turning off traffic inspection does not hide the content from the provider.</p>
            <p>This machine and the share service must keep running for the link to work.</p>
        </section>
        <p v-if="data.savedPreview">Preview saved; it can be confirmed until {{ data.savedPreview.expiresAt }}.</p>
        <form class="flex gap-2" @submit.prevent="save">
            <Button type="submit" :pending="form.processing" :disabled="form.processing">Save preview</Button>
            <FormErrors :errors="form.errors" />
        </form>
    </div>
</template>
