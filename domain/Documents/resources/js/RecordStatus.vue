<script setup lang="ts">
import type { RecordPageData } from '@generated/types/documents';
import SettleForm from './SettleForm.vue';

/**
 * Two separate labels, Editing and Attention, never one word for both; the settlement history, and the Settle form
 * while the record is active.
 */
defineProps<{ data: RecordPageData; editing: string; settleAction: string }>();
</script>

<template>
    <section class="flex flex-col gap-2">
        <p class="flex gap-4 text-small">
            <span>Editing: {{ editing }}</span>
            <span>Attention: {{ data.attention }}</span>
        </p>
        <template v-for="settlement in data.settlements" :key="settlement.settledAt">
            <p class="text-small text-text-3">Settled {{ settlement.settledAt }} by {{ settlement.actorType }} {{ settlement.actorId }}: {{ settlement.reason }}</p>
        </template>
        <template v-if="data.attention === 'active'">
            <SettleForm :action="settleAction" :revision="data.revision ?? '1'" />
        </template>
    </section>
</template>
