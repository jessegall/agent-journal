<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Button from "@kit/Button";
import { onPurge } from "@kit/protectedView";
import Icon from "@kit/Icon";
import IconButton from "@kit/IconButton";
import Menu from "@kit/Menu";
import MenuGroup from "@kit/MenuGroup";
import MenuItem from "@kit/MenuItem";
import MenuSeparator from "@kit/MenuSeparator";
import { useComposerHeight } from "./composables/useComposerHeight";
import {
  useConversationIntents,
  type ReplyTarget,
} from "./composables/useConversationIntents";
import type { ParticipantData } from "@generated/types/chat";
import { useMessageDrafts } from "./composables/useMessageDrafts";

/**
 * Posts in the chat with the chosen agent, at the chat's own inbox (doc 4, 6.5). The text is the draft of this chat,
 * so browsing other chats, a switch or a reload keeps it; a send names the session the user saw the agent run, is
 * refused when the agent runs another one by then, and clears only its own draft, only if it was not typed on since.
 */
const props = defineProps<{
  draftKey: string;
  agent: string | null;
  addresseeName: string | null;
  sessionId: string | null;
  sessionGeneration: number;
  inboxId: string;
  replyingTo: ReplyTarget | null;
  conversationProp: string;
  // The other members the post may be addressed to, as type:id with the label the roster shows.
  participants: ParticipantData[];
  viewer: string;
}>();

const emit = defineEmits<{ replied: [] }>();

const drafts = useMessageDrafts();
const body = ref("");
const textarea = ref<HTMLTextAreaElement | null>(null);
const hasText = computed(() => body.value.trim() !== "");
const addressee = ref("");
const asking = ref(false);
// The field names whom the message goes to, as the design's composer does: Message Ada, or the whole chat.
const placeholder = computed(
  () => `Message ${props.addresseeName ?? "everyone in this chat"}`,
);
const others = computed(() =>
  props.participants.filter((member) => member.actor !== props.viewer),
);
// A question among more than two people must name who settles it; in a pair the other member is implied.
const needsRespondent = computed(
  () => asking.value && others.value.length > 1 && addressee.value === "",
);

/**
 * How a member is named in the picker: two members with the same name are told apart by driver and id.
 */
function optionLabel(member: ParticipantData): string {
  const namesake =
    others.value.filter((other) => other.label === member.label).length > 1;
  const driver = member.driver === null ? "" : ` (${member.driver})`;

  return namesake
    ? `${member.label}${driver} · ${member.actor.slice(-6)}`
    : `${member.label}${driver}`;
}

useComposerHeight(textarea, body);

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
 * owner settles it; a reply goes to the message at the version shown, so a stale one is refused with its text kept.
 */
function submit(): void {
  if (!hasText.value || needsRespondent.value) {
    return;
  }

  const owner = useConversationIntents(props.draftKey);
  const draft = {
    draftKey: props.draftKey,
    text: body.value,
    agent: props.agent,
    expectedSessionId: props.sessionId,
    expectedGeneration: props.sessionGeneration,
    inboxId: props.inboxId,
    addressee: addressee.value === "" ? null : addressee.value,
    question: asking.value,
  };
  const replyingTo = props.replyingTo;
  const intent =
    replyingTo === null
      ? owner.beginSend(draft)
      : owner.beginReply(draft, replyingTo, replyingTo.stateVersion);
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
    <template v-if="needsRespondent">
      <p class="mb-1.5 text-small text-danger" role="alert">
        Choose who should answer this question.
      </p>
    </template>
    <template v-if="replyingTo">
      <p class="mb-1.5 flex items-center gap-1.5 text-small text-text-3">
        <Icon name="reply" :size="14" />
        <span class="truncate"
          >Replying to “{{ replyingTo.body.slice(0, 80) }}”</span
        >
      </p>
    </template>
    <textarea
      ref="textarea"
      v-model="body"
      name="body"
      rows="1"
      :placeholder="placeholder"
      :aria-label="placeholder"
      class="block w-full resize-none border-0 bg-transparent p-0 text-body leading-[1.45] text-text transition-[height] duration-160 outline-none placeholder:text-text-4"
      @keydown.enter="sendOnEnter"
    />
    <div class="mt-2 flex items-center gap-1.5">
      <IconButton
        icon="attach"
        label="Attaching files is not available yet"
        size="sm"
        disabled
      />
      <span class="flex-1"></span>
      <template v-if="asking">
        <span class="text-badge text-text-3">Question</span>
      </template>
      <Menu label="Message options">
        <MenuGroup label="Send to">
          <MenuItem radio :checked="addressee === ''" @click="addressee = ''"
            >Everyone</MenuItem
          >
          <template v-for="member in others" :key="member.actor">
            <MenuItem
              radio
              :checked="addressee === member.actor"
              @click="addressee = member.actor"
            >
              {{ optionLabel(member) }}
            </MenuItem>
          </template>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem :checked="asking" @click="asking = !asking"
          >Ask as a question</MenuItem
        >
        <MenuItem disabled>Dump files</MenuItem>
      </Menu>
      <Button
        type="submit"
        size="small"
        :variant="hasText ? 'primary' : 'bordered'"
        :disabled="!hasText"
      >
        <Icon name="arrow" :size="14" />
        Send
      </Button>
    </div>
  </form>
</template>
