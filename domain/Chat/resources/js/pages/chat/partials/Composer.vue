<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Button from "@kit/Button";
import { onPurge } from "@kit/protectedView";
import Icon from "@kit/Icon";
import Textarea from "@kit/Textarea";
import IconButton from "@kit/IconButton";
import Menu from "@kit/Menu";
import MenuItem from "@kit/MenuItem";
import { useComposerHeight } from "../../../composables/useComposerHeight";
import {
  useConversationIntents,
  type ReplyTarget,
} from "../../../composables/useConversationIntents";
import { useMessageDrafts } from "../../../composables/useMessageDrafts";
import { useTurnInterrupt } from "../../../composables/useTurnInterrupt";
import type { AgentOptionData } from "@generated/types/chat";

/**
 * Posts in the chat with the chosen agent, at the chat's own inbox. The text is the draft of this chat,
 * so browsing other chats, a switch or a reload keeps it; a send names the session the user saw the agent run, is
 * refused when the agent runs another one by then, and clears only its own draft, only if it was not typed on since.
 * While the agent works, Stop beside Send, or Esc in the field, stops only its current turn.
 */
const props = defineProps<{
  draftKey: string;
  agent: string | null;
  addresseeName: string | null;
  sessionId: string | null;
  inboxId: string;
  replyingTo: ReplyTarget | null;
  conversationProp: string;
  // The agent whose turn Stop ends, while its status offers that; none while nothing works.
  workingAgent: AgentOptionData | null;
}>();

const emit = defineEmits<{ replied: []; cancelReply: [] }>();

const drafts = useMessageDrafts();
const body = ref("");
const field = ref<InstanceType<typeof Textarea> | null>(null);
const textarea = computed(() => field.value?.element ?? null);
const hasText = computed(() => body.value.trim() !== "");
// The field names whom the message goes to, as the design's composer does: Message Ada, or the whole chat.
const placeholder = computed(
  () => `Message ${props.addresseeName ?? "everyone in this chat"}`,
);
useComposerHeight(textarea, body);
const turn = useTurnInterrupt();

function stopTurn(): void {
  if (props.workingAgent !== null) {
    turn.interrupt(props.workingAgent);
  }
}

// The stored draft is read in the browser only, after the server-rendered page has been taken over; the composer is
// mounted only once its conversation is revealed. A denial or sign-out empties it, which removes the stored draft.
onMounted(() => (body.value = drafts.read(props.draftKey)));
onBeforeUnmount(onPurge(() => (body.value = "")));

watch(
  () => props.draftKey,
  (key) => (body.value = drafts.read(key)),
);
watch(body, (text) => drafts.write(props.draftKey, text));
// A refused send put back into the draft shows in the field.
watch(
  () => drafts.read(props.draftKey),
  (text) => {
    if (text !== body.value) {
      body.value = text;
    }
  },
);

/**
 * Sends the draft through the conversation's owner: the text clears and a Sending bubble shows at once, and the
 * owner settles it; a reply names the number of the message it answers.
 */
function submit(): void {
  if (!hasText.value) {
    return;
  }

  const owner = useConversationIntents(props.draftKey);
  const draft = {
    draftKey: props.draftKey,
    text: body.value,
    agent: props.agent,
    expectedSessionId: props.sessionId,
    inboxId: props.inboxId,
  };
  const replyingTo = props.replyingTo;
  const intent =
    replyingTo === null
      ? owner.beginSend(draft)
      : owner.beginReply(draft, replyingTo);
  body.value = drafts.read(props.draftKey);

  if (replyingTo !== null) {
    emit("replied");
  }

  owner.submit(intent, props.conversationProp);
}

function sendOnEnter(event: KeyboardEvent): void {
  if (event.shiftKey || event.isComposing) {
    return;
  }

  event.preventDefault();
  submit();
}
</script>

<template>
  <form
    class="mb-3.5 flex flex-col rounded-composer border border-border-3 bg-bg pt-2.5 pr-2.5 pb-2 pl-3"
    @submit.prevent="submit"
  >
    <template v-if="replyingTo">
      <p class="mb-1.5 flex items-center gap-1.5 text-small text-text-3">
        <Icon name="reply" :size="14" />
        <span class="min-w-0 flex-1 truncate"
          >Replying to “{{ replyingTo.body.slice(0, 80) }}”</span
        >
        <IconButton
          icon="close"
          label="Stop replying"
          size="sm"
          @click="emit('cancelReply')"
        />
      </p>
    </template>
    <Textarea
      ref="field"
      v-model="body"
      bare
      text="body"
      name="body"
      :rows="1"
      :placeholder="placeholder"
      :aria-label="placeholder"
      class="block w-full border-0 p-0.5 transition-[height] duration-160"
      @keydown.enter="sendOnEnter"
      @keydown.esc="stopTurn"
    />
    <div class="mt-2 flex items-center gap-1.5">
      <IconButton
        icon="attach"
        label="Attaching files is not available yet"
        size="sm"
        disabled
      />
      <span class="flex-1"></span>
      <Menu label="Message options">
        <MenuItem disabled>Dump files</MenuItem>
      </Menu>
      <template v-if="turn.refusal.value">
        <span class="text-small text-danger">{{ turn.refusal.value }}</span>
      </template>
      <template v-if="workingAgent">
        <Button
          type="button"
          size="small"
          variant="bordered"
          data-stop-turn
          :pending="turn.isPending.value"
          @click="stopTurn"
        >
          <Icon name="stop" :size="14" />
          Stop
        </Button>
      </template>
      <Button
        type="submit"
        size="small"
        variant="quiet-to-primary"
        :filled="hasText"
      >
        <Icon name="arrow" :size="14" />
        Send
      </Button>
    </div>
  </form>
</template>
