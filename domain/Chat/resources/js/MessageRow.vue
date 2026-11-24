<script setup lang="ts">
import { Link } from "@inertiajs/vue3";
import { computed } from "vue";
import Button from "@kit/Button";
import Card from "@kit/Card";
import Icon from "@kit/Icon";
import type { ChatMessageData } from "@generated/types/chat";
import MessageActions from "./MessageActions.vue";
import MessageHead from "./MessageHead.vue";
import MessageReactions from "./MessageReactions.vue";
import ReplyLine from "./ReplyLine.vue";
import { toggleReaction } from "./reactions";

/**
 * One message of a chat: the viewer's own as a bubble on the right, another's on the left, only as wide as its text,
 * under its name line with React and Reply at that line's right end. A question to the viewer is a card with its
 * Answer button; a reply shows who it answers and a line of the original above its text. Under the text come whether it
 * is unread or waits for an answer, its reactions, and the recipients it has not reached.
 */
const props = defineProps<{
  message: ChatMessageData;
  time: string;
  isOwn: boolean;
  // The same speaker again, with nothing between and within five minutes: no name line, joined to the bubble above.
  continuesRun: boolean;
  // What a screen reader says for the row: who wrote it and whom it addresses.
  label: string;
  addressee: string | null;
  // The viewing actor as type:id.
  viewer: string;
  // The address that opens the question passively, as a notification opens it.
  questionUrl: string;
  inboxId: string;
  conversationProp: string;
}>();

const emit = defineEmits<{ reply: []; decline: [] }>();

const original = computed(() => props.message.replyTo);
const actions = computed(() => props.message.actions);

/** A question someone asked you that waits for your answer: drawn as a card with its Answer button. */
const isQuestionToMe = computed(
  () => !props.isOwn && props.message.state === "waiting_for_answer" && actions.value.answer,
);

const state = computed(() => {
  if (props.message.state === "waiting_for_answer") {
    return props.isOwn ? "Waiting for an answer" : "Waiting for your answer";
  }

  return props.isOwn || props.message.readByMe ? null : "Unread";
});

</script>

<template>
  <article
    :id="`message-${message.id}`"
    tabindex="0"
    :aria-label="label"
    :class="[
      'group/message relative flex flex-col gap-0.5 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus',
      isOwn
        ? 'max-w-full self-end rounded-[10px_10px_4px_10px] bg-bubble'
        : 'w-fit max-w-[92%] self-start rounded-[10px_10px_10px_4px] bg-bubble-agent',
      continuesRun && !isOwn ? '-mt-1.5 rounded-tl-[4px]' : '',
    ]"
  >
    <template v-if="isOwn || continuesRun">
      <span
        data-message-actions
        class="absolute -top-[22px] right-0 flex h-[18px] items-center gap-0.5 text-badge text-text-3 opacity-0 transition-opacity duration-(--duration-hover) group-focus-within/message:opacity-100 group-hover/message:opacity-100"
      >
        <template v-if="continuesRun && !isOwn">
          <span class="pr-1">{{ time }}</span>
        </template>
        <MessageActions
          :speaker="message.speaker"
          :actions="actions"
          @react="(emoji) => toggleReaction(inboxId, message.id, emoji, conversationProp)"
          @reply="emit('reply')"
          @decline="emit('decline')"
        />
      </span>
    </template>
    <template v-if="!isOwn && !continuesRun">
      <MessageHead
        :speaker="message.speaker"
        :time="time"
        :addressee="addressee"
      >
        <template v-if="!isQuestionToMe" #actions>
          <MessageActions
            :speaker="message.speaker"
            :actions="actions"
            @react="(emoji) => toggleReaction(inboxId, message.id, emoji, conversationProp)"
            @reply="emit('reply')"
            @decline="emit('decline')"
          />
        </template>
      </MessageHead>
    </template>
    <template v-if="original !== undefined">
      <ReplyLine :target="original" :viewer="viewer" />
    </template>
    <template v-if="isQuestionToMe">
      <Card padding="sm" class="flex items-center gap-2.5">
        <Icon name="question" :size="16" class="flex-none text-text-3" />
        <span class="min-w-0 flex-1">
          <span class="block text-body whitespace-pre-wrap text-text">{{
            message.body
          }}</span>
          <small class="block text-badge text-text-3"
            >Question · asked {{ time }}</small
          >
        </span>
        <Button
          size="small"
          variant="bordered"
          @click="emit('reply')"
          >Answer</Button
        >
        <template v-if="actions.decline">
          <Button
            size="small"
            variant="ghost"
            @click="emit('decline')"
            >Decline</Button
          >
        </template>
      </Card>
    </template>
    <template v-else>
      <p class="text-body whitespace-pre-wrap text-text">
        {{ message.body }}
      </p>
    </template>
    <template
      v-if="state !== null || message.state === 'waiting_for_answer'"
    >
      <span class="flex gap-2 text-small text-text-3">
        <template v-if="state !== null">
          <span>{{ state }}</span>
        </template>
        <template v-if="message.state === 'waiting_for_answer'">
          <Link
            :href="questionUrl"
            class="underline"
            preserve-scroll
          >
            Open question
          </Link>
        </template>
      </span>
    </template>
    <MessageReactions
      :message="message"
      :inbox-id="inboxId"
      :conversation-prop="conversationProp"
    />
  </article>
</template>
