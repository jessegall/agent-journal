<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import Avatar from '@kit/Avatar';
import Icon from '@kit/Icon';
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
 * reached yet or were given up. Each row is reached by keyboard in order and named by its speaker and addressee; a
 * reply's link names its original and moves the focus there, and a hidden original is only words. After them
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

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
const dayFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

/** The day a message was sent, as the divider above the first message of that day names it. */
function dayLabel(sentAt: Date): string {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    if (sentAt.toDateString() === today.toDateString()) {
        return 'Today';
    }

    return sentAt.toDateString() === yesterday.toDateString() ? 'Yesterday' : dayFormat.format(sentAt);
}

/** A message as the log shows it: its time, and the day divider it starts when it is the first of its day. */
type MessageRow = { message: ChatMessageData; time: string; day: string | null };

/** Each message with its time, and the day divider it starts when it is the first of its day. */
const rows = computed((): MessageRow[] =>
    props.messages.map((message, index): MessageRow => {
        const sentAt = new Date(message.sentAt);
        const previous = index === 0 ? null : new Date(props.messages[index - 1].sentAt);
        const startsDay = previous === null || previous.toDateString() !== sentAt.toDateString();

        return { message, time: timeFormat.format(sentAt), day: startsDay ? dayLabel(sentAt) : null };
    }),
);

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

/**
 * What a screen reader says for a row: who wrote it, with the driver for an agent, and whom it addresses.
 */
function rowLabel(message: ChatMessageData): string {
    const speaker = isOwn(message) ? 'You' : speakerOf(message);
    const addressee = message.addressedTo === null ? '' : ` to ${labelOf(message.addressedTo)}`;

    return `${speaker}${addressee}`;
}

/**
 * What the reply link says: the original's speaker and its first words, when this view holds it.
 */
function originalLabel(message: ChatMessageData): string {
    const original = props.messages.find((shown) => shown.id === message.replyTo?.id);

    return original === undefined
        ? 'Go to the original message'
        : `Go to the original from ${original.speaker.label}: ${original.body.slice(0, 80)}`;
}

/**
 * Follows a reply to its original and gives the original the focus, so the keyboard continues from there.
 */
function goToOriginal(originalId: string | null): void {
    if (originalId === null) {
        return;
    }

    document.getElementById(`message-${originalId}`)?.focus();
}

function stateOf(message: ChatMessageData): string | null {
    if (message.state === 'waiting_for_answer') {
        return isOwn(message) ? 'Waiting for an answer' : 'Waiting for your answer';
    }

    return isOwn(message) || message.readByMe ? null : 'Unread';
}
</script>

<template>
    <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto pt-[22px] pb-[18px]" role="log" aria-live="polite" aria-label="Messages">
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
        <template v-for="{ message, time, day } in rows" :key="message.id">
            <template v-if="day !== null">
                <p class="self-center text-badge text-text-3">{{ day }}</p>
            </template>
            <article
                :id="`message-${message.id}`"
                tabindex="0"
                :aria-label="rowLabel(message)"
                :class="[
                    'group/message relative flex flex-col gap-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus',
                    isOwn(message)
                        ? 'max-w-[78%] self-end rounded-[10px_10px_4px_10px] bg-bubble px-3 py-2'
                        : 'max-w-[92%] self-start',
                ]"
            >
                <template v-if="!isOwn(message)">
                    <span class="mb-0.5 flex items-center gap-[5px] text-badge text-text-3">
                        <Avatar
                            :participant="{
                                kind: message.speaker.driver === null ? 'user' : 'agent',
                                driver: message.speaker.driver ?? undefined,
                                initials: message.speaker.label.slice(0, 1).toUpperCase(),
                            }"
                        />
                        <span class="font-medium text-text-2">{{ message.speaker.label }}</span>
                        <span>· {{ time }}</span>
                        <template v-if="message.addressedTo !== null">
                            <span>→ {{ labelOf(message.addressedTo) }}</span>
                        </template>
                    </span>
                </template>
                <template v-if="message.replyTo !== null && message.replyTo.visible">
                    <a
                        :href="`#message-${message.replyTo.id}`"
                        class="text-small text-text-3 underline"
                        :aria-label="originalLabel(message)"
                        @click.prevent="goToOriginal(message.replyTo.id)"
                    >
                        Replying to an earlier message
                    </a>
                </template>
                <template v-if="message.replyTo !== null && !message.replyTo.visible">
                    <span class="text-small text-text-3">The original was removed or is hidden from you</span>
                </template>
                <p class="text-body whitespace-pre-wrap text-text">{{ message.body }}</p>
                <template v-if="stateOf(message) !== null || message.state === 'waiting_for_answer'">
                    <span class="flex gap-2 text-small text-text-3">
                        <template v-if="stateOf(message) !== null">
                            <span>{{ stateOf(message) }}</span>
                        </template>
                        <template v-if="message.state === 'waiting_for_answer'">
                            <Link :href="questionUrl(message.id)" class="underline" preserve-scroll>
                                Open question
                            </Link>
                        </template>
                    </span>
                </template>
                <template v-if="!isOwn(message)">
                    <span
                        class="absolute -top-3 -right-1 inline-flex gap-1 opacity-0 transition-opacity duration-(--duration-hover) group-focus-within/message:opacity-100 group-hover/message:opacity-100"
                    >
                        <button
                            type="button"
                            class="inline-flex h-6 items-center gap-1 rounded-control border border-border-2 bg-raised px-2 text-badge text-text-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
                            @click="emit('reply', message)"
                        >
                            <Icon name="reply" :size="14" />
                            {{ message.actions.answer ? 'Answer' : 'Reply' }}
                        </button>
                        <template v-if="message.actions.decline">
                            <button
                                type="button"
                                class="inline-flex h-6 items-center rounded-control border border-border-2 bg-raised px-2 text-badge text-text-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
                                @click="emit('decline', message)"
                            >
                                Decline
                            </button>
                        </template>
                    </span>
                </template>
                <template v-if="message.deliveries.some((delivery) => delivery.state !== 'accepted')">
                    <MessageDeliveries :message="message" :conversation-prop="conversationProp" />
                </template>
            </article>
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
