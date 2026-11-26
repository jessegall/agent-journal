<script setup lang="ts">
import { computed } from 'vue';
import CountedProgress from '@kit/CountedProgress';
import Icon from '@kit/Icon';
import Reader from '@kit/Reader';
import StateBadge from '@kit/StateBadge';
import type { PlanReaderData } from '@generated/types/plans';
import {
    currentPhaseRule,
    planHeading,
    planName,
    progressText,
    stateLook,
    typeIcon,
} from '../../../planLooks';
import PhaseOutline from './PhaseOutline.vue';
import PlanReviewPanel from './PlanReviewPanel.vue';
import StartPlanForm from '../../../components/plans/StartPlanForm.vue';

/**
 * The selected plan, or why there is none: nothing chosen, or a choice that cannot be read (no title is shown). The
 * plan's number, type and title come first, its state and holder below, then its whole brief as plain paragraphs and
 * its progress and its phases, or No phases yet. Start, when offered, is the visible primary action.
 */
const props = defineProps<{
    reader?: PlanReaderData;
    selectionMissing: boolean;
}>();
const card = computed(() => props.reader?.card);
const holder = computed(() => card.value?.holder);

const paragraphs = computed(() =>
    (props.reader?.brief ?? '')
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph !== ''),
);
</script>

<template>
    <template v-if="reader !== undefined && card !== undefined">
        <Reader :title="card.title">
            <template #meta>
                <Icon :name="typeIcon[card.type]" :size="12" />
                <span class="tabular-nums">{{ planHeading(reader.card) }}</span>
            </template>
            <template #actions>
                <template v-if="card.start">
                    <StartPlanForm
                        :key="card.start.planId"
                        :start="card.start"
                        class="items-end"
                    />
                </template>
            </template>
            <div
                class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-text-3"
            >
                <StateBadge v-bind="stateLook[card.status]" outlined />
                <template v-if="holder">
                    <span class="[overflow-wrap:anywhere]"
                        >Held by {{ holder.name }} ({{ holder.type }}), assignment
                        {{ holder.reference }}</span
                    >
                </template>
            </div>
            <template v-if="!reader.isInsideResults">
                <p class="mt-4 text-small text-text-3">
                    This plan is not among the current results; it stays open
                    until you choose another.
                </p>
            </template>
            <section class="mt-4 flex flex-col gap-2" aria-label="Brief">
                <template v-if="paragraphs.length === 0">
                    <p class="text-body text-text-3">No brief yet</p>
                </template>
                <template v-for="(paragraph, index) in paragraphs" :key="index">
                    <p
                        class="text-body whitespace-pre-wrap text-text-2 [overflow-wrap:anywhere]"
                        v-text="paragraph"
                    />
                </template>
            </section>
            <template v-if="reader.review">
                <PlanReviewPanel
                    :review="reader.review"
                    :number="card.number"
                    :state="card.status"
                    :holder="holder"
                />
            </template>
            <template v-if="card.phase === undefined">
                <p class="mt-4 text-small text-text-3">No phases yet</p>
            </template>
            <template v-else>
                <div class="mt-4 flex flex-col gap-2">
                    <CountedProgress
                        :owner="planName(reader.card)"
                        :finished="card.finishedTasks"
                        :total="card.totalTasks"
                        :text="progressText(reader.card)"
                    />
                    <p class="text-small text-text-3 tabular-nums">
                        <span class="font-medium text-text-2">Current phase</span>
                        {{ card.phase }}
                        <span class="block text-text-4">{{ currentPhaseRule }}</span>
                    </p>
                    <template v-if="card.isReadyToFinish">
                        <p class="text-small font-medium text-text-2">
                            Ready to finish
                        </p>
                    </template>
                </div>
                <PhaseOutline :outline="reader.outline" />
            </template>
        </Reader>
    </template>
    <template v-else-if="selectionMissing">
        <p class="p-6 text-empty text-text-3">
            This plan cannot be shown. It may not exist, or you may not have
            access.
        </p>
    </template>
    <template v-else>
        <p class="p-6 text-empty text-text-3">Choose a plan to read it.</p>
    </template>
</template>
