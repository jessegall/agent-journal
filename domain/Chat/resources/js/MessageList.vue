<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { MessageView } from '@kit/CoreTypes';
import type { ConversationIntent } from './composables/useConversationIntents';
import type { RecoveryEntry } from './composables/useMessageDrafts';
import PendingMessage from './PendingMessage.vue';
import RefusedSend from './RefusedSend.vue';

/**
 * The messages between two inboxes, oldest first: the user's own on the right, the other inbox's on the left with
 * the name of whoever wrote it, and for each incoming question whether it is unread, waiting or taken up. After them
 * come the user's own sends still settling, and the refused ones to restore or discard. Bodies are shown as text,
 * never as HTML.
 */
const props = defineProps<{
    messages: MessageView[];
    pending: ConversationIntent[];
    refused: { entry: RecoveryEntry; reason: string }[];
    ownInboxId: string;
    // The address that opens one question passively, as a notification opens it.
    questionUrl: (messageId: string) => string;
}>();

const emit = defineEmits<{
    reply: [message: MessageView];
    checkAgain: [intent: ConversationIntent];
    restore: [intentKey: string];
    discard: [intentKey: string];
}>();

function isOwn(message: MessageView): boolean {
    return message.sourceInboxId === props.ownInboxId;
}

function stateOf(message: MessageView): string | null {
    if (isOwn(message)) {
        return message.state === 'waiting_for_answer' ? 'Waiting for an answer' : null;
    }

    if (message.firstReader === undefined) {
        return 'Unread';
    }

    if (message.state !== 'waiting_for_answer') {
        return null;
    }

    return message.claimHolder === undefined ? 'Waiting, nobody took it up' : 'Taken up';
}
</script>

<template>
    <div class="flex flex-1 flex-col gap-2.5 overflow-y-auto pt-4.5 pb-2">
        <template v-if="messages.length === 0 && pending.length === 0 && refused.length === 0">
            <div class="m-auto flex flex-col items-center gap-1 text-center">
                <p class="text-empty text-text-2">No messages yet</p>
                <p class="text-small text-text-3">
                    Send a message below to start a conversation.
                </p>
            </div>
        </template>
        <template v-for="message in messages" :key="message.id">
            <div
                :class="[
                    'flex max-w-[85%] flex-col gap-0.5',
                    isOwn(message) ? 'ml-auto items-end' : 'mr-auto items-start',
                ]"
            >
                <template v-if="!isOwn(message)">
                    <span class="text-small text-text-3">
                        {{ message.authorLabel ?? message.sourceInboxLabel }}
                    </span>
                </template>
                <p
                    class="rounded-bubble bg-raised px-3 py-2 text-body whitespace-pre-wrap text-text"
                >
                    {{ message.body }}
                </p>
                <span class="flex gap-2 text-small text-text-3">
                    <template v-if="stateOf(message) !== null">
                        <span>{{ stateOf(message) }}</span>
                    </template>
                    <template v-if="!isOwn(message) && message.state === 'waiting_for_answer'">
                        <button type="button" class="underline" @click="emit('reply', message)">
                            Reply
                        </button>
                        <Link :href="questionUrl(message.id)" class="underline" preserve-scroll>
                            Open question
                        </Link>
                    </template>
                </span>
            </div>
        </template>
        <template v-for="intent in pending" :key="intent.key">
            <PendingMessage :intent="intent" @check-again="(shown) => emit('checkAgain', shown)" />
        </template>
        <template v-for="item in refused" :key="item.entry.intentKey">
            <RefusedSend
                :entry="item.entry"
                :reason="item.reason"
                @restore="(intentKey) => emit('restore', intentKey)"
                @discard="(intentKey) => emit('discard', intentKey)"
            />
        </template>
    </div>
</template>
