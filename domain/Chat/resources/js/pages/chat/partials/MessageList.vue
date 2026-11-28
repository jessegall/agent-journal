<script setup lang="ts">
import { timeOfDay } from "@kit/format";
import TextLink from "@kit/TextLink";
import QuietLine from "@kit/QuietLine";
import { computed, useTemplateRef } from "vue";
import type { DockCardEnvelope } from "@kit/dockCards";
import { ACTING_AGENT, groupTurns } from "../../../chatTurns";
import { entriesByMessage, reactionsByMessage } from "../../../chatEntries";
import type {
  ChatEntryData,
  MessageEntryData,
  ParticipantData,
} from "@generated/types/chat";
import type {
  ConversationIntent,
  ReplyTarget,
} from "../../../composables/useConversationIntents";
import type { RecoveryEntry } from "../../../composables/useMessageDrafts";
import { useChatScroll } from "../../../composables/useChatScroll";
import MessageRow from "./MessageRow.vue";
import NoMessages from "./NoMessages.vue";
import PendingMessage from "./PendingMessage.vue";
import QuestionCard from "./QuestionCard.vue";
import RefusedSend from "./RefusedSend.vue";

/**
 * The entries of one chat in order: the viewer's own messages on the right, others on the left with their author and
 * driver, reactions on their message, questions as cards and events as lines. After them come the user's sends still
 * settling and the refused ones. Bodies show as text, never HTML.
 */
const props = defineProps<{
  entries: ChatEntryData[];
  // Whether older entries wait before the first one shown.
  hasOlder: boolean;
  pending: ConversationIntent[];
  refused: { entry: RecoveryEntry; reason: string }[];
  // The viewing actor as type:id, the author of the viewer's own entries.
  viewer: string;
  participants: ParticipantData[];
  // The page prop a send or an answer reads again.
  conversationProp: string;
  // The chat the entries are in, which a reaction names.
  inboxId: string;
  // Whom the viewer's own messages go to, and what they wait for while only sent, such as the agent's start.
  addresseeName: string;
  startWait: string | null;
}>();

const emit = defineEmits<{
  reply: [target: ReplyTarget];
  older: [];
  checkAgain: [intent: ConversationIntent];
  restore: [intentKey: string];
  discard: [intentKey: string];
  openRecord: [card: DockCardEnvelope];
  retryDelivery: [messageId: string];
}>();

const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** The day an entry was made, as the divider above the first entry of that day names it. */
function dayLabel(madeAt: Date): string {
  const today = new Date();
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );

  if (madeAt.toDateString() === today.toDateString()) {
    return "Today";
  }

  return madeAt.toDateString() === yesterday.toDateString()
    ? "Yesterday"
    : dayFormat.format(madeAt);
}

/** One row of the log: an entry with its time and the day divider it starts when it is the first of its day. */
type LogRow = {
  entry: ChatEntryData;
  time: string;
  day: string | null;
};

/** Every entry but the reactions, which show on the message they answer, each with its time and the day it starts. */
const rows = computed((): LogRow[] => {
  const shown = props.entries.filter((entry) => entry.type !== "reaction");

  return shown.map((entry, index): LogRow => {
    const at = new Date(entry.createdAt);
    const previous = index === 0 ? null : new Date(shown[index - 1].createdAt);
    const startsDay =
      previous === null || previous.toDateString() !== at.toDateString();

    return { entry, time: timeOfDay(at), day: startsDay ? dayLabel(at) : null };
  });
});

const reactions = computed(() => reactionsByMessage(props.entries, props.viewer));
const messages = computed(() => entriesByMessage(props.entries));

/**
 * The agent whose turn a row belongs to: an agent's own entry names it, an event belongs to whichever agent is
 * acting, and a user's entry is no part of a turn.
 */
function turnOf(row: LogRow): string | null {
  if (row.entry.type === "event") {
    return ACTING_AGENT;
  }

  return row.entry.author?.startsWith("agent:") === true && !isOwn(row.entry) ? row.entry.author : null;
}

/** The rows as the design spaces them: each agent turn close together, with the day that starts above it. */
const turns = computed(() =>
  groupTurns(rows.value, turnOf, (row) => row.day !== null).map((turn) => ({
    key: turn[0].entry.id,
    day: turn[0].day,
    rows: turn,
  })),
);

/** Whether a row joins the one above in one bubble run: the same group, by another than the viewer. */
function continuesRun(turnRows: LogRow[], index: number): boolean {
  const entry = turnRows[index].entry;
  const previous = index === 0 ? null : turnRows[index - 1].entry;

  return (
    previous !== null &&
    previous.type === "message" &&
    !isOwn(entry) &&
    previous.groupNumber === entry.groupNumber
  );
}

const log = useTemplateRef<HTMLElement>("log");

useChatScroll(
  log,
  () => rows.value.map((row) => row.entry.id),
  () => props.pending.length,
);

function isOwn(entry: ChatEntryData): boolean {
  return entry.author === props.viewer;
}

function nameOf(entry: ChatEntryData): string {
  return entry.authorLabel ?? "someone who left";
}

/** The driver of the agent that wrote an entry, as the roster names it; a user has none. */
function driverOf(entry: ChatEntryData): string | null {
  return props.participants.find((member) => member.actor === entry.author)?.driver ?? null;
}

/** What a screen reader says for a message: who wrote it, with the driver for an agent. */
function rowLabel(entry: ChatEntryData): string {
  if (isOwn(entry)) {
    return "You";
  }

  const driver = driverOf(entry);

  return driver === null ? nameOf(entry) : `${nameOf(entry)} · ${driver}`;
}

function replyTo(message: MessageEntryData): void {
  emit("reply", { id: message.id, number: message.number, body: message.body });
}

// Nothing to show yet: no entry, none being sent and none refused.
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
      <TextLink variant="quiet" class="self-center" @click="emit('older')">
        Show earlier messages
      </TextLink>
    </template>
    <template v-for="turn in turns" :key="turn.key">
      <template v-if="turn.day !== null">
        <p class="self-center text-badge text-text-3">{{ turn.day }}</p>
      </template>
      <div class="flex flex-col gap-2" data-turn>
        <template v-for="({ entry, time }, index) in turn.rows" :key="entry.id">
          <template v-if="entry.event !== undefined">
            <QuietLine
              icon="sequence"
              class="self-start"
              :title="time"
              @click="entry.event && emit('openRecord', entry.event)"
            >
              {{ entry.event.accessibleName }}
            </QuietLine>
          </template>
          <template v-else-if="entry.question !== undefined">
            <QuestionCard
              :question="entry.question"
              :asked-by="isOwn(entry) ? 'you' : nameOf(entry)"
              :time="time"
              :conversation-prop="conversationProp"
            />
          </template>
          <template v-else-if="entry.message !== undefined">
            <div
              :class="
                isOwn(entry)
                  ? 'group/own relative flex max-w-[78%] flex-col items-end gap-[3px] self-end'
                  : 'contents'
              "
            >
              <MessageRow
                :message="entry.message"
                :time="time"
                :is-own="isOwn(entry)"
                :continues-run="continuesRun(turn.rows, index)"
                :label="rowLabel(entry)"
                :name="nameOf(entry)"
                :driver="driverOf(entry)"
                :original="
                  entry.message.targetMessageId === null
                    ? undefined
                    : messages.get(entry.message.targetMessageId)
                "
                :reactions="reactions.get(entry.message.id) ?? []"
                :viewer="viewer"
                :inbox-id="inboxId"
                :conversation-prop="conversationProp"
                :addressee-name="addresseeName"
                :start-wait="startWait"
                @reply="entry.message && replyTo(entry.message)"
                @retry="entry.message && emit('retryDelivery', entry.message.id)"
              />
            </div>
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
