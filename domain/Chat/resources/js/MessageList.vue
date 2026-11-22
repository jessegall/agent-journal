<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { ChatMessageData, ParticipantData } from '@generated/types/chat';
import type { ConversationIntent } from './composables/useConversationIntents';
import type { RecoveryEntry } from './composables/useMessageDrafts';
import MessageDeliveries from './MessageDeliveries.vue';
import PendingMessage from './PendingMessage.vue';
import RefusedSend from './RefusedSend.vue';

/**
 * The rows of one chat in timeline order: the viewer's own on the right, everyone else's on the left with the name of
 * whoever wrote it and, for an agent, the driver it runs through; for each incoming row whether the viewer has not
 * read it yet, for a question whether it still waits, and for the author or an operator which recipients were not
 * reached yet or were given up. After them
 * come the user's own sends still settling, and the refused ones to restore or discard. Bodies are shown as text,
 * never as HTML.
 */
const props = defineProps<{
    messages: ChatMessageData[];
    // Whether older rows wait before the first one shown.
    hasOlder: boolean;
    pending: ConversationIntent[];
    refused: { entry: RecoveryEntry; reason: string }[];
    // The viewing actor as type:id, the speaker of the viewer's own rows.
    viewer: string;
    participants: ParticipantData[];
    // The address that opens one question passively, as a notification opens it.
    questionUrl: (messageId: string) => string;
    // The page prop a retry reads again.
    conversationProp: string;
}>();

const emit = defineEmits<{
    reply: [message: ChatMessageData];
    older: [];
    decline: [message: ChatMessageData];
    checkAgain: [intent: ConversationIntent];
    restore: [intentKey: string];
    discard: [intentKey: string];
}>();

function isOwn(message: ChatMessageData): boolean {
    return message.speaker.actor === props.viewer;
}

function speakerOf(message: ChatMessageData): string {
    return message.speaker.driver === null ? message.speaker.label : `${message.speaker.label} · ${message.speaker.driver}`;
}

/**
 * The name the roster shows for a member, or the words someone who left for one no longer in the chat.
 */
function labelOf(actor: string): string {
    return props.participants.find((member) => member.actor === actor)?.label ?? 'someone who left';
}

function stateOf(message: ChatMessageData): string | null {
    if (message.state === 'waiting_for_answer') {
        return isOwn(message) ? 'Waiting for an answer' : 'Waiting for your answer';
    }

    return isOwn(message) || message.readByMe ? null : 'Unread';
}
</script>

<template>
    <div class="flex flex-1 flex-col gap-2.5 overflow-y-auto pt-4.5 pb-2">
        <template v-if="messages.length === 0 && pending.length === 0 && refused.length === 0">
            <div class="m-auto flex flex-col items-center gap-1 text-center">
                <p class="text-empty text-text-2">No messages yet</p>
                <p class="text-small text-text-3">
                    Send a message below to start a conversation, or start a session from the bar.
                </p>
            </div>
        </template>
        <template v-if="hasOlder">
            <button type="button" class="self-center text-small text-text-3 underline" @click="emit('older')">
                Show earlier messages
            </button>
        </template>
        <template v-for="message in messages" :key="message.id">
            <div
                :id="`message-${message.id}`"
                :class="[
                    'flex max-w-[85%] flex-col gap-0.5',
                    isOwn(message) ? 'ml-auto items-end' : 'mr-auto items-start',
                ]"
            >
                <span class="text-small text-text-3">
                    <template v-if="!isOwn(message)">{{ speakerOf(message) }}</template>
                    <template v-if="message.addressedTo !== null"> → {{ labelOf(message.addressedTo) }}</template>
                </span>
                <template v-if="message.replyTo !== null && message.replyTo.visible">
                    <a :href="`#message-${message.replyTo.id}`" class="text-small text-text-3 underline">
                        Replying to an earlier message
                    </a>
                </template>
                <template v-if="message.replyTo !== null && !message.replyTo.visible">
                    <span class="text-small text-text-3">Original unavailable</span>
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
                    <template v-if="!isOwn(message)">
                        <button type="button" class="underline" @click="emit('reply', message)">
                            {{ message.actions.answer ? 'Answer' : 'Reply' }}
                        </button>
                    </template>
                    <template v-if="message.actions.decline">
                        <button type="button" class="underline" @click="emit('decline', message)">Decline</button>
                    </template>
                    <template v-if="message.state === 'waiting_for_answer'">
                        <Link :href="questionUrl(message.id)" class="underline" preserve-scroll>
                            Open question
                        </Link>
                    </template>
                </span>
                <template v-if="message.deliveries.some((delivery) => delivery.state !== 'accepted')">
                    <MessageDeliveries :message="message" :conversation-prop="conversationProp" />
                </template>
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
