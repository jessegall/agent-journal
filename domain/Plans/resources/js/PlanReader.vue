<script setup lang="ts">
import Reader from '@kit/Reader';
import type { PlanReaderData } from '@generated/types/plans';
import { progressText, stateLook } from './planLooks';
import StartPlanForm from './StartPlanForm.vue';

/**
 * The selected plan, or why there is none: nothing chosen, or a choice that cannot be read (no title is shown).
 */
defineProps<{
    reader?: PlanReaderData;
    selectionMissing: boolean;
}>();
</script>

<template>
    <template v-if="reader">
        <Reader :title="reader.card.title">
            <template #meta>
                <span class="tabular-nums">Plan {{ reader.card.number }}</span>
                <span :class="stateLook[reader.card.state].tone">{{
                    stateLook[reader.card.state].label
                }}</span>
                <template v-if="reader.card.holder">
                    <span
                        >Held by {{ reader.card.holder.name }} ({{
                            reader.card.holder.type
                        }}), assignment {{ reader.card.holder.reference }}</span
                    >
                </template>
            </template>
            <template #actions>
                <template v-if="reader.start">
                    <StartPlanForm
                        :key="reader.start.planId"
                        :start="reader.start"
                    />
                </template>
            </template>
            <template v-if="!reader.insideResults">
                <p class="mt-4 text-small text-text-3">
                    This plan is not among the current results; it stays open
                    until you choose another.
                </p>
            </template>
            <template v-if="reader.card.phase === undefined && reader.card.totalTasks === 0">
                <p class="mt-4 text-empty text-text-3">This plan has no phases yet</p>
            </template>
            <template v-else>
                <p class="mt-4 text-small text-text-3 tabular-nums">
                    {{ progressText(reader.card) }}
                </p>
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
