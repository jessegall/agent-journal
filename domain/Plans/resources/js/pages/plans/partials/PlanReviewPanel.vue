<script setup lang="ts">
import Textarea from '@kit/Textarea';
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import { approveReview, requestChanges, requestReview, withdrawReview } from '@generated/routes/plans';
import type { PlanReviewData, PlanStatus } from '@generated/types/plans';
import PlanEndDialog from './PlanEndDialog.vue';
import PlanWorkDialog from './PlanWorkDialog.vue';
import { useHostProp } from '@kit/hostProp';

/**
 * A plan's review in its reader: Request or Withdraw review, which review is open, Approve or Request changes with a
 * reason for a decider, the latest approval as a receipt and a request's note. One post at a time under its request
 * key; a lost answer shows Outcome unknown and Check plan.
 */
const props = defineProps<{
    review: PlanReviewData;
    number: string;
    state: PlanStatus;
    holder: { type: string; id: string; name: string; reference: string } | undefined;
}>();

const receipt = computed(() => props.review.receipt);
const changesRequested = computed(() => props.review.changesRequested);

const isAssigning = ref(false);

const ending = ref<'cancel' | 'finish' | null>(null);
const notice = ref('');

const pane = useHostProp();
const reasonField = useTemplateRef<InstanceType<typeof Textarea>>('reasonField');
const reason = ref('');
const refusal = ref('');
const pending = ref(false);
const lost = ref<{ url: string; data: Record<string, string>; key: string } | null>(null);

function post(url: string, data: Record<string, string>, key: string = crypto.randomUUID()): void {
    if (pending.value) {
        return;
    }

    pending.value = true;
    refusal.value = '';
    keyedPost(
        url,
        data,
        key,
        {
            onAccepted: () => {
                lost.value = null;
                reason.value = '';
            },
            onRefused: (message) => {
                lost.value = null;
                refusal.value = message ?? 'This was refused.';
            },
            onUncertain: () => {
                lost.value = { url, data, key };
            },
            onFinish: () => {
                pending.value = false;
            },
        },
        [pane],
    );
}

async function askForChanges(reviewNumber: number): Promise<void> {
    if (reason.value.trim() === '') {
        refusal.value = 'Say what has to change.';
        await nextTick();
        reasonField.value?.focus();

        return;
    }

    post(requestChanges.url({ plan: props.number }), {
        edition: String(reviewNumber),
        reason: reason.value,
    });
}

function decidedText(decidedById: string, decidedByType: string, decidedAt: string): string {
    return `${decidedByType} ${decidedById} on ${new Date(decidedAt).toLocaleString()}`;
}
</script>

<template>
    <section class="mt-4 flex flex-col gap-2" aria-label="Review">
        <template v-if="receipt">
            <p class="text-small text-text-2">
                <template v-if="receipt.isHistorical">
                    Historical approval: the plan changed after review {{ receipt.editionNumber }} approved it.
                </template>
                <template v-else>
                    Approved by
                    {{ decidedText(receipt.decidedById, receipt.decidedByType, receipt.decidedAt) }}
                    (review {{ receipt.editionNumber }})
                </template>
            </p>
        </template>
        <template v-if="changesRequested">
            <p class="rounded-control border border-border-2 px-3 py-2 text-small text-text">
                Changes requested in review {{ changesRequested.editionNumber }}:
                <span class="whitespace-pre-wrap" v-text="changesRequested.reason" />
            </p>
        </template>
        <template v-if="review.reviewNumber">
            <p class="text-small font-medium text-text-2">
                Review {{ review.reviewNumber }} is open. The plan can't change until it is decided or withdrawn.
            </p>
        </template>
        <template v-if="refusal !== ''">
            <p role="alert" class="text-small text-danger">{{ refusal }}</p>
        </template>
        <template v-if="lost">
            <p role="status" class="flex items-center gap-2 text-small text-text-2">
                <span>Outcome unknown: the review may or may not have changed.</span>
                <Button size="small" variant="bordered" @click="post(lost.url, lost.data, lost.key)">Check plan</Button>
            </p>
        </template>
        <template v-if="notice !== ''">
            <p role="alert" class="text-small text-text-2">{{ notice }}</p>
        </template>
        <div class="flex flex-wrap gap-2">
            <template v-if="review.work.mayAssign">
                <Button size="small" variant="bordered" @click="isAssigning = true">{{
                    holder === undefined ? 'Assign' : 'Reassign'
                }}</Button>
            </template>
            <template v-if="review.mayFinish">
                <Button size="small" variant="primary" @click="ending = 'finish'">Finish plan</Button>
            </template>
            <template v-if="review.mayCancel">
                <Button size="small" variant="danger" @click="ending = 'cancel'">Cancel plan</Button>
            </template>
            <template v-if="review.mayRequest">
                <Button size="small" variant="bordered" :pending="pending" @click="post(requestReview.url({ plan: number }), {})"
                    >Request review</Button
                >
            </template>
            <template v-if="review.mayWithdraw">
                <Button size="small" :pending="pending" @click="post(withdrawReview.url({ plan: number }), {})"
                    >Withdraw review</Button
                >
            </template>
            <template v-if="review.mayDecide && review.reviewNumber">
                <Button
                    size="small"
                    variant="primary"
                    :pending="pending"
                    @click="post(approveReview.url({ plan: number }), { edition: String(review.reviewNumber) })"
                    >Approve</Button
                >
            </template>
        </div>
        <template v-if="review.mayDecide && review.reviewNumber">
            <label class="flex flex-col gap-1 text-small text-text-2">
                <span>What has to change</span>
                <Textarea ref="reasonField" v-model="reason" :rows="2" />
            </label>
            <div>
                <Button size="small" :pending="pending" @click="askForChanges(review.reviewNumber)">Request changes</Button>
            </div>
        </template>
        <template v-if="isAssigning">
            <PlanWorkDialog :number="number" :work="review.work" :holder="holder" @close="isAssigning = false" />
        </template>
        <template v-if="ending !== null">
            <PlanEndDialog
                :change="ending"
                :number="number"
                :revision="review.revision"
                :state="state"
                @close="ending = null"
                @refused="(message) => { notice = message; ending = null; }"
            />
        </template>
    </section>
</template>
