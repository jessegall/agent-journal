<script setup lang="ts">
import Textarea from '@/components/kit/Textarea.vue';
import Button from '@/components/kit/Button.vue';
import type {
    ProposalData,
    RequestWindowData,
} from '@generated/types/processes';
import type { RequestPayload } from '@inertiajs/core';
import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

/**
 * The owner's actions on one request: approve one evidence sample, approve the proposal with its proven reader, or
 * reject it with a reason. Approval is offered only while the request awaits it; each action names the revisions read.
 */
const props = defineProps<{
    data: RequestWindowData;
    proposal: ProposalData;
    digest: string;
}>();

const reason = ref('');
const readerRevision = ref('');
const proof = ref('');
const state = computed(() => props.data.request.state);
const isCheck = computed(
    () => props.proposal.revisions[0]?.contract.length > 0,
);
const mayApprove = computed(
    () =>
        props.proposal.state === 'pending' &&
        (state.value === 'awaiting_approval' || !isCheck.value),
);

function post(path: string, body: RequestPayload): void {
    router.post(path, body, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        preserveScroll: true,
    });
}

function approveSample(): void {
    post(`/processes/requests/${props.data.request.id}/sample-approval`, {
        expected_revision: props.proposal.currentRevision,
        command_digest: props.digest,
    });
}

function approve(): void {
    post(`/processes/proposals/${props.proposal.id}/approval`, {
        expected_revision: props.proposal.currentRevision,
        expected_active_revision: props.data.activeRevision,
        reader_revision:
            readerRevision.value === '' ? null : readerRevision.value,
        proof: proof.value === '' ? null : proof.value,
        reason: reason.value,
    });
}

function reject(): void {
    post(`/processes/proposals/${props.proposal.id}/rejection`, {
        reason: reason.value,
    });
}
</script>

<template>
    <form
        class="flex flex-col gap-2"
        aria-label="Review this proposal"
        @submit.prevent="approve"
    >
        <template
            v-if="
                state === 'awaiting_sample_approval' ||
                state === 'awaiting_proof'
            "
        >
            <Button variant="bordered" @click="approveSample">
                Allow one sample run of this exact line
            </Button>
        </template>
        <template v-if="isCheck">
            <label class="flex flex-col">
                <span>Checked reader revision</span>
                <input v-model="readerRevision" type="text" />
            </label>
            <label class="flex flex-col">
                <span>Reader proof</span>
                <input v-model="proof" type="text" />
            </label>
        </template>
        <label class="flex flex-col">
            <span>Reason</span>
            <Textarea v-model="reason" :rows="2" />
        </label>
        <div class="flex gap-2">
            <Button variant="primary" type="submit" :disabled="!mayApprove">
                Approve revision {{ proposal.currentRevision }}
            </Button>
            <Button variant="bordered" @click="reject">Reject</Button>
        </div>
        <template v-if="!mayApprove">
            <p>
                You can approve once the request is ready for review; a check
                first needs a checked reader.
            </p>
        </template>
    </form>
</template>
