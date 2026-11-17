<script setup lang="ts">
import Reader from '@/components/kit/Reader.vue';
import type { PlanReaderData } from '@/types/generated';
import { progressText, stateLook } from './planLooks';

/**
 * The selected plan, or why there is none: nothing chosen, or a choice that cannot be read (no title is shown).
 */
defineProps<{ reader?: PlanReaderData; selectionMissing: boolean }>();
</script>

<template>
    <template v-if="reader">
        <Reader :title="reader.card.title">
            <template #meta>
                <span class="font-mono tabular-nums">{{ reader.card.id }}</span>
                <span :class="stateLook[reader.card.state].tone">{{
                    stateLook[reader.card.state].label
                }}</span>
                <template v-if="reader.card.agent">
                    <span>{{ reader.card.agent.name }}</span>
                </template>
            </template>
            <template #actions
                ><slot name="actions" :reader="reader"
            /></template>
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
