<script setup lang="ts">
import { usePage } from "@inertiajs/vue3";
import { computed, ref, useTemplateRef } from "vue";
import type { AgentOptionData, ChatData } from "@generated/types/chat";
import Avatar from "@kit/Avatar";
import Icon from "@kit/Icon";
import Status from "@kit/Status";
import { useAppContext } from "@kit/appContext";
import { agentUrl, newAgentUrl } from "../../agentLinks";
import { useOpenChats } from "../../composables/useOpenChats";
import ChatTabs from "./partials/ChatTabs.vue";
import SessionForm from "./partials/SessionForm.vue";
import { useOpenSessionDialog } from "../../composables/useChosenAgent";
import { sessionLooks } from "../../sessionLooks";
import ConversationMenu from "./partials/ConversationMenu.vue";
import AgentSessionActions from "./partials/AgentSessionActions.vue";
import { useStatusAnnouncement } from "../../composables/useStatusAnnouncement";

/**
 * Home's agent bar: the chosen agent with the state its evidence gives, in a mark and words of their own, why a start
 * was refused and its one next step wrapped below, how old the host's last report is when the state is unknown, a
 * menu to choose another, and the actions its status offers. Choosing another agent changes only the view.
 */
const props = defineProps<{ data: ChatData }>();

const page = usePage();
const viewerId = useAppContext().viewer.value.id ?? "guest";
const openChats = useOpenChats(viewerId);
// The chosen agent's Switch driver dialog, opened from the chat list; it comes back after a chat switch or a reload.
const switchDialog = computed(() =>
  props.data.selectedAgentId === undefined ? undefined : useOpenSessionDialog(viewerId, props.data.selectedAgentId),
);
const isSwitchOpen = ref(switchDialog.value?.read() === "switch");

function openSwitch(): void {
  isSwitchOpen.value = true;
  switchDialog.value?.keep("switch");
}

function closeSwitch(): void {
  isSwitchOpen.value = false;
  switchDialog.value?.forget();
  document.querySelector<HTMLElement>("[data-chat-list-trigger]")?.focus();
}
const tabRow = useTemplateRef<InstanceType<typeof ChatTabs>>("tabRow");

// Opening a chat beside this one opens its tab and shows the open chats side by side.
function openBeside(agent: AgentOptionData): void {
  openChats.open(agent.id);
  openChats.open(props.data.selectedAgentId ?? agent.id);
  openChats.show("side");
}

// The chats that have a column now: the chosen one, and side by side those beside it.
const columnAgentIds = computed(() =>
  openChats.chats.mode === "side" && props.data.selectedAgentId !== undefined
    ? [props.data.selectedAgentId, ...openChats.besideOf(props.data.selectedAgentId)]
    : [],
);
const selected = computed(() =>
  props.data.agents.find((agent) => agent.id === props.data.selectedAgentId),
);
const status = computed(() => selected.value?.status);
const announcement = useStatusAnnouncement(
  () => status.value,
  () => isSwitchOpen.value,
);

// The second line names what runs the agent: its driver and model while a session runs, else the profile it starts from.
const subline = computed(() => {
  const agent = selected.value;

  if (agent === undefined) {
    return "";
  }

  if (agent.sessionDriverLabel === null) {
    return agent.profileKey;
  }

  return [agent.sessionDriverLabel, agent.sessionModel]
    .filter((part) => part !== null && part !== "")
    .join(" · ");
});
</script>

<template>
  <div class="relative z-90 flex flex-1 flex-wrap items-center gap-2">
    <ChatTabs
      ref="tabRow"
      :agents="data.agents"
      :selected-agent-id="data.selectedAgentId"
      :column-agent-ids="columnAgentIds"
      :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
      :new-agent-url="(agentId: string) => newAgentUrl(page.url, agentId)"
    />
    <div class="relative">
      <ConversationMenu
        :agents="data.agents"
        :selected-agent-id="data.selectedAgentId"
        :open-agent-ids="openChats.chats.agentIds"
        @new-chat="tabRow?.openNewChat()"
        @open-beside="openBeside"
        @switch-driver="openSwitch"
        :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
      >
        <template #trigger>
        <template v-if="selected">
          <Avatar
            :participant="{
              kind: 'agent',
              driver: selected.sessionDriver ?? '',
            }"
            size="lg"
          />
          <span class="flex min-w-0 flex-col leading-[1.25] whitespace-nowrap">
            <span class="text-body text-text">{{
              selected.isMain ? `${selected.name} · main` : selected.name
            }}</span>
            <small class="max-w-[340px] truncate text-badge text-text-3">{{ subline }}</small>
          </span>
        </template>
        <template v-else>
          <span class="font-semibold text-text">Choose an agent</span>
        </template>
        <Icon name="caret" :size="14" />
        </template>
      </ConversationMenu>
      <template v-if="status?.reason">
        <p class="max-w-[60ch] px-1.5 text-small break-words text-danger">
          {{ status.reason }}
          <template v-if="status.remedy">
            <span class="text-text-2">{{ status.remedy }}</span>
          </template>
        </p>
      </template>
      <template
        v-if="
          status?.sessionState === 'unknown' &&
          status.observationAgeSeconds !== null
        "
      >
        <p class="px-1.5 text-small text-text-3">
          Last report {{ status.observationAgeSeconds }} s ago
        </p>
      </template>
    </div>
    <template v-if="status">
      <Status
        class="ml-1"
        :state="sessionLooks[status.sessionState]"
        :label="status.label"
        secondary
      />
    </template>
    <template v-if="data.isSetupRequired">
      <span class="text-small text-text-3"
        >No main agent yet: run <code>php artisan agents:install</code>.</span
      >
    </template>
    <span class="flex-1"></span>
    <template v-if="selected">
      <AgentSessionActions :agent="selected" />
    </template>
    <template v-if="selected && isSwitchOpen">
      <SessionForm :key="selected.id" :agent="selected" @close="closeSwitch" />
    </template>
    <p class="sr-only" aria-live="polite">{{ announcement.polite.value }}</p>
    <p class="sr-only" role="alert">{{ announcement.alert.value }}</p>
  </div>
</template>
