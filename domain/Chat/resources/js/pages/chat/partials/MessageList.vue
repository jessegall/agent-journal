<script setup lang="ts">
import { timeOfDay } from "@kit/format";
import TextLink from '@kit/TextLink';
import { computed, useTemplateRef } from "vue";
import Card from "@kit/Card";
import type { DockCardEnvelope } from "@kit/dockCards";
import { ACTING_AGENT, groupTurns } from "../../../chatTurns";
import LineWords from "./LineWords.vue";
import RecordCard from "./RecordCard.vue";
import type {
  ChatLineData,
  ChatMessageData,
  ParticipantData,
} from "@generated/types/chat";
import type { ConversationIntent } from "../../../composables/useConversationIntents";
import type { RecoveryEntry } from "../../../composables/useMessageDrafts";
import { useChatScroll } from "../../../composables/useChatScroll";
import MessageDeliveries from "./MessageDeliveries.vue";
import MessageRow from "./MessageRow.vue";
import NoMessages from "./NoMessages.vue";
import PendingMessage from "./PendingMessage.vue";
import RefusedSend from "./RefusedSend.vue";

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
  /** The plain lines among the messages, such as a sequence's steps, oldest first. */
  lines: ChatLineData[];
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
  // The chat the messages are in, which a reaction names.
  inboxId: string;
}>();

const emit = defineEmits<{
  reply: [message: ChatMessageData];
  older: [];
  decline: [message: ChatMessageData];
  checkAgain: [intent: ConversationIntent];
  restore: [intentKey: string];
  discard: [intentKey: string];
  openRecord: [card: DockCardEnvelope];
}>();

const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** The day a message was sent, as the divider above the first message of that day names it. */
function dayLabel(sentAt: Date): string {
  const today = new Date();
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );

  if (sentAt.toDateString() === today.toDateString()) {
    return "Today";
  }

  return sentAt.toDateString() === yesterday.toDateString()
    ? "Yesterday"
    : dayFormat.format(sentAt);
}

/**
 * One entry of the log, a message or a plain line at its position, with its time and the day divider it starts when it
 * is the first of its day.
 */
type LogRow = {
  key: string;
  message: ChatMessageData | null;
  line: ChatLineData | null;
  time: string;
  day: string | null;
};

/** The messages and the plain lines in timeline order, each with its time and the day it starts. */
const rows = computed((): LogRow[] => {
  const entries = [
    ...props.messages.map((message) => ({
      sequence: message.sequence,
      at: message.sentAt,
      message,
      line: null,
    })),
    ...props.lines.map((line) => ({
      sequence: line.sequence,
      at: line.postedAt,
      message: null,
      line,
    })),
  ].sort((one, other) => one.sequence - other.sequence);

  return entries.map((entry, index): LogRow => {
    const at = new Date(entry.at);
    const previous = index === 0 ? null : new Date(entries[index - 1].at);
    const startsDay =
      previous === null || previous.toDateString() !== at.toDateString();

    return {
      key: entry.message?.id ?? `line-${entry.sequence}`,
      message: entry.message,
      line: entry.line,
      time: timeOfDay(at),
      day: startsDay ? dayLabel(at) : null,
    };
  });
});

/**
 * The agent whose turn a row belongs to: an agent's own message names it, a plain line or card belongs to whichever
 * agent is acting, and a user's message is no part of a turn.
 */
function turnOf(row: LogRow): string | null {
  if (row.message === null) {
    return ACTING_AGENT;
  }

  return row.message.speaker.driver === null || isOwn(row.message) ? null : row.message.speaker.actor;
}

/** The rows as the design spaces them: each agent turn close together, with the day that starts above it. */
const turns = computed(() =>
  groupTurns(rows.value, turnOf, (row) => row.day !== null).map((turn) => ({
    key: turn[0].key,
    day: turn[0].day,
    rows: turn,
  })),
);

/** How long after a speaker's message their next one still joins it as one run. */
const RUN_GAP_MILLISECONDS = 5 * 60 * 1000;

/**
 * Whether a row joins the one above as a run: the same speaker, not the viewer, nothing between, within five minutes.
 */
function continuesRun(turnRows: LogRow[], index: number): boolean {
  const message = turnRows[index].message;
  const previous = index === 0 ? null : turnRows[index - 1].message;

  if (message === null || previous === null || isOwn(message)) {
    return false;
  }

  return (
    previous.speaker.actor === message.speaker.actor &&
    new Date(message.sentAt).getTime() - new Date(previous.sentAt).getTime() < RUN_GAP_MILLISECONDS
  );
}

const log = useTemplateRef<HTMLElement>("log");

useChatScroll(
  log,
  () => rows.value.map((row) => row.key),
  () => props.pending.length,
);

/** The viewer's latest message, the only one that keeps Delivered in view. */
const latestOwnId = computed(() => props.messages.findLast((message) => isOwn(message))?.id ?? null);

function isOwn(message: ChatMessageData): boolean {
  return message.speaker.actor === props.viewer;
}

function speakerOf(message: ChatMessageData): string {
  return message.speaker.driver === null
    ? message.speaker.label
    : `${message.speaker.label} · ${message.speaker.driver}`;
}

/**
 * The name the roster shows for a member, or the words someone who left for one no longer in the chat.
 */
function labelOf(actor: string): string {
  return (
    props.participants.find((member) => member.actor === actor)?.label ??
    "someone who left"
  );
}

/**
 * What a screen reader says for a row: who wrote it, with the driver for an agent, and whom it addresses.
 */
function rowLabel(message: ChatMessageData): string {
  const speaker = isOwn(message) ? "You" : speakerOf(message);
  const addressee =
    message.addressedTo === null ? "" : ` to ${labelOf(message.addressedTo)}`;

  return `${speaker}${addressee}`;
}


// Nothing to show yet: no message, no plain line, none being sent and none refused.
const isEmpty = computed(
  () =>
    rows.value.length === 0 &&
    props.pending.length === 0 &&
    props.refused.length === 0,
);
</script>

<template>
  <div
    ref="log"
    class="flex flex-1 flex-col gap-6 overflow-y-auto pt-[22px] pb-[18px]"
    role="log"
    aria-live="polite"
    aria-label="Messages"
  >
    <template v-if="isEmpty">
      <NoMessages />
    </template>
    <template v-if="hasOlder">
      <TextLink
        variant="quiet"
        class="self-center"
        @click="emit('older')"
      >
        Show earlier messages
      </TextLink>
    </template>
    <template v-for="turn in turns" :key="turn.key">
      <template v-if="turn.day !== null">
        <p class="self-center text-badge text-text-3">{{ turn.day }}</p>
      </template>
      <div class="flex flex-col gap-2" data-turn>
        <template v-for="({ key, message, line, time }, index) in turn.rows" :key="key">
          <template
            v-if="
              line !== null && line.card !== null && line.cardPlacement === 'inline'
            "
          >
            <Card tone="plain" class="w-full px-3 py-2">
              <RecordCard :card="line.card" />
            </Card>
          </template>
          <template v-else-if="line !== null && line.card !== null">
            <QuietLine
              icon="sequence"
              class="self-start"
              :title="time"
              @click="emit('openRecord', line.card)"
            >
              <b>{{ line.subject }}</b> · {{ line.line }}
            </QuietLine>
          </template>
          <template v-else-if="line !== null">
            <p
              class="flex items-center gap-1.75 self-start text-badge text-text-3"
              :title="time"
            >
              <LineWords :subject="line.subject" :words="line.line" />
            </p>
          </template>
          <template v-if="message !== null && isOwn(message)">
            <div class="group/own relative flex max-w-[78%] flex-col items-end gap-[3px] self-end">
              <MessageRow
                :message="message"
                :time="time"
                :is-own="isOwn(message)"
                :continues-run="continuesRun(turn.rows, index)"
                :label="rowLabel(message)"
                :addressee="message.addressedTo === null ? null : labelOf(message.addressedTo)"
                :viewer="viewer"
                :question-url="questionUrl(message.id)"
                :inbox-id="inboxId"
                :conversation-prop="conversationProp"
                @reply="emit('reply', message)"
                @decline="emit('decline', message)"
              />
              <MessageDeliveries
                :message="message"
                :conversation-prop="conversationProp"
                :is-latest="message.id === latestOwnId"
              />
            </div>
          </template>
          <template v-else-if="message !== null">
            <MessageRow
              :message="message"
              :time="time"
              :is-own="isOwn(message)"
              :continues-run="continuesRun(turn.rows, index)"
              :label="rowLabel(message)"
              :addressee="message.addressedTo === null ? null : labelOf(message.addressedTo)"
              :viewer="viewer"
              :question-url="questionUrl(message.id)"
              :inbox-id="inboxId"
              :conversation-prop="conversationProp"
              @reply="emit('reply', message)"
              @decline="emit('decline', message)"
            />
          </template>
        </template>
      </div>
    </template>
    <template v-for="intent in pending" :key="intent.key">
      <PendingMessage
        :intent="intent"
        @check-again="(shown) => emit('checkAgain', shown)"
      />
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
