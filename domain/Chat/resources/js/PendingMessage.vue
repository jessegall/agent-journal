<script setup lang="ts">
import type { ConversationIntent } from './composables/useConversationIntents';
import { UNKNOWN_OUTCOME_TEXT } from './composables/useConversationIntents';
import Button from '@kit/Button';
import Spinner from '@kit/Spinner';
import { history as historyPage } from '@generated/routes/chat';

/**
 * One of the user's own sends still settling: Sending while its request is out, Checking while the conversation is
 * read again after an answer that never came, and, when that read did not show it, that it could not be confirmed,
 * with Check again and a link to History. It has no message id yet, so it offers no reply, docking or reading.
 */
defineProps<{ intent: ConversationIntent }>();

const emit = defineEmits<{ checkAgain: [intent: ConversationIntent] }>();

const statusLabels: Record<ConversationIntent['status'], string> = {
    sending: 'Sending…',
    confirmed: 'Sent',
    uncertain: 'Checking whether it was sent…',
    unknown: UNKNOWN_OUTCOME_TEXT,
};
</script>

<template>
    <div class="ml-auto flex max-w-[85%] flex-col items-end gap-0.5">
        <p class="rounded-bubble bg-raised px-3 py-2 text-body whitespace-pre-wrap text-text opacity-70">
            {{ intent.text }}
        </p>
        <span class="flex gap-2 text-small text-text-3">
            <span class="inline-flex items-center gap-1.5">
                <template v-if="intent.status === 'sending' || intent.status === 'uncertain'">
                    <Spinner />
                </template>
                {{ statusLabels[intent.status] }}
            </span>
            <template v-if="intent.status === 'unknown'">
                <Button size="small" variant="ghost" @click="emit('checkAgain', intent)">Check again</Button>
                <a class="underline" :href="historyPage().url">Open History</a>
            </template>
        </span>
    </div>
</template>
