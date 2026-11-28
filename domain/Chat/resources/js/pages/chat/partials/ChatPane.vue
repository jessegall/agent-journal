<script setup lang="ts">
import { useAppContext } from "@kit/appContext";
import { router } from "@inertiajs/vue3";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { arrivalAnnouncement } from "../../../composables/arrivalAnnouncement";
import { useChatTimeline } from "../../../composables/useChatTimeline";
import { openedRecordOf, recordKey } from "../../../recordPanel";
import { useChosenAgent, useOpenSessionDialog } from "../../../composables/useChosenAgent";
import { useConversationIntents } from "../../../composables/useConversationIntents";
import { useHandOver } from "../../../composables/useHandOver";
import { draftKey } from "../../../composables/useMessageDrafts";
import type { AgentOptionData, ChatData } from "@generated/types/chat";
import type { DockCardEnvelope } from "@kit/dockCards";
import type { ReplyTarget } from "../../../composables/useConversationIntents";
import Button from "@kit/Button";
import Icon from "@kit/Icon";
import LayoutEmptyPage from "@kit/LayoutEmptyPage";
import { isRevealed } from "@kit/protectedView";
import { liveStage, retryLiveConnection } from "@kit/liveConnection";
import SlotSections from "@kit/SlotSections";
import { read as readRoute, retryDelivery as retryDeliveryRoute } from "@generated/routes/chat";
import { keyedPost } from "@kit/keyedPost";
import { newRequestId } from "@kit/requestId";
import AgentSessionActions from "./AgentSessionActions.vue";
import Composer from "./Composer.vue";
import RunningCommand from "./RunningCommand.vue";
import AgentRow from "./AgentRow.vue";
import StartPicker from "./StartPicker.vue";
import AgentLogPanel from "./AgentLogPanel.vue";
import DebugLines from "./DebugLines.vue";
import VerifyingSessionCard from "./VerifyingSessionCard.vue";
import RecordPanel from "./RecordPanel.vue";
import DockStack from "./DockStack.vue";
import MessageList from "./MessageList.vue";
import ConversationMenu from "./ConversationMenu.vue";
import { useChatListShortcut } from "../../../composables/useChatBarAsks";
import SessionForm from "./SessionForm.vue";

/**
 * The chat: the chosen agent's conversation, what other domains suggest in the dock slot, the sources docked in the
 * conversation and the composer, with the agent named above it. A chat with no session offers the start picker in the
 * composer's place. On Chat's own page it offers the chat list itself. Group chats are hidden for now.
 */
const props = defineProps<{
  chat: ChatData;
  offersChoice: boolean;
  loadMore: (token: string) => void;
  protectedProp: string;
}>();

const { viewer } = useAppContext();
const conversation = computed(() => props.chat.conversation);
/**
 * The agent whose session controls show: the one chosen from the roster, else the chat's own agent, else the first
 * agent in it. Each agent keeps its own controls, keyed by its id and session generation; a chat with no agent has
 * none.
 */
const chosenAgentId = ref<string | null>(null);
const agentIdsInChat = computed(() =>
  (conversation.value?.participants ?? [])
    .filter((member) => member.actor.startsWith("agent:"))
    .map((member) => member.actor.slice("agent:".length)),
);
const chosenStore = computed(() => {
  const userId = viewer.value.id;

  return conversation.value === undefined || userId === undefined
    ? undefined
    : useChosenAgent(userId, conversation.value.inboxId);
});

// Each chat shows the agent last chosen there in this tab; one removed from the chat is forgotten and drops its controls.
watch(
  [chosenStore, agentIdsInChat],
  ([store, ids]) => {
    const kept = store?.read() ?? null;

    if (kept !== null && !ids.includes(kept)) {
      store?.forget();
    }

    chosenAgentId.value = kept !== null && ids.includes(kept) ? kept : null;
  },
  { immediate: true },
);

const selected = computed(() => {
  const ids = agentIdsInChat.value;
  const wanted =
    chosenAgentId.value !== null && ids.includes(chosenAgentId.value)
      ? chosenAgentId.value
      : (conversation.value?.agentId ?? ids[0]);

  return props.chat.agents.find((agent) => agent.id === wanted);
});
// A chat whose agent runs no session, new or ended, offers the start picker in place of the composer; a new one, which
// holds nothing yet, shows only the picker.
const needsStart = computed(
  () => selected.value !== undefined && selected.value.sessionId === null && !selected.value.isRetired,
);
const isNewChat = computed(() => needsStart.value && (conversation.value?.entries.length ?? 0) === 0);
// On its own page the chat offers its own list, so Option+F opens it; on Home the chat bar's listener does.
useChatListShortcut(() => (props.offersChoice ? selected.value?.id : undefined));
// The chosen agent while its status offers to stop its turn: the composer then shows Stop beside Send.
const workingAgent = computed(
  () =>
    selected.value?.status.actions.some(
      (action) => action.type === "interrupt",
    ) === true
      ? selected.value
      : null,
);
// While the chosen agent starts, the user's last messages wait under their bubble for it.
const startWait = computed(() =>
  selected.value?.status.sessionState === "starting"
    ? `Waiting for ${selected.value.name} to start`
    : null,
);
/**
 * Queues one of the user's messages that was not delivered again, once under a new request id; a stopped agent is
 * started for it, and its ticks walk again as the chat reads it.
 */
const retryRefusal = ref<string | null>(null);

function retryDelivery(messageId: string): void {
  const requestId = newRequestId();
  retryRefusal.value = null;
  keyedPost(
    retryDeliveryRoute().url,
    {
      messageId,
      agent: selected.value?.id ?? null,
      expectedSessionId: conversation.value?.sessionId ?? null,
    },
    requestId,
    {
      onAccepted: () => undefined,
      onRefused: (reason) => (retryRefusal.value = reason ?? "The message could not be queued again."),
      onUncertain: () => (retryRefusal.value = "We could not confirm the retry; the chat shows where it stands."),
    },
    [props.protectedProp],
  );
}
const key = computed(() => {
  const userId = viewer.value.id;

  return conversation.value === undefined || userId === undefined
    ? undefined
    : draftKey(userId, conversation.value.inboxId);
});
const replyingTo = ref<ReplyTarget | null>(null);
// The chosen agent's Switch driver dialog, opened from its chat list; it comes back after a chat switch or a reload.
const switchDialog = computed(() =>
  selected.value === undefined || viewer.value.id === undefined
    ? undefined
    : useOpenSessionDialog(viewer.value.id, selected.value.id),
);
// Technical details, open at a line or at its top; the panel reads the agent's log only once it opens.
const agentLogAt = ref<{ lineId: string | null } | null>(null);
const isSwitchOpen = ref(switchDialog.value?.read() === "switch");

function openSwitch(): void {
  isSwitchOpen.value = true;
  switchDialog.value?.keep("switch");
}

function closeSwitch(): void {
  isSwitchOpen.value = false;
  switchDialog.value?.forget();
}

/**
 * This view's own entries of the chat, merged by id in order, and paged back on request.
 */
const timeline = useChatTimeline(conversation);

// A room the viewer lost takes the focus with it: the keyboard continues from the chat list's trigger.
watch(timeline.accessEnded, (ended) => {
  if (ended) {
    void nextTick(() =>
      document.querySelector<HTMLElement>("[data-chat-list-trigger]")?.focus(),
    );
  }
});

/**
 * The owner of the user's sends in this conversation, the same one Home and Chat's page share.
 */
const owner = computed(() =>
  key.value === undefined ? undefined : useConversationIntents(key.value),
);
const shownRows = computed(
  () => owner.value?.rows(timeline.entries.value) ?? [],
);
const pending = computed(() =>
  shownRows.value.flatMap((row) => (row.kind === "intent" ? [row.intent] : [])),
);
const refused = computed(() =>
  (owner.value?.recoveryEntries() ?? []).map((entry) => ({
    entry,
    reason: owner.value?.refusalOf(entry.intentKey) ?? "",
  })),
);

/**
 * The record a chat event shows, open beside the chat: the one the user chose, else the newest that still runs, such
 * as a sequence on its way; it closes when it ends, and stays closed once the user closes it.
 */
const chosenRecord = ref<string | null>(null);
const closedRecords = ref<string[]>([]);
const panelCards = computed(() =>
  timeline.entries.value.flatMap((entry) =>
    entry.event === undefined ? [] : [entry.event],
  ),
);
const openedRecord = computed(() =>
  openedRecordOf(panelCards.value, chosenRecord.value, closedRecords.value),
);

function openRecord(card: DockCardEnvelope): void {
  chosenRecord.value = recordKey(card);
}

function closeRecord(): void {
  const shown = openedRecord.value;
  chosenRecord.value = null;

  if (shown !== null) {
    closedRecords.value = [...closedRecords.value, recordKey(shown)];
  }
}

// A read that returned the user's own sends settles them.
watch(timeline.entries, () => owner.value?.settle());

// A message waiting for this chat's agent, a handed record or a new chat's first message, is sent once the chat opens.
const handOver = useHandOver();
watch(
  [owner, () => selected.value?.id ?? null],
  ([sender, agentId]) => {
    const opened = conversation.value;

    if (
      sender === undefined ||
      opened === undefined ||
      key.value === undefined
    ) {
      return;
    }

    const handed = handOver.takeFor(agentId);

    if (handed === null) {
      return;
    }

    sender.submit(
      sender.beginSend({
        draftKey: key.value,
        text: handed.text,
        agent: handed.agentId,
        expectedSessionId: opened.sessionId,
        inboxId: opened.inboxId,
      }),
      props.protectedProp,
    );
  },
  { immediate: true },
);

/**
 * Each new message or question by someone else, announced once in the polite region; a chat opened afresh starts quiet.
 */
const arrival = ref<string | null>(null);
function freshAnnouncer(): ReturnType<typeof arrivalAnnouncement> {
  return arrivalAnnouncement(() => conversation.value?.viewer ?? "");
}

let announceArrivals = freshAnnouncer();
watch(
  () => conversation.value?.inboxId,
  () => (announceArrivals = freshAnnouncer()),
);
watch(timeline.entries, (entries) => {
  const said = announceArrivals(entries);

  if (said !== null) {
    arrival.value = said;
  }
});
const unreadShown = timeline.unreadShown;

/**
 * Marks the messages by others this view shows as read by the viewer alone; acknowledging one already read changes
 * nothing. It runs when the user opens the conversation, and when a message arrives or the page comes back into view
 * while the user can see it.
 */
function readShown(): void {
  const shown = conversation.value;

  if (shown === undefined || unreadShown.value.length === 0) {
    return;
  }

  router.post(
    readRoute().url,
    {
      inboxId: shown.inboxId,
      messageIds: unreadShown.value,
      agent: shown.agentId,
    },
    { preserveScroll: true, preserveState: true },
  );
}

/**
 * Whether an authorized read that included this chat's prop answered; until then the conversation stays hidden.
 */
const isShown = computed(() => isRevealed(props.protectedProp));

let openedConversationId: string | undefined;

/**
 * Reads what the conversation shows once each time the user opens a conversation, when it is first shown; showing
 * the same conversation again after a reload reads nothing.
 */
function readOnOpen(): void {
  const id = conversation.value?.inboxId;

  if (!isShown.value || id === undefined || id === openedConversationId) {
    return;
  }

  openedConversationId = id;
  readShown();
}

onMounted(readOnOpen);

/**
 * Whether the user can see the page now: it is in view and its window has the focus.
 */
function isSeen(): boolean {
  return document.visibilityState === "visible" && document.hasFocus();
}

function readWhenSeen(): void {
  if (isShown.value && isSeen()) {
    readShown();
  }
}

watch(() => unreadShown.value.length, readWhenSeen);
onMounted(() => {
  window.addEventListener("focus", readWhenSeen);
  document.addEventListener("visibilitychange", readWhenSeen);
});
onUnmounted(() => {
  window.removeEventListener("focus", readWhenSeen);
  document.removeEventListener("visibilitychange", readWhenSeen);
});

watch(
  () => conversation.value?.inboxId,
  () => {
    replyingTo.value = null;
    readOnOpen();
  },
);
watch(isShown, readOnOpen);
</script>

<template>
  <section
    class="@container flex h-full min-h-0 flex-col gap-2 px-[clamp(16px,4%,24px)]"
    aria-label="Chat"
  >
    <template v-if="offersChoice">
      <div class="border-b border-border py-2">
        <ConversationMenu
          :agents="chat.agents"
          :selected-agent-id="chat.selectedAgentId"
          :open-agent-ids="selected ? [selected.id] : []"
          @switch-driver="openSwitch"
          @technical-details="agentLogAt = { lineId: null }"
        >
          <template #trigger>
            <span class="text-body text-text">{{
              selected?.name ?? "Choose an agent"
            }}</span>
            <Icon name="caret" :size="14" />
          </template>
        </ConversationMenu>
      </div>
    </template>
    <template v-if="isSwitchOpen && selected">
      <SessionForm :key="selected.id" :agent="selected" @close="closeSwitch" />
    </template>
    <template v-if="offersChoice && chat.isSetupRequired">
      <p class="text-small text-text-3">
        This installation has no main agent yet. Run
        <code>php artisan agents:install</code> to create it.
      </p>
    </template>
    <template v-if="chat.setupNotice">
      <p class="text-small text-text-2">{{ chat.setupNotice }}</p>
    </template>
    <template v-if="chat.noAccounts">
      <LayoutEmptyPage :part="chat.noAccounts" />
    </template>
    <template v-else-if="conversation && key">
      <template v-if="offersChoice && selected">
        <section
          id="chosen-agent-controls"
          :aria-label="`Session controls for ${selected.name}`"
        >
          <AgentSessionActions
            :key="`${selected.id}-${selected.sessionGeneration}`"
            :agent="selected"
          />
        </section>
        <p role="status" aria-live="polite" class="sr-only">
          Session controls for {{ selected.name }}
        </p>
      </template>
      <template v-if="isShown">
        <template v-if="isNewChat && selected">
          <div class="flex min-h-0 flex-1 flex-col justify-center" data-new-chat>
            <StartPicker :agent="selected" :is-new="true" />
          </div>
        </template>
        <template v-else>
          <MessageList
            :entries="timeline.entries.value"
            :has-older="timeline.hasOlder.value"
            :pending="pending"
            :refused="refused"
            :viewer="conversation.viewer"
            :participants="conversation.participants"
            :conversation-prop="protectedProp"
            :inbox-id="conversation.inboxId"
            :start-wait="startWait"
            :addressee-name="selected?.name ?? 'the chat'"
            @retry-delivery="retryDelivery"
            @reply="(target) => (replyingTo = target)"
            @older="timeline.loadOlder"
            @check-again="(intent) => owner?.retry(intent, protectedProp)"
            @restore="(intentKey) => owner?.restore(intentKey)"
            @discard="(intentKey) => owner?.discardRecovery(intentKey)"
            @open-record="openRecord"
          />
          <template v-if="retryRefusal">
            <p class="text-small text-danger" role="alert">{{ retryRefusal }}</p>
          </template>
          <DebugLines :lines="conversation.debugLines" @open="(lineId) => (agentLogAt = { lineId })" />
          <template v-if="agentLogAt !== null && selected">
            <AgentLogPanel
              :key="selected.id"
              :agent-id="selected.id"
              :agent-name="selected.name"
              :opened-at="agentLogAt.lineId"
              @close="agentLogAt = null"
            />
          </template>
          <template v-if="openedRecord !== null">
            <RecordPanel :card="openedRecord" @close="closeRecord" />
          </template>
          <p role="status" aria-live="polite" class="sr-only">
            {{ owner?.announcement.value }} {{ arrival }}
          </p>
          <template v-if="selected && !needsStart && !offersChoice">
            <AgentRow
              :agent="selected"
              :agents="chat.agents"
              :inbox-id="conversation.inboxId"
              :seed="conversation.runningCommand"
              @switch-driver="openSwitch"
              @technical-details="agentLogAt = { lineId: null }"
            />
          </template>
          <template v-else-if="selected && !needsStart">
            <RunningCommand
              :agent="selected"
              :inbox-id="conversation.inboxId"
              :seed="conversation.runningCommand"
            />
          </template>
          <SlotSections :sections="chat.dockSections" />
          <DockStack
            :key="conversation.inboxId"
            :dock="conversation.dock"
            :inbox-id="conversation.inboxId"
            :load-more="loadMore"
          />
          <template v-if="selected">
            <VerifyingSessionCard :agent="selected" />
          </template>
          <template v-if="needsStart && selected">
            <StartPicker :agent="selected" :is-new="false" />
          </template>
          <template v-else>
            <Composer
              :draft-key="key"
              :agent="agentIdsInChat.length === 1 ? (selected?.id ?? null) : null"
              :addressee-name="selected?.name ?? null"
              :session-id="conversation.sessionId"
              :inbox-id="conversation.inboxId"
              :replying-to="replyingTo"
              :conversation-prop="protectedProp"
              :working-agent="workingAgent"
              @replied="replyingTo = null"
              @cancel-reply="replyingTo = null"
            />
          </template>
          <template v-if="liveStage === 'refused'">
            <p
              role="status"
              class="flex items-center gap-2 text-small text-text-3"
            >
              Disconnected. The messages, your place and your draft are kept.
              <Button
                size="small"
                variant="bordered"
                @click="retryLiveConnection()"
                >Reconnect</Button
              >
            </p>
          </template>
        </template>
      </template>
      <template v-else>
        <p class="m-auto text-empty text-text-3" role="status">
          Loading the conversation…
        </p>
      </template>
    </template>
    <template v-else>
      <p class="m-auto text-empty text-text-3">Choose an agent to talk to.</p>
    </template>
  </section>
</template>
