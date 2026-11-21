<script setup lang="ts">
import type { MessageView } from '@kit/CoreTypes';

/**
 * The messages between two inboxes, oldest first: the user's own on the right, the other inbox's on the left with
 * the name of whoever wrote it, and for each incoming question whether it is unread, waiting or taken up. Bodies are
 * shown as text, never as HTML.
 */
const props = defineProps<{
    messages: MessageView[];
    ownInboxId: string;
}>();

const emit = defineEmits<{ reply: [message: MessageView] }>();

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
        <template v-if="messages.length === 0">
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
                    </template>
                </span>
            </div>
        </template>
    </div>
</template>
