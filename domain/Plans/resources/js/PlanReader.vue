<script setup lang="ts">
import Reader from '@kit/Reader';
import StateBadge from '@kit/StateBadge';
import type { PlanReaderData } from '@generated/types/plans';
import { progressText, stateLook } from './planLooks';
import StartPlanForm from './StartPlanForm.vue';

/**
 * The selected plan, or why there is none: nothing chosen, or a choice that cannot be read (no title is shown).
 */
defineProps<{
    reader?: PlanReaderData;
    selectionMissing: boolean;
    refresh: string[];
}>();
</script>

<template>
    <template v-if="reader">
        <Reader :title="reader.card.title">
            <template #meta>
                <span class="tabular-nums">Plan {{ reader.card.number }}</span>
                <StateBadge v-bind="stateLook[reader.card.state]" outlined />
                <template v-if="reader.card.holder">
                    <span
                        >Held by {{ reader.card.holder.name }} ({{
                            reader.card.holder.type
                        }}), assignment {{ reader.card.holder.reference }}</span
                    >
                </template>
            </template>
            <template #actions>
                <template v-if="reader.card.start">
                    <StartPlanForm
                        :key="reader.card.start.planId"
                        :start="reader.card.start"
                        :refresh="refresh"
                        class="items-end"
                    />
                </template>
            </template>
            <template v-if="!reader.insideResults">
                <p class="mt-4 text-small text-text-3">
                    This plan is not among the current results; it stays open
                    until you choose another.
                </p>
            </template>
            <p class="mt-4 text-small text-text-3 tabular-nums">
                {{ progressText(reader.card) }}
            </p>
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
