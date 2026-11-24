<script setup lang="ts">
import TextLink from "@kit/TextLink";
import { router, usePage } from "@inertiajs/vue3";
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
import { arrivalAnnouncement } from "../../../composables/arrivalAnnouncement";
import { useChatTimeline } from "../../../composables/useChatTimeline";
import { openedRecordOf, recordKey } from "../../../recordPanel";
import { useChosenAgent } from "../../../composables/useChosenAgent";
import { useConversationIntents } from "../../../composables/useConversationIntents";
import { handOverText, useHandOver } from "../../../composables/useHandOver";
import { draftKey } from "../../../composables/useMessageDrafts";
import type { AgentOptionData, ChatData } from "@generated/types/chat";
import type { DockCardEnvelope } from "@kit/dockCards";
import type { ReplyTarget } from "../../../composables/useConversationIntents";
import AvatarStack from "@kit/AvatarStack";
import Button from "@kit/Button";
import IconButton from "@kit/IconButton";
import Popover from "@kit/Popover";
import { isRevealed } from "@kit/protectedView";
import { liveStage, retryLiveConnection } from "@kit/liveConnection";
import SlotSections from "@kit/SlotSections";
import { read as readRoute } from "@generated/routes/chat";
import AgentPicker from "./AgentPicker.vue";
import AgentSessionActions from "./AgentSessionActions.vue";
import Composer from "./Composer.vue";
import VerifyingSessionCard from "./VerifyingSessionCard.vue";
import RecordPanel from "./RecordPanel.vue";
import DockStack from "./DockStack.vue";
import MessageList from "./MessageList.vue";
import ChatRoster from "./ChatRoster.vue";
import { chatRoster } from "../../../composables/useChatRoster";
import { AGENT_BAR_MEMBERS } from "../../../agentBarMembers";
import InboxSelector from "./InboxSelector.vue";

/**
 * The chat: the chosen agent's conversation, what other domains suggest in the dock slot, the sources
 * docked in the conversation and the composer. On Chat's own page it also offers the agents and their session actions, which
 * Home's agent bar offers instead.
 */
const props = defineProps<{
  chat: ChatData;
  offersChoice: boolean;
  agentUrl: (agent: AgentOptionData) => string;
  chatUrl: (inboxId: string) => string;
  loadMore: (token: string) => void;
  protectedProp: string;
}>();

const page = usePage();
const conversation = computed(() => props.chat.conversation);
// The members as their avatars: agents by their driver's mark, users by their initial.
const members = computed(() =>
  (conversation.value?.participants ?? []).map((member) => ({
    kind: member.driver === null ? ("user" as const) : ("agent" as const),
    driver: member.driver ?? undefined,
    initials: member.label.slice(0, 1).toUpperCase(),
    name: member.label,
  })),
);
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
  const user = page.props.currentUser;

  return conversation.value === undefined || !user
    ? undefined
    : useChosenAgent(user.id, conversation.value.inboxId);
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

function chooseAgent(agentId: string): void {
  chosenAgentId.value = agentId;
  chosenStore.value?.keep(agentId);
}
const selected = computed(() => {
  const ids = agentIdsInChat.value;
  const wanted =
    chosenAgentId.value !== null && ids.includes(chosenAgentId.value)
      ? chosenAgentId.value
      : (conversation.value?.agentId ?? ids[0]);

  return props.chat.agents.find((agent) => agent.id === wanted);
});
const key = computed(() => {
  const user = page.props.currentUser;

  return conversation.value === undefined || !user
    ? undefined
    : draftKey(user.id, conversation.value.inboxId);
});
const replyingTo = ref<ReplyTarget | null>(null);

/**
 * This view's own entries of the chat, merged by id in order, and paged back on request.
 */
const timeline = useChatTimeline(conversation);

// A room the viewer lost takes the focus with it: the keyboard continues from the chat selector.
watch(timeline.accessEnded, (ended) => {
  if (ended) {
    void nextTick(() => document.getElementById("chat-selector")?.focus());
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

// A record let go on this chat's agent is sent here once the chat has opened, as the hand-over's message.
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
        text: handOverText(handed),
        agent: handed.agentId,
        expectedSessionId: opened.sessionId,
        expectedGeneration: opened.sessionGeneration,
        inboxId: opened.inboxId,
      }),
      props.protectedProp,
    );
  },
  { immediate: true },
);

/**
 * Each new message or question by someone else, said once in the polite region; a chat opened afresh starts quiet.
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
 * nothing. It runs when the user opens the
 * conversation or asks for it, never on a background refresh.
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

// The members of this chat sit in Home's agent bar, right after the agent, while the bar shows; elsewhere above the chat.
const isBarShown = ref(false);
const membersRow = useTemplateRef<HTMLElement>("membersRow");
onMounted(() => {
  isBarShown.value = document.getElementById(AGENT_BAR_MEMBERS) !== null;
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
      <InboxSelector
        :chats="chat.chats"
        :selected-inbox-id="conversation?.inboxId"
        :can-create-chats="chat.canCreateChats"
        :chat-url="chatUrl"
      />
    </template>
    <template v-if="offersChoice">
      <AgentPicker
        :agents="chat.agents"
        :selected-agent-id="chat.selectedAgentId"
        :agent-url="agentUrl"
      />
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
    <template v-if="conversation && key">
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
      <Teleport :to="`#${AGENT_BAR_MEMBERS}`" :disabled="!isBarShown">
        <div
          ref="membersRow"
          class="flex items-center justify-end gap-1.5"
          aria-label="Who is in this chat"
        >
          <template v-if="conversation.participants.length > 2">
            <Button
              size="small"
              variant="ghost"
              :aria-expanded="chatRoster.isOpen"
              aria-haspopup="dialog"
              @click="chatRoster.isOpen = !chatRoster.isOpen"
            >
              <AvatarStack :members="members" />
              {{ conversation.participants.length }} in this chat
            </Button>
          </template>
          <IconButton
            icon="userplus"
            label="Add someone to this chat"
            haspopup="dialog"
            :expanded="chatRoster.isOpen"
            @click="chatRoster.isOpen = !chatRoster.isOpen"
          />
          <Teleport to="body">
            <Popover
              v-model:open="chatRoster.isOpen"
              label="Members of this chat"
              :anchor="membersRow"
              :align="isBarShown ? 'left' : 'right'"
              :width="320"
            >
              <ChatRoster
                :conversation="conversation"
                :conversation-prop="protectedProp"
                :chosen-agent-id="selected?.id ?? null"
                @choose-agent="chooseAgent"
              />
            </Popover>
          </Teleport>
        </div>
      </Teleport>
      <template v-if="isShown">
        <MessageList
          :entries="timeline.entries.value"
          :has-older="timeline.hasOlder.value"
          :pending="pending"
          :refused="refused"
          :viewer="conversation.viewer"
          :participants="conversation.participants"
          :conversation-prop="protectedProp"
          :inbox-id="conversation.inboxId"
          @reply="(target) => (replyingTo = target)"
          @older="timeline.loadOlder"
          @check-again="(intent) => owner?.retry(intent, protectedProp)"
          @restore="(intentKey) => owner?.restore(intentKey)"
          @discard="(intentKey) => owner?.discardRecovery(intentKey)"
          @open-record="openRecord"
        />
        <template v-if="openedRecord !== null">
          <RecordPanel :card="openedRecord" @close="closeRecord" />
        </template>
        <p role="status" aria-live="polite" class="sr-only">
          {{ owner?.announcement.value }} {{ arrival }}
        </p>
        <template v-if="unreadShown.length > 0">
          <p class="flex items-center gap-2 text-small text-text-3">
            <TextLink @click="readShown"> Read shown messages </TextLink>
            <span>Only your own reading changes.</span>
          </p>
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
        <Composer
          :draft-key="key"
          :agent="agentIdsInChat.length === 1 ? (selected?.id ?? null) : null"
          :addressee-name="selected?.name ?? null"
          :session-id="conversation.sessionId"
          :session-generation="conversation.sessionGeneration"
          :inbox-id="conversation.inboxId"
          :replying-to="replyingTo"
          :conversation-prop="protectedProp"
          @replied="replyingTo = null"
          @cancel-reply="replyingTo = null"
        />
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
