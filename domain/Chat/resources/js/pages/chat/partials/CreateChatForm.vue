<script setup lang="ts">
import Button from "@kit/Button";
import Dialog from "@kit/Dialog";
import Textarea from "@kit/Textarea";
import { useAppContext } from "@kit/appContext";
import { keepStoredJson, readStoredJson } from "@kit/browserStorage";
import { keyedPost } from "@kit/keyedPost";
import { newRequestId } from "@kit/requestId";
import { createMainAgent } from "@kit/sessionStarts";
import { ref } from "vue";
import { useDriverChoice, type DriverChoice } from "../../../composables/useDriverChoice";
import DriverChoiceFields from "./DriverChoiceFields.vue";

/**
 * The New chat form: the program, account and model of another main agent and an optional first message. It opens
 * with the last choice, so Enter starts one more; Start chat makes the agent, its chat opens as a tab and the first
 * message, sent there, starts its session on that choice.
 */
const props = defineProps<{
  // The agent whose profile the programs and accounts are read for: a new chat's agent starts from the same one.
  referenceAgentId: string;
}>();

const emit = defineEmits<{ created: [agentId: string, firstMessage: string]; close: [] }>();

const viewerId = useAppContext().viewer.value.id ?? "guest";
const storageKey = `journal.new-chat-choice.${viewerId}`;
const last = readStoredJson<Partial<DriverChoice>>("local", storageKey, (decoded) =>
  typeof decoded === "object" && decoded !== null ? (decoded as Partial<DriverChoice>) : null,
);
const isSameAsLast = last !== null;
const picker = useDriverChoice(
  () => props.referenceAgentId,
  () => last ?? {},
);
const firstMessage = ref("");
const refusal = ref<string | null>(null);
const isSending = ref(false);
const requestId = newRequestId();

function start(): void {
  const choice = picker.choice.value;

  if (choice === null || isSending.value) {
    return;
  }

  isSending.value = true;
  refusal.value = null;
  keepStoredJson("local", storageKey, choice);
  keyedPost(
    createMainAgent.url(),
    {
      requestId,
      driver: choice.family,
      model: choice.model,
      accountId: choice.accountId,
      accountRevision: choice.accountRevision,
    },
    requestId,
    {
      onAccepted: (flash) => {
        if (typeof flash.createdAgentId === "string") {
          emit("created", flash.createdAgentId, firstMessage.value.trim());
        }
      },
      onRefused: (reason) => (refusal.value = reason ?? "The chat could not be started."),
      onUncertain: () => (refusal.value = "We could not confirm the chat started; look in the chat list."),
      onFinish: () => (isSending.value = false),
    },
  );
}

function startOnEnter(event: KeyboardEvent): void {
  if (!event.shiftKey && !event.isComposing) {
    event.preventDefault();
    start();
  }
}
</script>

<template>
  <Dialog :open="true" title="New chat" size="sm" @close="emit('close')">
    <form class="flex flex-col gap-3" data-new-chat-form @submit.prevent="start" @keydown.enter="startOnEnter">
      <p class="text-small text-text-3">Starts another main agent with a chat of its own.</p>
      <DriverChoiceFields :picker="picker" />
      <label class="flex flex-col gap-1">
        <span class="text-small text-text-3">First message</span>
        <Textarea
          v-model="firstMessage"
          :rows="3"
          placeholder="Optional. What should it work on?"
          data-first-message
        />
      </label>
      <template v-if="refusal">
        <p class="text-small text-danger" role="alert">{{ refusal }}</p>
      </template>
    </form>
    <template #footer>
      <small class="mr-auto text-badge text-text-3"
        >{{ isSameAsLast ? "The same as last time. " : "" }}Enter starts the chat; its session starts with the
        first message.</small
      >
      <Button variant="ghost" @click="emit('close')">Cancel</Button>
      <Button
        variant="primary"
        :disabled="picker.choice.value === null"
        :pending="isSending"
        data-start-chat
        @click="start"
        >Start chat</Button
      >
    </template>
  </Dialog>
</template>
