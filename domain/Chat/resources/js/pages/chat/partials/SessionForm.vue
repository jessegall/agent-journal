<script setup lang="ts">
import Avatar from "@kit/Avatar";
import Button from "@kit/Button";
import Dialog from "@kit/Dialog";
import { keyedPost } from "@kit/keyedPost";
import { newRequestId } from "@kit/requestId";
import { switchMethod } from "@kit/sessionStarts";
import { computed, ref, watch } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { useDriverChoice, type DriverChoice } from "../../../composables/useDriverChoice";
import { useSwitchOperation } from "../../../composables/useSwitchOperation";
import DriverChoiceFields from "./DriverChoiceFields.vue";

/**
 * The Switch driver dialog, so the user moves an agent to another driver, account or model: the same driver keeps the
 * conversation, another carries the chat over or starts clean, and a working agent may finish its turn first. Without a
 * session it keeps the choice for the next message.
 */
const props = defineProps<{ agent: AgentOptionData }>();

const emit = defineEmits<{ close: [] }>();

const currentFamily = props.agent.sessionDriver ?? props.agent.conversations[0]?.driver ?? null;
const picker = useDriverChoice(
  () => props.agent.id,
  () => ({ family: currentFamily ?? undefined, model: props.agent.sessionModel ?? undefined }),
);
const switching = useSwitchOperation(() => props.agent);
const carriesConversation = ref(true);
const waitsForTurn = ref(true);
const noteAfterChoice = ref<string | null>(null);
const refusal = ref<string | null>(null);
let requestId = newRequestId();

// The choice as the dialog first showed it, so Switch stays off until something differs from it.
const shownFirst = ref<DriverChoice | null>(null);
watch(
  () => picker.choice.value,
  (choice) => {
    if (shownFirst.value === null && choice !== null && choice.family === currentFamily) {
      shownFirst.value = { ...choice };
    }
  },
  { immediate: true },
);

const hasSession = computed(() => props.agent.sessionId !== null);
const isWorking = computed(() => props.agent.status.actions.some((action) => action.type === "interrupt"));
const isSameDriver = computed(() => picker.family.value === currentFamily);
const nowLabel = computed(() =>
  [props.agent.sessionDriverLabel ?? currentFamily ?? "No driver yet", props.agent.sessionModel]
    .filter((part) => part !== null && part !== "")
    .join(" · "),
);
const differs = computed(() => {
  const choice = picker.choice.value;
  const first = shownFirst.value;

  return (
    choice !== null &&
    (first === null || choice.family !== first.family || choice.model !== first.model || choice.accountId !== first.accountId)
  );
});
const switchLabel = computed(() => (isSameDriver.value ? "Switch" : `Switch to ${picker.driverLabel.value}`));
const isSending = computed(() => switching.isOut());

// The same driver resumes the conversation it runs now; another driver begins a new one.
const resumedConversationId = computed(() =>
  isSameDriver.value
    ? (props.agent.conversations.find((conversation) => conversation.driver === picker.family.value)?.id ?? null)
    : null,
);

function choiceFields(choice: DriverChoice) {
  return {
    agentId: props.agent.id,
    driver: choice.family,
    driverType: picker.driverType.value,
    model: choice.model,
    accountId: choice.accountId,
    accountRevision: choice.accountRevision,
  };
}

/**
 * Keeps the choice for the next start of an agent that runs no session: nothing starts now.
 */
function chooseNextStart(choice: DriverChoice): void {
  const key = requestId;
  keyedPost(
    switchMethod.url(props.agent.profileKey),
    { requestId: key, ...choiceFields(choice) },
    key,
    {
      onAccepted: () => (noteAfterChoice.value = `Saved: the next message starts ${props.agent.name} on ${picker.driverLabel.value}.`),
      onRefused: (reason) => (refusal.value = reason),
      onUncertain: () => (refusal.value = "We could not confirm the choice was saved; open the dialog again."),
    },
  );
}

function submit(): void {
  const choice = picker.choice.value;

  if (choice === null || !differs.value || isSending.value) {
    return;
  }

  refusal.value = null;

  if (!hasSession.value) {
    chooseNextStart(choice);

    return;
  }

  switching.begin(requestId, switchMethod.url(props.agent.profileKey), {
    requestId,
    ...choiceFields(choice),
    expectedSessionId: props.agent.sessionId,
    expectedGeneration: props.agent.sessionGeneration,
    conversationId: resumedConversationId.value,
    carryConversation: !isSameDriver.value && carriesConversation.value,
    stopsTurn: isWorking.value && !waitsForTurn.value,
  });
}

// A refused switch may be changed and sent again, as a new switch.
watch(
  () => switching.state.value,
  (state) => {
    if (state === "refused") {
      requestId = newRequestId();
    }

    if (state === "over") {
      emit("close");
    }
  },
);

switching.resume();
</script>

<template>
  <Dialog :open="true" title="Switch driver" size="md" @close="emit('close')">
    <form class="flex w-full max-w-[500px] flex-col gap-3" data-switch-driver @submit.prevent="submit">
      <p class="flex items-center gap-2 text-small text-text-2" data-now>
        <span class="w-24 text-text-3">Now</span>
        <Avatar :participant="{ kind: 'agent', driver: agent.sessionDriver ?? '' }" />
        <span>{{ nowLabel }}</span>
        <span class="text-text-3">· {{ agent.status.label }}</span>
      </p>
      <DriverChoiceFields :picker="picker" />
      <div class="flex flex-col gap-1.5 rounded-field border border-line p-3 text-small text-text-2" data-conversation>
        <b class="text-text">The conversation</b>
        <template v-if="isSameDriver">
          <p data-same-driver>
            {{ agent.name }} keeps its session and conversation; its next turn runs on the new model or account.
          </p>
        </template>
        <template v-else>
          <p>{{ picker.driverLabel.value }} cannot take this session over, so a new session starts.</p>
          <label class="flex items-start gap-2">
            <input v-model="carriesConversation" type="radio" :value="true" name="conversation" data-carry-over />
            <span>Carry the conversation over: the new session first reads this chat and the memories.</span>
          </label>
          <label class="flex items-start gap-2">
            <input v-model="carriesConversation" type="radio" :value="false" name="conversation" data-start-clean />
            <span>Start clean: the new session reads only the memories, and the chat stays here to read.</span>
          </label>
        </template>
        <p class="text-text-3">The chat never changes: every message stays, and one line marks the switch.</p>
      </div>
      <template v-if="isWorking">
        <label class="flex items-center gap-2 text-small text-text-2">
          <input v-model="waitsForTurn" type="checkbox" data-wait-for-turn />
          Wait until {{ agent.name }} finishes its current turn
        </label>
      </template>
      <template v-if="!hasSession">
        <p class="text-small text-text-3" data-no-session>
          No session is running: nothing starts now, and the next message starts {{ agent.name }} on the new driver.
        </p>
      </template>
      <template v-if="switching.progress.value && switching.state.value !== 'idle'">
        <p class="text-small text-text-3" role="status">{{ switching.progress.value }}</p>
      </template>
      <template v-if="noteAfterChoice">
        <p class="text-small text-text-2" role="status">{{ noteAfterChoice }}</p>
      </template>
      <template v-if="switching.refusal.value ?? refusal">
        <p class="text-small text-danger" role="alert">{{ switching.refusal.value ?? refusal }}</p>
      </template>
    </form>
    <template #footer>
      <Button variant="ghost" @click="emit('close')">Cancel</Button>
      <Button
        variant="primary"
        :disabled="!differs || isSending"
        :pending="isSending"
        data-switch
        @click="submit"
        >{{ switchLabel }}</Button
      >
    </template>
  </Dialog>
</template>
