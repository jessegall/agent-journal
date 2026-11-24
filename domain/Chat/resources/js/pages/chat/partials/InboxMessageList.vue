<script setup lang="ts">
import TextLink from "@kit/TextLink";
import { Link } from "@inertiajs/vue3";
import { computed } from "vue";
import type { MessageView } from "@kit/CoreTypes";
import type { ConversationIntent } from "../../../composables/useConversationIntents";
import type { RecoveryEntry } from "../../../composables/useMessageDrafts";
import NoMessages from "./NoMessages.vue";
import PendingMessage from "./PendingMessage.vue";
import RefusedSend from "./RefusedSend.vue";

/**
 * The messages of one desk inbox, oldest first, as the Inbox page shows them: the user's own on the right, the other inbox's on the left with
 * the name of whoever wrote it, and for each incoming question whether it is unread, waiting or claimed. After them
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
    return message.state === "waiting_for_answer"
      ? "Waiting for an answer"
      : null;
  }

  if (message.firstReader === undefined) {
    return "Unread";
  }

  if (message.state !== "waiting_for_answer") {
    return null;
  }

  return message.claimHolder === undefined
    ? "Waiting, nobody took it up"
    : "Taken up";
}

// Nothing to show yet: no message, none being sent and none refused.
const isEmpty = computed(
  () =>
    props.messages.length === 0 &&
    props.pending.length === 0 &&
    props.refused.length === 0,
);
</script>

<template>
  <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto pt-[22px] pb-[18px]">
    <template v-if="isEmpty">
      <NoMessages />
    </template>
    <template v-for="message in messages" :key="message.id">
      <div
        :class="[
          'flex flex-col gap-0.5',
          isOwn(message)
            ? 'max-w-[78%] self-end rounded-[10px_10px_4px_10px] bg-bubble px-3 py-2'
            : 'max-w-[92%] self-start',
        ]"
      >
        <template v-if="!isOwn(message)">
          <span class="mb-0.5 text-badge font-medium text-text-2">
            {{ message.authorLabel ?? message.sourceInboxLabel }}
          </span>
        </template>
        <p class="text-body whitespace-pre-wrap text-text">
          {{ message.body }}
        </p>
        <span class="flex gap-2 text-small text-text-3">
          <template v-if="stateOf(message) !== null">
            <span>{{ stateOf(message) }}</span>
          </template>
          <template
            v-if="!isOwn(message) && message.state === 'waiting_for_answer'"
          >
            <TextLink @click="emit('reply', message)"> Reply </TextLink>
            <Link
              :href="questionUrl(message.id)"
              class="underline"
              preserve-scroll
            >
              Open question
            </Link>
          </template>
        </span>
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
