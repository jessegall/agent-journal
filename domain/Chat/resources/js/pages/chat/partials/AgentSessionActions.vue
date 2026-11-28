<script setup lang="ts">
import TextLink from "@kit/TextLink";
import { router } from "@inertiajs/vue3";
import { computed, onMounted, ref } from "vue";
import { newRequestId } from "@kit/requestId";
import type { AgentOptionData, StatusActionData } from "@generated/types/chat";
import {
  accountsPage,
  cancelStart as cancelStartAction,
  checkStart,
  dismissStartOutcome,
  recheck,
  retry,
} from "@kit/sessionStarts";
import { sendPageAction } from "@kit/pageActions";
import { load, LoaderCancelled, webCapacity } from "@kit/loaders";
import type { CapacityData } from "@kit/CoreTypes";
import { useStatusCheck } from "../../../composables/useStatusCheck";
import { useSwitchOperation } from "../../../composables/useSwitchOperation";
import { openAgentTerminal } from "../../../composables/useTerminalModal";
import SessionAction from "./SessionAction.vue";

/**
 * What the chosen agent's status offers now in the agent bar, each action mapped to its route: Retry and Check and
 * switch settle a switch, Check status and Check capacity read, Sign in opens Accounts, Dismiss hides the outcome and
 * Cancel start cancels. A message starts a stopped agent, the composer stops a turn, and the chat list ends a session
 * and opens Switch driver…, so the bar draws none of those.
 */
const props = defineProps<{ agent: AgentOptionData }>();

// The actions another part of the chat draws: the composer's Stop, the chat list's End session and Switch driver….
type BarActionType = Exclude<StatusActionData["type"], "interrupt" | "stop" | "switch">;

const notice = ref<string | null>(null);
const pendingType = ref<string | null>(null);
const switching = useSwitchOperation(() => props.agent);
const statusCheck = useStatusCheck(
  () => props.agent.status,
  (done) => router.reload({ onFinish: done }),
);

// A switch already under way for this agent is followed again, never sent again.
onMounted(() => switching.resume());

function settleSwitch(
  route: typeof retry,
  label: "Retrying" | "Checking",
): void {
  if (props.agent.switchId === null) {
    router.reload();

    return;
  }

  switching.retry(route.url(props.agent.switchId), newRequestId(), label);
}

function readAgain(): void {
  router.reload({ onFinish: () => (pendingType.value = null) });
}

function checkCapacity(): void {
  pendingType.value = "check-capacity";
  load(webCapacity, {
    agent: props.agent.id,
    mode: "required_container",
    cpuCores: null,
    memoryBytes: null,
    diskBytes: null,
  })
    .then((answer) => {
      notice.value = answer.status === "ok" ? capacityNotice(answer.value) : null;
    })
    .catch((failure: Error) => {
      if (!(failure instanceof LoaderCancelled)) {
        notice.value = "The capacity check did not arrive; check again.";
      }
    })
    .finally(() => (pendingType.value = null));
}

function capacityNotice(capacity: CapacityData): string | null {
  return capacity.fits ? "The host has room for this start now." : (capacity.explanation ?? null);
}

function dismiss(): void {
  const operation = props.agent.status.operation;

  if (operation === undefined) {
    return;
  }

  pendingType.value = "dismiss";
  sendPageAction(
    dismissStartOutcome(props.agent.id),
    { requestId: operation.id, version: operation.stage },
    { only: [], onFinish: () => (pendingType.value = null) },
  );
}

function cancelStart(): void {
  if (props.agent.sessionId === null) {
    return;
  }

  pendingType.value = "cancel-start";
  sendPageAction(
    cancelStartAction({ agent: props.agent.id, session: props.agent.sessionId }),
    { requestId: newRequestId() },
    { only: [], onFinish: () => (pendingType.value = null) },
  );
}

/**
 * Asks the session's host one real question, once under a new request id, and waits for its answer on the page; it
 * ends with the host's answer, or after a bounded wait with why there was none. With no session it reads the page.
 */
function checkStatus(): void {
  pendingType.value = "check-status";
  notice.value = null;

  if (props.agent.sessionId === null) {
    readAgain();

    return;
  }

  const askedAt = Date.now();
  const end = (silence: string | null) => {
    pendingType.value = null;
    notice.value = silence;
  };

  sendPageAction(
    checkStart({ agent: props.agent.id, session: props.agent.sessionId }),
    { requestId: newRequestId() },
    { only: [], onFinish: () => statusCheck.follow(askedAt, end) },
  );
}

function openTerminal(): void {
  openAgentTerminal(props.agent);
}

function isBarAction(
  action: StatusActionData,
): action is StatusActionData & { type: BarActionType } {
  return action.type !== "interrupt" && action.type !== "stop" && action.type !== "switch";
}

// The terminal has no button in the agent bar: the agent menu opens it, and the words below while the driver waits.
const drawnActions = computed(() =>
  props.agent.status.actions
    .filter(isBarAction)
    .filter(
      (action) => action.type !== "open-terminal" || !props.agent.hasTerminal,
    ),
);

const handlers: Record<BarActionType, () => void> = {
  retry: () => settleSwitch(retry, "Retrying"),
  "recheck-switch": () => settleSwitch(recheck, "Checking"),
  "check-status": checkStatus,
  "check-capacity": checkCapacity,
  "sign-in": () => router.visit(accountsPage.url()),
  "open-terminal": openTerminal,
  dismiss,
  "cancel-start": cancelStart,
};
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5" aria-label="Session actions">
    <template
      v-if="
        agent.needsAttention && agent.hasTerminal && agent.sessionId !== null
      "
    >
      <p class="text-small text-text-2" role="status">
        <TextLink data-terminal-action @click="openTerminal"
          >The driver needs your attention</TextLink
        >
      </p>
    </template>
    <template v-for="action in drawnActions" :key="action.type">
      <SessionAction
        :action="action"
        :is-pending="pendingType === action.type"
        @activate="handlers[action.type]()"
      />
    </template>
    <template v-if="notice">
      <p class="max-w-[60ch] text-small text-text-3">{{ notice }}</p>
    </template>
    <template
      v-if="switching.progress.value && switching.state.value !== 'idle'"
    >
      <p class="text-small text-text-3">{{ switching.progress.value }}</p>
    </template>
    <template v-if="switching.refusal.value">
      <p class="text-small text-danger">{{ switching.refusal.value }}</p>
    </template>
  </div>
</template>
