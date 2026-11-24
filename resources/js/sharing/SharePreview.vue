<script setup lang="ts">
import type { SharePreviewData } from '@generated/types/sharing';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import PageHeader from '@kit/PageHeader';
import Select from '@kit/Select';
import { formSendingHooks } from '@kit/usePageChanges';
import { ref } from 'vue';
import UpdateLiveShareButton from './UpdateLiveShareButton.vue';

/**
 * The owner's preview of sharing one record: select which linked records go with it, read what the gateway provider
 * can see, and save the preview; a saved preview is then confirmed into a new share, approves an agent's proposal of
 * this record, or replaces the members of its live share. Each confirmation carries a new Idempotency-Key.
 */
const props = defineProps<{ data: SharePreviewData }>();

const form = useForm({
    selected:
        props.data.savedPreview?.selectedIds ??
        props.data.candidates
            .filter((candidate) => candidate.shared)
            .map((candidate) => candidate.id),
});

function save(): void {
    form.post(
        `/sharing/${encodeURIComponent(props.data.rootReference)}/previews`,
        { preserveScroll: true, ...formSendingHooks() },
    );
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

    if (saved === undefined) {
        return;
    }

    confirm.previewId = saved.id;
    confirm.previewChecksum = saved.checksum;
    confirm.minutes = minutes.value;
    confirm.post(url, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        preserveScroll: true,
    });
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader :title="`Share ${data.rootTitle}`" />
        <section class="flex flex-col gap-2" aria-label="Linked records">
            <template v-if="data.candidates.length === 0">
                <p>No linked record can be shared with it.</p>
            </template>
            <template v-for="candidate in data.candidates" :key="candidate.id">
                <label class="flex items-center gap-2">
                    <input
                        v-model="form.selected"
                        type="checkbox"
                        :value="candidate.id"
                    />
                    <span>{{ candidate.title }}</span>
                    <span class="text-muted-foreground">Linked</span>
                    <template v-if="!candidate.shared">
                        <span class="text-muted-foreground">Not shared yet</span>
                    </template>
                </label>
            </template>
        </section>
        <section class="flex flex-col gap-1" aria-label="Before you share">
            <p>
                The gateway provider can see the public address and everything
                this share shows.
            </p>
            <p>
                Turning off traffic inspection does not hide the content from
                the provider.
            </p>
            <p>
                This machine and the share service must keep running for the
                link to work.
            </p>
        </section>
        <template v-if="data.savedPreview">
            <p>
                Preview saved; it can be confirmed until
                {{ data.savedPreview.expiresAt }}.
            </p>
        </template>
        <template v-if="data.savedPreview">
            <section class="flex flex-col gap-2" aria-label="Confirm">
                <template v-if="data.liveShare === undefined">
                    <label class="flex items-center gap-2">
                        <span>Share for</span>
                        <Select
                            v-model="minutes"
                            :options="durations.map((duration) => ({ value: duration.minutes, label: duration.label }))"
                        />
                    </label>
                </template>
                <div class="flex flex-wrap gap-2">
                    <template v-if="data.liveShare === undefined">
                        <Button
                            type="button"
                            :disabled="confirm.processing"
                            @click="
                                confirmTo(
                                    `/sharing/${encodeURIComponent(data.rootReference)}/shares`,
                                )
                            "
                            >Share</Button
                        >
                    </template>
                    <template v-else>
                        <UpdateLiveShareButton
                            :live-share="data.liveShare"
                            :processing="confirm.processing"
                            @confirm-to="confirmTo"
                        />
                    </template>
                    <template
                        v-for="proposal in data.openProposals"
                        :key="proposal.id"
                    >
                        <Button
                            type="button"
                            :disabled="confirm.processing"
                            @click="
                                confirmTo(
                                    `/sharing/shares/${proposal.id}/approval`,
                                )
                            "
                            >Approve proposal {{ proposal.number }}</Button
                        >
                    </template>
                </div>
                <FormErrors :errors="confirm.errors" />
            </section>
        </template>
        <form class="flex gap-2" @submit.prevent="save">
            <Button
                type="submit"
                :pending="form.processing"
                :disabled="form.processing"
                >Save preview</Button
            >
            <FormErrors :errors="form.errors" />
        </form>
    </div>
</template>
