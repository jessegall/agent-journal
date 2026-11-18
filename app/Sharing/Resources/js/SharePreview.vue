<script setup lang="ts">
import type { SharePreviewData } from '@/types/generated';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import PageHeader from '@kit/PageHeader';
import { formSendingHooks } from '@kit/usePageChanges';
import { ref } from 'vue';

/**
 * The owner's preview of sharing one record: select which linked records go with it, read what the gateway provider
 * can see, and save the preview; a saved preview is then confirmed into a new share, approves an agent's proposal of
 * this record, or replaces the members of its live share. Each confirmation carries a new Idempotency-Key.
 */
const props = defineProps<{ data: SharePreviewData }>();

const form = useForm({ selected: props.data.savedPreview?.selectedIds ?? props.data.candidates.filter((candidate) => candidate.shared).map((candidate) => candidate.id) });

function save(): void {
    form.post(`/sharing/${encodeURIComponent(props.data.rootReference)}/previews`, { preserveScroll: true, ...formSendingHooks() });
}

const durations = [
    { label: '1 hour', minutes: 60 },
    { label: '1 day', minutes: 1440 },
    { label: '7 days', minutes: 10080 },
    { label: '30 days', minutes: 43200 },
] as const;

const minutes = ref<number>(10080);

const confirm = useForm({ previewId: '', previewChecksum: '', minutes: 10080 });

function confirmTo(url: string): void {
    const saved = props.data.savedPreview;

    if (saved === null) {
        return;
    }

    confirm.previewId = saved.id;
    confirm.previewChecksum = saved.checksum;
    confirm.minutes = minutes.value;
    confirm.post(url, { headers: { 'Idempotency-Key': crypto.randomUUID() }, preserveScroll: true });
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
        <section v-if="data.savedPreview" class="flex flex-col gap-2" aria-label="Confirm">
            <label v-if="data.liveShare === null" class="flex items-center gap-2">
                <span>Share for</span>
                <select v-model.number="minutes">
                    <option v-for="duration in durations" :key="duration.minutes" :value="duration.minutes">{{ duration.label }}</option>
                </select>
            </label>
            <div class="flex flex-wrap gap-2">
                <Button v-if="data.liveShare === null" type="button" :disabled="confirm.processing" @click="confirmTo(`/sharing/${encodeURIComponent(data.rootReference)}/shares`)">Share</Button>
                <Button v-else type="button" :disabled="confirm.processing" @click="confirmTo(`/sharing/shares/${data.liveShare.id}/scope`)">Update share {{ data.liveShare.number }}</Button>
                <Button v-for="proposal in data.openProposals" :key="proposal.id" type="button" :disabled="confirm.processing" @click="confirmTo(`/sharing/shares/${proposal.id}/approval`)">Approve proposal {{ proposal.number }}</Button>
            </div>
            <FormErrors :errors="confirm.errors" />
        </section>
        <form class="flex gap-2" @submit.prevent="save">
            <Button type="submit" :pending="form.processing" :disabled="form.processing">Save preview</Button>
            <FormErrors :errors="form.errors" />
        </form>
    </div>
</template>
