<script setup lang="ts">
import Avatar from "@kit/Avatar";
import Icon from "@kit/Icon";
import IconButton from "@kit/IconButton";
import Kbd from "@kit/Kbd";
import SegmentedControl from "@kit/SegmentedControl";
import Status from "@kit/Status";
import Toast from "@kit/Toast";
import { useAppContext } from "@kit/appContext";
import { router } from "@inertiajs/vue3";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { sessionLooks } from "../../../sessionLooks";
import { useOpenChats, type ChatViewMode } from "../../../composables/useOpenChats";
import { keyedPost } from "@kit/keyedPost";
import { newRequestId } from "@kit/requestId";
import { createMainAgent } from "@kit/sessionStarts";
import { onNewChatRequest, requestChatList } from "../../../composables/useChatBarAsks";
import { readNewChatChoice } from "../../../newChatChoice";

/**
 * The open chats in Home's one chat bar, so the user moves between several agents: each tab shows the agent, its state
 * and unread count, the chosen one a caret that opens the chat list, and closing one leaves the agent working. New chat
 * (Option+N) opens a tab whose chat asks what runs it, and a switch shows one chat at a time or side by side.
 */
const props = defineProps<{
  agents: AgentOptionData[];
  selectedAgentId: string | undefined;
  // The chats that have a column side by side, which their tabs underline.
  columnAgentIds: string[];
  agentUrl: (agent: AgentOptionData) => string;
  newAgentUrl: (agentId: string) => string;
}>();

const MODES: readonly { value: ChatViewMode; label: string }[] = [
  { value: "one", label: "One at a time" },
  { value: "side", label: "Side by side" },
];

const { viewer, drivers } = useAppContext();
const viewerId = viewer.value.id ?? "guest";
const openChats = useOpenChats(viewerId);
const isOpeningNewChat = ref(false);
const newChatRefusal = ref<string | null>(null);
const closed = ref<{ agent: AgentOptionData; place: number } | null>(null);

const tabs = computed(() =>
  openChats.chats.agentIds.flatMap((id) => props.agents.filter((agent) => agent.id === id && !agent.isRetired)),
);

// The chat shown is always open as a tab, and the most recently used.
watch(
  () => props.selectedAgentId,
  (agentId) => {
    if (agentId !== undefined) {
      openChats.open(agentId);
    }
  },
  { immediate: true },
);

function tabId(agent: AgentOptionData): string {
  return `chat-tab-${agent.id}`;
}

function choose(agent: AgentOptionData): void {
  router.visit(props.agentUrl(agent), { preserveScroll: true });
}

function close(agent: AgentOptionData): void {
  const place = tabs.value.indexOf(agent);
  openChats.close(agent.id);
  closed.value = { agent, place };
  const neighbour = tabs.value[Math.min(place, tabs.value.length - 1)];

  if (agent.id === props.selectedAgentId && neighbour !== undefined) {
    choose(neighbour);
  }
}

function undoClose(): void {
  const undone = closed.value;

  if (undone !== null) {
    openChats.restore(undone.agent.id, undone.place);
    closed.value = null;
  }
}

function moveFrom(agent: AgentOptionData, step: 1 | -1): void {
  const place = tabs.value.indexOf(agent);
  const next = tabs.value[(place + step + tabs.value.length) % tabs.value.length];
  document.getElementById(tabId(next))?.focus();
  choose(next);
}

function pressOnTab(event: KeyboardEvent, agent: AgentOptionData): void {
  const actions: Record<string, () => void> = {
    ArrowRight: () => moveFrom(agent, 1),
    ArrowLeft: () => moveFrom(agent, -1),
    Delete: () => close(agent),
  };

  if (event.key in actions) {
    event.preventDefault();
    actions[event.key]();
  }
}

function opened(agentId: string): void {
  openChats.open(agentId);
  router.visit(props.newAgentUrl(agentId), { preserveScroll: true });
}

/**
 * Makes the new chat's agent at once, on the driver last chosen for a new chat, and opens its tab: its chat shows the
 * start picker, where the user chooses what runs it and starts it.
 */
function openNewChat(): void {
  const last = readNewChatChoice(viewerId);
  const family = last?.family ?? drivers.value[0]?.family;

  if (isOpeningNewChat.value || family === undefined) {
    return;
  }

  const requestId = newRequestId();
  isOpeningNewChat.value = true;
  newChatRefusal.value = null;
  keyedPost(
    createMainAgent.url(),
    { requestId, driver: family, model: last?.model ?? "default", accountId: null, accountRevision: null },
    requestId,
    {
      onAccepted: (flash) => {
        if (typeof flash.createdAgentId === "string") {
          opened(flash.createdAgentId);
        }
      },
      onRefused: (reason) => (newChatRefusal.value = reason ?? "The new chat could not be opened."),
      onUncertain: () => (newChatRefusal.value = "We could not confirm the new chat opened; look in the chat list."),
      onFinish: () => (isOpeningNewChat.value = false),
    },
  );
}

onNewChatRequest(openNewChat);

function openOnShortcut(event: KeyboardEvent): void {
  if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyN") {
    event.preventDefault();
    openNewChat();
  }
}


onMounted(() => window.addEventListener("keydown", openOnShortcut));
onBeforeUnmount(() => window.removeEventListener("keydown", openOnShortcut));
</script>

<template>
  <div class="@container/bar flex h-full w-full min-w-0 items-stretch gap-1" data-chat-tabs>
    <div class="flex min-w-0 items-stretch overflow-x-auto" role="tablist" aria-label="Open chats">
      <template v-for="agent in tabs" :key="agent.id">
        <div
          class="group/tab flex items-center gap-1.5 border-r border-line px-2.5 text-small"
          :class="agent.id === selectedAgentId ? 'bg-bg text-text' : 'text-text-2 hover:bg-hover'"
        >
          <button
            :id="tabId(agent)"
            type="button"
            role="tab"
            :aria-selected="agent.id === selectedAgentId"
            :tabindex="agent.id === selectedAgentId ? 0 : -1"
            :data-chat-tab="agent.id"
            class="flex items-center gap-1.5 whitespace-nowrap"
            :class="columnAgentIds.includes(agent.id) && 'underline underline-offset-4'"
            @click="choose(agent)"
            @keydown="pressOnTab($event, agent)"
          >
            <Avatar :participant="{ kind: 'agent', driver: agent.sessionDriver ?? '' }" />
            <span>{{ agent.isMain ? `${agent.name} · main` : agent.name }}</span>
            <Status :state="sessionLooks[agent.status.sessionState]" label="" />
            <template v-if="agent.unreadCount > 0">
              <span class="font-medium text-text" :aria-label="`${agent.unreadCount} unread`">{{
                agent.unreadCount
              }}</span>
            </template>
          </button>
          <template v-if="agent.id === selectedAgentId">
            <IconButton
              icon="caret"
              size="xs"
              :tooltip="false"
              :label="`The chat list, from ${agent.name}'s chat`"
              :data-tab-caret="agent.id"
              @click="requestChatList(agent.id)"
            />
          </template>
          <IconButton
            icon="close"
            size="xs"
            :tooltip="false"
            :label="`Close the tab of ${agent.name}`"
            class="opacity-0 group-hover/tab:opacity-100 focus-visible:opacity-100"
            :data-close-tab="agent.id"
            @click="close(agent)"
          />
        </div>
      </template>
    </div>
    <button
      type="button"
      class="flex items-center gap-1.5 px-2.5 text-small text-text-2 hover:bg-hover"
      :aria-busy="isOpeningNewChat"
      title="New chat · ⌥N"
      data-new-chat-tab
      @click="openNewChat"
    >
      <Icon name="plus" :size="14" />
      <span class="@max-[820px]/bar:hidden">New chat</span>
      <Kbd class="@max-[820px]/bar:hidden" variant="bare" decorative>⌥N</Kbd>
    </button>
    <span class="flex-1"></span>
    <span class="flex items-center pr-1">
      <SegmentedControl
        :model-value="openChats.chats.mode"
        label="How the open chats show"
        :items="MODES"
        data-view-mode
        @update:model-value="(mode: ChatViewMode) => openChats.show(mode)"
      />
    </span>
    <template v-if="newChatRefusal">
      <p class="flex items-center px-2 text-small text-danger" role="alert" data-new-chat-refusal>{{ newChatRefusal }}</p>
    </template>
    <template v-if="closed">
      <Toast
        :text="`Closed the tab of ${closed.agent.name}; it keeps working.`"
        undo
        @undo="undoClose"
        @close="closed = null"
      />
    </template>
  </div>
</template>
