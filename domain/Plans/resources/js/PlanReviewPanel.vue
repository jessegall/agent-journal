<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import { approveReview, requestChanges, requestReview, withdrawReview } from '@generated/routes/plans';
import type { PlanReviewData } from '@generated/types/plans';
import { useHostProp } from '@/framework/hostProp';

/**
 * A plan's review in its reader: Request review or Withdraw review when offered; while it is reviewed, the frozen
 * snapshot of the edition and, for a decider, Approve or Request changes with a required reason; the latest approval
 * as a receipt, or as historical once the plan changed; a request for changes with its note; and what changed against
 * the edition before. One post at a time under its request key, reloading only the window's prop; a lost answer shows
 * Outcome unknown and Check plan, which sends the same request under the same key again only when chosen.
 */
const props = defineProps<{ review: PlanReviewData; number: string }>();

const pane = useHostProp();
const reasonField = useTemplateRef<HTMLTextAreaElement>('reasonField');
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

async function askForChanges(): Promise<void> {
    if (reason.value.trim() === '') {
        refusal.value = 'Say what has to change.';
        await nextTick();
        reasonField.value?.focus();

        return;
    }

    post(requestChanges.url({ plan: props.number }), {
        edition: String(props.review.edition?.number ?? 0),
        reason: reason.value,
    });
}

function decidedText(decidedById: string, decidedByType: string, decidedAt: string): string {
    return `${decidedByType} ${decidedById} on ${new Date(decidedAt).toLocaleString()}`;
}
</script>

<template>
    <section class="mt-4 flex flex-col gap-2" aria-label="Review">
        <template v-if="review.receipt">
            <p class="text-small text-text-2">
                <template v-if="review.receipt.isHistorical">
                    Historical approval: the plan changed since edition {{ review.receipt.editionNumber }} was
                    approved.
                </template>
                <template v-else>
                    Approved by
                    {{ decidedText(review.receipt.decidedById, review.receipt.decidedByType, review.receipt.decidedAt) }}
                    (edition {{ review.receipt.editionNumber }})
                </template>
            </p>
        </template>
        <template v-if="review.changesRequested">
            <p class="rounded-control border border-border-2 px-3 py-2 text-small text-text">
                Changes requested on edition {{ review.changesRequested.editionNumber }}:
                <span class="whitespace-pre-wrap" v-text="review.changesRequested.reason" />
            </p>
        </template>
        <template v-if="review.changes">
            <p class="text-small text-text-3">
                Against edition {{ review.changes.olderEdition }}:
                {{ review.changes.added.length }} tasks added, {{ review.changes.removed.length }} removed,
                {{ review.changes.changed.length }} changed{{ review.changes.isPlanTextChanged ? ', and the plan text changed' : '' }}{{ review.changes.isWhole ? '' : ' (first 1,000 tasks compared)' }}.
            </p>
        </template>
        <template v-if="review.edition">
            <div class="flex flex-col gap-2 rounded-control border border-border px-3 py-2">
                <p class="text-small font-medium text-text-2">
                    Edition {{ review.edition.number }} under review
                </p>
                <template v-for="phase in review.edition.phases" :key="phase.position">
                    <div class="flex flex-col gap-1">
                        <p class="text-small font-medium text-text-2">Phase {{ phase.number }} · {{ phase.title }}</p>
                        <ul class="flex flex-col gap-1 pl-3">
                            <template v-for="member in phase.members" :key="member.taskNumber">
                                <li class="text-small text-text-2">
                                    <span class="tabular-nums">Task {{ member.taskNumber }}</span> · {{ member.title }}
                                    <span class="block whitespace-pre-wrap text-text-3 [overflow-wrap:anywhere]" v-text="member.isBriefCut ? `${member.brief}…` : member.brief" />
                                </li>
                            </template>
                        </ul>
                        <template v-if="phase.hasMoreMembers">
                            <p class="pl-3 text-small text-text-4">More tasks are in this phase.</p>
                        </template>
                    </div>
                </template>
                <template v-if="review.edition.hasMorePhases">
                    <p class="text-small text-text-4">More phases are in this edition.</p>
                </template>
            </div>
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
        <div class="flex flex-wrap gap-2">
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
            <template v-if="review.mayDecide && review.edition">
                <Button
                    size="small"
                    variant="primary"
                    :pending="pending"
                    @click="post(approveReview.url({ plan: number }), { edition: String(review.edition.number) })"
                    >Approve</Button
                >
            </template>
        </div>
        <template v-if="review.mayDecide && review.edition">
            <label class="flex flex-col gap-1 text-small text-text-2">
                <span>What has to change</span>
                <textarea
                    ref="reasonField"
                    v-model="reason"
                    rows="2"
                    class="rounded-control border border-border-2 bg-bg-2 px-2.5 py-1.5 text-body text-text"
                />
            </label>
            <div>
                <Button size="small" :pending="pending" @click="askForChanges">Request changes</Button>
            </div>
        </template>
    </section>
</template>
