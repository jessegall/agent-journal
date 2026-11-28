<script setup lang="ts">
import { computed } from "vue";
import type { ChatEntryData, MessageEntryData } from "@generated/types/chat";
import type { ReactionCount } from "../../../chatEntries";
import { sendReaction } from "../../../reactions";
import MessageActions from "./MessageActions.vue";
import MessageHead from "./MessageHead.vue";
import MessageReactions from "./MessageReactions.vue";
import ReplyLine from "./ReplyLine.vue";
import DeliveryLine from "./DeliveryLine.vue";

/**
 * One message of a chat as a bubble, the viewer's own on the right and others' on the left, with React, Reply, the message
 * it answers, its reactions and, under the viewer's own, how far it got to the agent.
 */
const props = defineProps<{
  message: MessageEntryData;
  time: string;
  isOwn: boolean;
  // The same author again in the same group: no name line, joined to the bubble above.
  continuesRun: boolean;
  // What a screen reader says for the row: who wrote it.
  label: string;
  name: string;
  driver: string | null;
  // The entry of the message this one answers, when its page is loaded.
  original: ChatEntryData | undefined;
  reactions: ReactionCount[];
  // The viewing actor as type:id.
  viewer: string;
  inboxId: string;
  conversationProp: string;
  // Whom the viewer's own messages go to, and what they wait for while only sent.
  addresseeName: string;
  startWait: string | null;
}>();

const emit = defineEmits<{ reply: []; retry: [] }>();

const isUnread = computed(() => !props.isOwn && !props.message.isReadByViewer);

function react(emoji: string): void {
  sendReaction(props.inboxId, props.message.id, emoji, props.conversationProp);
}
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
        <MessageActions :author-label="name" @react="react" @reply="emit('reply')" />
      </span>
    </template>
    <template v-if="!isOwn && !continuesRun">
      <MessageHead :name="name" :driver="driver" :time="time">
        <template #actions>
          <MessageActions :author-label="name" @react="react" @reply="emit('reply')" />
        </template>
      </MessageHead>
    </template>
    <template v-if="message.targetMessageId !== null && message.targetNumber !== null">
      <ReplyLine
        :target-id="message.targetMessageId"
        :target-number="message.targetNumber"
        :original="original"
        :viewer="viewer"
      />
    </template>
    <p class="text-body whitespace-pre-wrap text-text">
      {{ message.body }}
    </p>
    <template v-if="isUnread">
      <span class="text-small text-text-3">Unread</span>
    </template>
    <MessageReactions
      :reactions="reactions"
      :message-id="message.id"
      :inbox-id="inboxId"
      :conversation-prop="conversationProp"
    />
  </article>
  <template v-if="isOwn">
    <DeliveryLine
      :message="message"
      :addressee-name="addresseeName"
      :start-wait="startWait"
      @retry="emit('retry')"
    />
  </template>
</template>
