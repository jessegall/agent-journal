<script setup lang="ts">
import TextLink from '@kit/TextLink';
import { useAppContext } from "@kit/appContext";
import { dateTime } from "@kit/format";
import { Link, router, usePage } from "@inertiajs/vue3";
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId, watch } from "vue";
import Button from "@kit/Button";
import Field from "@kit/Field";
import OptionCards from "@kit/OptionCards";
import Select from "@kit/Select";
import Toggle from "@kit/Toggle";
import Dialog from "@kit/Dialog";
import { followPage } from "@kit/followPage";
import { keyedPost } from "@kit/keyedPost";
import { sendPageAction } from "@kit/pageActions";
import { readPage } from "@kit/pageReads";
import { newRequestId } from "@kit/requestId";
import { useStartRestoration } from "../../../composables/useStartRestoration";
import { useSwitchOperation } from "../../../composables/useSwitchOperation";
import type {
  AgentOptionData,
  ChatData,
  DriverChoiceData,
} from "@generated/types/chat";
import type {
  DriverSourceType,
  DriverTypeSource,
  StartPreviewData,
} from "@kit/CoreTypes";
import type { WindowResult } from "@kit/PageTypes";
import type { DriverType } from "@kit/CoreTypes";
import {
  accountsPage,
  cancelStart as cancelStartAction,
  recheck,
  startMain,
  switchMethod,
  type EligibleAccountData,
  type EligibleAccountsData,
} from "@kit/sessionStarts";

/**
 * Starts, resumes or switches the chosen agent's session: the driver, the model among those the profile permits, the
 * registered driver (its terminal or headless driver type kept for the agent when asked), the account among those the
 * driver may run with, and for a resume the conversation it continues. The form makes one request id when it opens,
 * so a second press repeats the same start; an edit after a refusal makes a fresh one. A refusal whose next step is a
 * field shows under that field and takes the focus; every other choice stays. Every id comes from the dialog's own
 * mount, so two open dialogs never share one. A start ends once the host confirms its session's process exists,
 * whatever it does then; a lost reply is recovered by reading the start's receipt by its key, never by posting again.
 * The tab keeps the dialog's choices and request id, so a reload shows the same start; closing the dialog forgets them.
 * A start reads Ready only once the host runs it, and shows the host's refusal when its start was refused; a switch
 * shows each stage it passes until it ends.
 */
const props = defineProps<{
  agent: AgentOptionData;
  mode: "start" | "resume" | "switch";
}>();
const agentStatus = computed(() => props.agent.status);

const emit = defineEmits<{ close: [] }>();

type SessionChoice = {
  requestId: string;
  agentId: string;
  model: string;
  driver: string;
  driverType: DriverType | null;
  saveDriverType: boolean;
  accountId: string | undefined;
  accountRevision: number | undefined;
  conversationId: string | null;
  previewRevision: number | undefined;
};

const titles = {
  start: "Start session",
  resume: "Resume a conversation",
  switch: "Switch session",
};

// The ids of this dialog's fields, unique to this mount.
const formId = useId();
const fieldIds = {
  driver: `${formId}-driver`,
  model: `${formId}-model`,
  accountId: `${formId}-account`,
  conversationId: `${formId}-conversation`,
};

type FieldKey = keyof typeof fieldIds;

let requestId = newRequestId();
const switching = useSwitchOperation(() => props.agent);
// The driver family chosen; none takes the family of the agent's latest conversation, else the first.
const family = ref<string | null>(null);
// The driver type as drafted: inherit takes the agent's saved one or the profile's; on and off name headless or terminal.
type ModeDraft = "inherit" | "on" | "off";
const modeDraft = ref<ModeDraft>("inherit");
// The server's preview of the start as drafted, read again whenever the draft changes.
const preview = ref<StartPreviewData | null>(null);
const saveDriverType = ref(false);
const accounts = ref<EligibleAccountData[]>([]);
const accountId = ref<string | null>(null);
const modelChoices = ref<string[]>([]);
const defaultModel = ref<string | null>(null);
const model = ref<string | null>(null);
// A refusal that belongs to one field, shown under it; a refusal of the whole change stays in refusal.
const fieldRefusal = ref<{ field: FieldKey; reason: string } | null>(null);
const conversationId = ref<string | null>(
  props.mode === "resume" ? (props.agent.conversations[0]?.id ?? null) : null,
);
const refusal = ref<string | null>(null);
const progress = ref<string | null>(null);
const sending = ref(false);
const isCancelling = ref(false);
let startedSessionId: string | null = null;
// The agent as the page showed it when the start was sent: until the page reads it again, it says nothing new.
const agentWhenSent = shallowRef<typeof props.agent | null>(null);
let following: { stop: () => void } | undefined;

const account = computed(() =>
  accounts.value.find((choice) => choice.id === accountId.value),
);
const review = computed(() => {
  return `${preview.value?.label ?? "its driver"}, on ${account.value?.label ?? "no account"}`;
});
const isSwitchOpen = computed(() => switching.isOut());
const canSubmit = computed(
  () =>
    account.value !== undefined &&
    account.value.unavailableReason === null &&
    preview.value?.canRun === true &&
    !sending.value &&
    !isSwitchOpen.value &&
    !isCancelling.value,
);
// A switch shows its own stage and refusal; a start or resume shows the form's.
const shownProgress = computed(() =>
  props.mode === "switch" ? switching.progress.value : progress.value,
);
const shownRefusal = computed(
  () =>
    (props.mode === "switch" ? switching.refusal.value : null) ?? refusal.value,
);

// The chat window's own prop: the page on Chat's own page, the window's part of Home elsewhere.
const page = usePage();
const { viewer } = useAppContext();
const restoration = useStartRestoration(
  viewer.value.id ?? "guest",
  props.agent.id,
  props.mode,
);
const restored = restoration.read();
const focusedField = ref<string | null>(restored?.focus ?? null);

type StartReceiptAnswer = {
  state: "pending" | "accepted" | "refused";
  sessionId?: string | null;
  explanation?: string;
  remedy?: string;
};

if (restored !== null) {
  model.value = restored.model;
  accountId.value = restored.accountId;
  conversationId.value = restored.conversationId;
  saveDriverType.value = restored.saveDriverType;
  requestId = restored.requestId ?? requestId;
}

/**
 * The tab's record of the dialog as it stands now; the request id only once the start was sent.
 */
function keepRestoration(sentRequestId: string | null): void {
  restoration.keep({
    driver: driver.value,
    driverType: draftedDriverType.value ?? "",
    model: model.value,
    accountId: accountId.value,
    conversationId: conversationId.value,
    saveDriverType: saveDriverType.value,
    focus: focusedField.value,
    requestId: sentRequestId,
  });
}

let sentRequestId: string | null = restored?.requestId ?? null;

/**
 * Keeps which field has the focus by its key, not its id, since ids belong to one mount.
 */
function noteFocus(event: FocusEvent): void {
  const target = event.target as HTMLElement;
  const field = (Object.keys(fieldIds) as FieldKey[]).find(
    (key) => fieldIds[key] === target.id,
  );
  focusedField.value = field ?? null;
}

let isFocusRestored = restored === null;

function close(): void {
  restoration.forget();
  emit("close");
}

/**
 * Reads where the start sent under the form's key stands, when its reply was lost or the page was loaded again: the
 * session it started is then followed, a refusal shown, and a start still pending is followed from the page.
 */
function readReceipt(): void {
  readPage<StartReceiptAnswer>("web.start-receipt", {
    request: requestId,
  }).then(
    (answer) => {
      if (answer.state === "refused") {
        progress.value = null;
        refusal.value = [answer.explanation, answer.remedy]
          .filter(Boolean)
          .join(" ");
        forgetRefusedStart();

        return;
      }

      startedSessionId = answer.sessionId ?? startedSessionId;
      followStart();
    },
    () => {
      progress.value = null;
      refusal.value =
        "This start could not be read; check the agent before starting again.";
    },
  );
}

/**
 * A refused start is over: its key keeps answering with that refusal, so the next Start, once its cause is fixed, is a
 * new start under a new key.
 */
function forgetRefusedStart(): void {
  sentRequestId = null;
  requestId = newRequestId();
  keepRestoration(null);
}

const canCancelStart = computed(
  () =>
    sending.value === false &&
    props.agent.status.actions.some((action) => action.type === "cancel-start"),
);
function cancelStart(): void {
  if (props.agent.sessionId === null) {
    return;
  }

  isCancelling.value = true;
  sendPageAction(
    cancelStartAction({ agent: props.agent.id, session: props.agent.sessionId }),
    { requestId: newRequestId() },
    {
      only: [chatProp],
      onSuccess: () => {
        following?.stop();
        progress.value = "Cancelled";
        sentRequestId = null;
        requestId = newRequestId();
        keepRestoration(null);
      },
      onFinish: () => (isCancelling.value = false),
    },
  );
}
const ownPage = page.component === "chat/ChatWindow";
const chatProp = ownPage ? "page" : "window_chat_conversation";
const driverChoices = computed<DriverChoiceData[]>(() => {
  const shown = page.props[chatProp] as WindowResult<ChatData> | undefined;

  return shown?.state === "ready" ? shown.data.drivers : [];
});
// Each driver family once, in the catalogue's order.
const families = computed(() => [
  ...new Set(driverChoices.value.map((choice) => choice.family)),
]);
const familyOptions = computed(() =>
  families.value.map((choice) => ({ value: choice, label: familyLabel(choice) })),
);
// The model the profile's tier names for this driver is marked as its default.
const modelOptions = computed(() =>
  modelChoices.value.map((choice) => ({
    value: choice,
    label: choice === defaultModel.value ? `${choice} (default)` : choice,
  })),
);
// An account that cannot start now is shown with the reason, and cannot be chosen.
// The card that starts a new conversation stands beside one card per conversation to resume.
const NEW_CONVERSATION = "new";
const conversationChoice = computed({
  get: () => conversationId.value ?? NEW_CONVERSATION,
  set: (choice: string | null) =>
    (conversationId.value = choice === NEW_CONVERSATION ? null : choice),
});
const conversationOptions = computed(() => [
  ...props.agent.conversations.map((conversation) => ({
    value: conversation.id,
    title: familyLabel(conversation.driver),
    aside: dateTime(conversation.startedAt),
    description: "",
  })),
  {
    value: NEW_CONVERSATION,
    title: "Start a new conversation instead",
    aside: "",
    description: "",
  },
]);
const accountOptions = computed(() =>
  accounts.value.map((choice) => ({
    value: choice.id,
    label: choice.unavailableSentence
      ? `${choice.label}: ${choice.unavailableSentence}`
      : choice.label,
    disabled: choice.unavailableReason !== null,
  })),
);
const driver = computed(
  () =>
    family.value ??
    props.agent.conversations[0]?.driver ??
    families.value[0] ??
    "claude-code",
);
const draftedDriverType = computed<DriverType | null>(
  () =>
    (({ inherit: null, on: "headless", off: "terminal" }) as const)[
      modeDraft.value
    ],
);
// The driver type the start runs in, as the server resolved it; the drafted one until its preview arrives.
const driverType = computed<DriverType>(
  () => preview.value?.driverType ?? draftedDriverType.value ?? "headless",
);
const driverTypeSources: Record<DriverTypeSource, string> = {
  explicit: "chosen here",
  saved: "saved for this agent",
  profile: "the profile's default",
  only_type: "the only way this driver runs",
};
const familySources: Record<DriverSourceType, string> = {
  explicit: "chosen here",
  profile: "set by the profile",
  parent_session: "from the agent that started it",
};

if (restored !== null) {
  family.value = restored.driver;
  modeDraft.value = (
    { "": "inherit", headless: "on", terminal: "off" } as const
  )[restored.driverType];
}

function chooseHeadless(isHeadless: boolean): void {
  modeDraft.value = isHeadless ? "on" : "off";
}

function readPreview(): void {
  readPage<StartPreviewData>("web.start-preview", {
    agent: props.agent.id,
    family: driver.value,
    driverType: draftedDriverType.value ?? "",
    model: model.value ?? "default",
  }).then(
    (answer) => (preview.value = answer),
    () => (preview.value = null),
  );
}

watch([driver, draftedDriverType, model], readPreview, { immediate: true });
watch(
  [
    driver,
    driverType,
    model,
    accountId,
    conversationId,
    saveDriverType,
    focusedField,
  ],
  () => keepRestoration(sentRequestId),
);

/**
 * Asks the chat window, read again, for the driver's eligible accounts; they arrive as part of its data.
 */
function readAccounts(chosen: string): void {
  router.reload({
    only: [chatProp],
    data: ownPage
      ? { accountsFor: chosen }
      : { window: { "chat.conversation": { accountsFor: chosen } } },
    onError: (errors) => {
      isAccountReadFailed.value = true;
      refusal.value =
        Object.values(errors)[0] ?? "The accounts could not be read.";
    },
  });
}

// Whether the last read of the driver's accounts failed, which offers Retry instead of an empty list.
const isAccountReadFailed = ref(false);
// Whether accounts exist for the driver but none can start now, which disables Start and points to Accounts.
const isEveryAccountUnavailable = computed(
  () =>
    accounts.value.length > 0 &&
    accounts.value.every((choice) => choice.unavailableReason !== null),
);

/**
 * Moves the focus to a field once the page has drawn it, as the button that was pressed may be gone.
 */
function focusField(field: FieldKey): void {
  void nextTick(() => document.getElementById(fieldIds[field])?.focus());
}

function refuseAt(field: FieldKey, reason: string): void {
  fieldRefusal.value = { field, reason };
  focusField(field);
}

/**
 * Chooses the driver the profile prefers while nothing chose one: no driver picked, no conversation to resume.
 */
function preselectPreferredDriver(preferred: string | null): void {
  if (preferred === null || family.value !== null || props.agent.conversations.length > 0) {
    return;
  }

  family.value = preferred;
}

/**
 * Shows the accounts read again: a chosen account that can still start stays chosen even when another is the default;
 * a chosen one that no longer can is cleared with its reason beside the field; with none chosen the default is.
 */
function showAccounts(read: EligibleAccountsData | undefined): void {
  if (read === undefined) {
    return;
  }

  accounts.value = read.accounts;
  modelChoices.value = read.modelChoices;
  defaultModel.value = read.defaultModel;
  preselectPreferredDriver(read.preferredDriver);

  if (!isFocusRestored && restored?.focus && restored.focus in fieldIds) {
    isFocusRestored = true;
    focusField(restored.focus as FieldKey);
  }

  model.value =
    model.value !== null && read.modelChoices.includes(model.value)
      ? model.value
      : read.defaultModel;
  refusal.value = null;
  isAccountReadFailed.value = false;
  const kept = accounts.value.find((choice) => choice.id === accountId.value);

  if (kept !== undefined && kept.unavailableReason === null) {
    return;
  }

  if (accountId.value !== null) {
    accountId.value = null;
    refuseAt(
      "accountId",
      kept?.unavailableSentence ?? "The chosen account is no longer available.",
    );

    return;
  }

  const preferred =
    accounts.value.find(
      (choice) => choice.isDefault && choice.unavailableReason === null,
    ) ?? accounts.value.find((choice) => choice.unavailableReason === null);
  accountId.value = preferred?.id ?? null;
}

// An edit after a refusal is a new choice: its submission gets a fresh request id, and the field's reason goes.
watch(
  [driver, model, driverType, accountId, conversationId],
  () => {
    if (fieldRefusal.value === null && refusal.value === null) {
      return;
    }

    requestId = newRequestId();
    fieldRefusal.value = null;
  },
  { flush: "sync" },
);

watch(
  () => page.props[chatProp] as WindowResult<ChatData> | undefined,
  (shown) =>
    showAccounts(
      shown?.state === "ready" ? shown.data.eligibleAccounts : undefined,
    ),
);
watch(driver, readAccounts, { immediate: true });

function sessionChoice(): SessionChoice {
  return {
    requestId,
    agentId: props.agent.id,
    model: model.value ?? "default",
    driver: driver.value,
    driverType: draftedDriverType.value,
    saveDriverType: saveDriverType.value,
    accountId: account.value?.id,
    accountRevision: account.value?.signInRevision,
    conversationId: conversationId.value,
    previewRevision: preview.value?.catalogueRevision,
  };
}

/**
 * Starts or resumes once under the form's request id, through Inertia. Starting or Resuming shows at once and stays
 * until the page shows the session the start answered with running; a session another request started is shown as
 * it is, and does not confirm this one.
 */
function start(): void {
  progress.value = props.mode === "resume" ? "Resuming" : "Starting";
  refusal.value = null;
  sending.value = true;
  sentRequestId = requestId;
  agentWhenSent.value = props.agent;
  keepRestoration(sentRequestId);
  keyedPost(startMain.url(props.agent.profileKey), sessionChoice(), requestId, {
    onAccepted: (flash) => {
      startedSessionId =
        typeof flash.startedSessionId === "string"
          ? flash.startedSessionId
          : null;
      followStart();
    },
    onRefused: (reason, field) => {
      progress.value = null;
      forgetRefusedStart();

      if (field !== null && field in fieldIds && reason !== null) {
        if (field === "conversationId") {
          conversationId.value = null;
        }

        refuseAt(field as FieldKey, reason);

        return;
      }

      refusal.value = reason;
    },
    onUncertain: () => readReceipt(),
    onFinish: () => (sending.value = false),
  });
}

/**
 * Shows the start as the page has it now, and answers whether it ended: the host confirmed the process of the session
 * this start answered with, whatever it does now, or the agent's latest start is this one, refused. A session another
 * request started is shown as it is, and does not end this one.
 */
function showStart(): boolean {
  const shown = props.agent;
  const status = shown.status;
  const isThisStart = status.operation?.id === requestId;
  const isStartedSessionShown =
    startedSessionId !== null && shown.sessionId === startedSessionId;
  const isOtherSessionShown =
    shown.sessionId !== null && shown.sessionId !== startedSessionId;

  if (isThisStart && status.isStartRefused) {
    progress.value = null;
    refusal.value = [status.reason, status.remedy].filter(Boolean).join(" ");

    return true;
  }

  // A refused start ends its session, so the refusal shows on the agent once the page reads it again.
  const hasStartedSessionEnded =
    startedSessionId !== null && shown.sessionId !== startedSessionId;

  if (hasStartedSessionEnded && shown.startRefusal !== null) {
    progress.value = null;
    refusal.value = shown.startRefusal;

    return true;
  }

  // The session this start made is gone and the agent, as the page read it after the start was sent, holds none and
  // shows no refusal: the start is over, so the dialog says why it ended and the next Start is a new start.
  if (
    hasStartedSessionEnded &&
    shown.sessionId === null &&
    shown !== agentWhenSent.value
  ) {
    progress.value = null;
    refusal.value = status.reason ?? "The session this start made has ended; start it again.";
    forgetRefusedStart();

    return true;
  }

  // The start is over once its session runs: the dialog closes and the agent bar says the session's state.
  if (isStartedSessionShown && status.isProcessConfirmed) {
    progress.value = "Ready";
    close();

    return true;
  }

  if (isOtherSessionShown && status.isProcessConfirmed) {
    progress.value =
      "Another session is running; this start is not confirmed yet";
  }

  return false;
}

function followStart(): void {
  if (!showStart()) {
    following = followPage(showStart);
  }
}

/**
 * Sends the switch once under the form's request id, through Inertia; the dialog then follows its stage from the
 * page until it is over.
 */
function switchSession(): void {
  switching.begin(requestId, switchMethod.url(props.agent.profileKey), {
    ...sessionChoice(),
    driverType: driverType.value,
    expectedSessionId: props.agent.sessionId,
    expectedGeneration: props.agent.sessionGeneration,
  });
}

// A switch is reviewed before it is sent: its source, its target and what happens to the running session.
const isReviewing = ref(false);
const familyLabel = (family: string | null) =>
  driverChoices.value.find((choice) => choice.family === family)?.label ??
  "its driver";
const sourceLabel = computed(
  () =>
    props.agent.sessionDriverLabel ?? familyLabel(props.agent.sessionDriver),
);
const targetLabel = computed(() => preview.value?.label ?? "its driver");
// The leg of the agent's switch the host has not confirmed, in the words of that leg; none while both are known.
const unconfirmedLeg = computed(() => {
  if (props.agent.switchStage === "stop_unconfirmed") {
    return `Couldn't confirm that ${sourceLabel.value} stopped`;
  }

  if (props.agent.switchStage === "start_unconfirmed") {
    return `Couldn't confirm that ${targetLabel.value} started`;
  }

  return null;
});
const legAction = computed(() => props.agent.status.actions[0] ?? null);

/**
 * The one action an unconfirmed leg offers: continue the switch for an actor who may reconcile it, else read the
 * agent again; neither advances anything on a reload.
 */
function settleLeg(): void {
  if (
    legAction.value?.type === "recheck-switch" &&
    props.agent.switchId !== null
  ) {
    switching.retry(
      recheck.url(props.agent.switchId),
      newRequestId(),
      "Checking",
    );

    return;
  }

  router.reload();
}

/**
 * Starts the choices again as a new switch, with a fresh request id, after the target's start failed.
 */
function changeSettings(): void {
  requestId = newRequestId();
  isReviewing.value = false;
  switching.refusal.value = null;
}

function submit(): void {
  if (!canSubmit.value) {
    return;
  }

  if (props.mode === "switch" && !isReviewing.value) {
    isReviewing.value = true;

    return;
  }

  if (props.mode === "switch") {
    isReviewing.value = false;
    switchSession();

    return;
  }

  start();
}

watch(
  () => switching.refusalField.value,
  (field) => {
    if (
      field !== null &&
      field in fieldIds &&
      switching.refusal.value !== null
    ) {
      refuseAt(field as FieldKey, switching.refusal.value);
    }
  },
);

// A switch dialog opened again follows the switch already under way by its id, never sending it again.
if (props.mode === "switch") {
  switching.resume();
}

// A reload during a start shows the same start, read by its key; a restore never submits.
if (sentRequestId !== null && props.mode !== "switch") {
  progress.value = props.mode === "resume" ? "Resuming" : "Starting";
  readReceipt();
}

onBeforeUnmount(() => following?.stop());
</script>

<template>
  <Dialog :open="true" :title="titles[mode]" @close="close">
    <form
      class="flex flex-col gap-3"
      @submit.prevent="submit"
      @focusin="noteFocus"
    >
      <template v-if="mode === 'switch'">
        <p class="text-small text-text-3">
          {{ agent.name }} stops its current session first; the new one starts
          once the stop is confirmed. Your draft stays.
        </p>
        <template v-if="isReviewing">
          <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-small">
            <dt class="text-text-3">From</dt>
            <dd class="text-text">
              {{ sourceLabel }}, {{ agentStatus.label }}
            </dd>
            <dt class="text-text-3">To</dt>
            <dd class="text-text">{{ review }}</dd>
            <dt class="text-text-3">Then</dt>
            <dd class="text-text">
              The current turn is interrupted and the session ends before the
              new one starts.
            </dd>
          </dl>
        </template>
        <template v-if="unconfirmedLeg">
          <p class="text-small text-text">{{ unconfirmedLeg }}</p>
          <template v-if="agentStatus.reason">
            <p class="text-small text-text-3">{{ agentStatus.reason }}</p>
          </template>
          <template v-if="legAction">
            <Button variant="bordered" size="small" @click="settleLeg">{{
              legAction.label
            }}</Button>
          </template>
        </template>
        <template v-if="agent.switchStage === 'start_failed'">
          <Button variant="ghost" size="small" @click="changeSettings"
            >Change settings</Button
          >
        </template>
        <template
          v-if="agent.switchStage === 'cancelled' && agent.sessionId === null"
        >
          <p class="text-small text-text">
            {{ sourceLabel }} stopped; {{ targetLabel }} was cancelled.
          </p>
        </template>
      </template>
      <template v-if="mode === 'resume'">
        <fieldset
          :id="fieldIds.conversationId"
          tabindex="-1"
          class="flex flex-col gap-1"
          :aria-describedby="
            fieldRefusal?.field === 'conversationId'
              ? `${fieldIds.conversationId}-description`
              : undefined
          "
        >
          <legend class="text-small text-text-2">Conversation</legend>
          <OptionCards
            v-model="conversationChoice"
            label="Conversation"
            :options="conversationOptions"
          />
          <template v-if="fieldRefusal?.field === 'conversationId'">
            <p
              :id="`${fieldIds.conversationId}-description`"
              class="text-small text-danger"
            >
              {{ fieldRefusal.reason }}
            </p>
          </template>
        </fieldset>
      </template>
      <Field
        :id="fieldIds.driver"
        label="Driver"
        :error="
          fieldRefusal?.field === 'driver' ? fieldRefusal.reason : undefined
        "
      >
        <template #default="{ id, describedBy, invalid }">
          <Select
            :id="id"
            :model-value="driver"
            :options="familyOptions"
            :aria-describedby="describedBy"
            :invalid="invalid"
            @update:model-value="family = $event"
          />
        </template>
      </Field>
      <div class="flex flex-col gap-1">
        <label class="flex items-center gap-2 text-small text-text-2">
          <Toggle
            label="Headless"
            :model-value="driverType === 'headless'"
            :disabled="preview?.isModeLocked === true"
            @update:model-value="chooseHeadless"
          />
          Headless
        </label>
        <template v-if="preview !== null">
          <p class="text-small text-text-3" aria-live="polite">
            {{ preview.label }}: driver type {{ driverTypeSources[preview.driverTypeSource] }},
            driver {{ familySources[preview.familySource] }}.
          </p>
          <template v-if="!preview.canRun">
            <p class="text-small text-danger">
              {{ preview.unavailableReason }}
            </p>
          </template>
        </template>
        <template
          v-if="modeDraft !== 'inherit' && preview?.isModeLocked !== true"
        >
          <TextLink
            variant="quiet"
            class="self-start"
            @click="modeDraft = 'inherit'"
          >
            Use saved or profile setting
          </TextLink>
        </template>
      </div>
      <Field
        :id="fieldIds.model"
        label="Model"
        :error="
          fieldRefusal?.field === 'model' ? fieldRefusal.reason : undefined
        "
      >
        <template #default="{ id, describedBy, invalid }">
          <Select
            :id="id"
            v-model="model"
            :options="modelOptions"
            :aria-describedby="describedBy"
            :invalid="invalid"
          />
        </template>
      </Field>
      <label class="flex items-center gap-2 text-small text-text-2">
        <Toggle v-model="saveDriverType" label="Use as default for this agent" />
        Use as default for this agent
      </label>
      <Field
        :id="fieldIds.accountId"
        label="Account"
        :error="
          fieldRefusal?.field === 'accountId' ? fieldRefusal.reason : undefined
        "
      >
        <template #default="{ id, describedBy, invalid }">
          <template v-if="isAccountReadFailed">
            <p class="text-small text-text-3">
              The accounts could not be read.
              <Button
                variant="bordered"
                size="small"
                @click="readAccounts(driver)"
                >Retry</Button
              >
            </p>
          </template>
          <template v-else-if="accounts.length === 0">
            <p class="text-small text-text-3">
              No account can run this driver.
              <Link :href="accountsPage.url()" class="underline"
                >Add account</Link
              >
            </p>
          </template>
          <template v-else>
            <Select
              :id="id"
              v-model="accountId"
              :options="accountOptions"
              :aria-describedby="describedBy"
              :invalid="invalid"
            />
            <template v-if="isEveryAccountUnavailable">
              <p class="mt-1 text-small text-text-3">
                None of its accounts can start now.
                <Link :href="accountsPage.url()" class="underline"
                  >Open Accounts</Link
                >
              </p>
            </template>
          </template>
        </template>
      </Field>
      <p class="text-small text-text-2">Starts {{ review }}.</p>
      <template v-if="shownProgress">
        <p class="text-small text-text" aria-live="polite">
          {{ shownProgress }}
        </p>
      </template>
      <template v-if="shownRefusal">
        <p class="text-small text-danger" role="alert">{{ shownRefusal }}</p>
      </template>
      <template v-if="fieldRefusal">
        <p class="sr-only" role="alert">{{ fieldRefusal.reason }}</p>
      </template>
    </form>
    <template #footer>
      <Button variant="ghost" @click="close">Close</Button>
      <template v-if="canCancelStart">
        <Button variant="bordered" :pending="isCancelling" @click="cancelStart"
          >Cancel start</Button
        >
      </template>
      <Button variant="primary" :disabled="!canSubmit" @click="submit">
        {{ mode === "switch" && isReviewing ? "Confirm switch" : titles[mode] }}
      </Button>
    </template>
  </Dialog>
</template>
