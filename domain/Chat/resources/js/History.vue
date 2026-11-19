<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import type { HistoryPageData } from '@generated/types/chat';
import { cancel as cancelRoute } from '@generated/routes/chat';

/**
 * One inbox's whole history, oldest first within a page. Looking at another inbox is labelled as an inspection;
 * nothing here marks a message read. A waiting message can be cancelled with a reason.
 */
defineProps<{ data: HistoryPageData }>();

const reason = ref('');

function cancel(messageId: string): void {
    if (reason.value.trim() === '') {
        return;
    }

    router.post(cancelRoute().url, { messageId, reason: reason.value }, { preserveScroll: true });
}
</script>

<template>
    <section class="flex flex-col gap-3 p-3" aria-label="History">
        <template v-if="data.page === undefined">
            <p class="m-auto text-empty text-text-3">Choose an inbox to read its history.</p>
        </template>
        <template v-else>
            <template v-if="data.isInspection">
                <p class="text-small text-text-3">
                    Inspection: you do not sit at this inbox, and reading it here marks nothing read.
                </p>
            </template>
            <input
                v-model="reason"
                type="text"
                class="rounded-control border border-border-2 px-2 py-1 text-small"
                placeholder="Reason for cancelling"
                aria-label="Reason for cancelling"
            />
            <template v-for="message in data.page.messages" :key="message.id">
            <article class="flex flex-col gap-0.5 rounded-bubble bg-raised px-3 py-2">
                <span class="text-small text-text-3">
                    {{ message.authorLabel ?? message.sourceInboxLabel }} to {{ message.destinationInboxLabel }}
                </span>
                <p class="text-body whitespace-pre-wrap text-text">{{ message.body }}</p>
                <template v-if="message.state === 'waiting_for_answer'">
                    <button type="button" class="self-start text-small underline" @click="cancel(message.id)">
                        Cancel with the reason above
                    </button>
                </template>
            </article>
            </template>
        </template>
    </section>
</template>
