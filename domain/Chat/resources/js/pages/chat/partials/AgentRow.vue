<script setup lang="ts">
import Avatar from "@kit/Avatar";
import Icon from "@kit/Icon";
import Status from "@kit/Status";
import { useAppContext } from "@kit/appContext";
import { computed } from "vue";
import type { AgentOptionData, AgentPageCursorData } from "@generated/types/chat";
import type { RunningCommandData } from "@kit/runningCommands";
import { requestNewChat } from "../../../composables/useChatBarAsks";
import { useOpenChats } from "../../../composables/useOpenChats";
import { sessionLooks } from "../../../sessionLooks";
import AgentSessionActions from "./AgentSessionActions.vue";
import ConversationMenu from "./ConversationMenu.vue";
import RunningCommand from "./RunningCommand.vue";

/**
 * The row above a chat's composer that names its agent: on the left what it does now, on the right its mark, name,
 * state and the model and effort it runs, which open the chat list with the agent's actions. The one action a state
 * needs, such as a failed start's, sits beside it. Side by side each column has its own row.
 */
const props = defineProps<{
  agent: AgentOptionData;
  agents: AgentOptionData[];
  // Where the chat list's next page starts; none when the agents given are all there are.
  nextAgents: AgentPageCursorData | null;
  inboxId: string;
  seed: RunningCommandData | null;
}>();

const emit = defineEmits<{ switchDriver: []; technicalDetails: [] }>();

// The pulse turns red while the agent's last start failed.
const hasFailedStart = computed(() => ["failed", "refused"].includes(props.agent.status.sessionState));
const openChats = useOpenChats(useAppContext().viewer.value.id ?? "guest");
const name = computed(() => (props.agent.isMain ? `${props.agent.name} · main` : props.agent.name));
// The model and effort in quiet text; an agent with no session names none.
const settings = computed(() =>
  [props.agent.sessionModel, props.agent.sessionEffort].filter((part) => part !== null && part !== "").join(" · "),
);

// Opening a chat beside this one opens its tab and shows the open chats side by side.
function openBeside(other: AgentOptionData): void {
  openChats.open(other.id);
  openChats.open(props.agent.id);
  openChats.showColumns(Math.max(2, openChats.chats.columns));
}
</script>

<template>
  <div class="flex min-h-7 items-center gap-2" data-agent-row>
    <div class="min-w-0 flex-1">
      <RunningCommand :agent="agent" :inbox-id="inboxId" :seed="seed" />
    </div>
    <button
      type="button"
      class="flex size-6 flex-none items-center justify-center rounded-control hover:bg-hover"
      :class="hasFailedStart ? 'text-danger' : 'text-text-4'"
      :aria-label="`Technical details of ${agent.name}`"
      title="Technical details"
      data-agent-pulse
      :data-failed="hasFailedStart"
      @click="emit('technicalDetails')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M1 7.5h2.5L5 3.5l2.5 7L9 6l1 1.5h3" />
      </svg>
    </button>
    <AgentSessionActions :key="`${agent.id}-${agent.sessionGeneration}`" :agent="agent" />
    <ConversationMenu
      :agents="agents"
      :next-agents="nextAgents"
      :selected-agent-id="agent.id"
      :open-agent-ids="openChats.chats.agentIds"
      placement="above"
      @new-chat="requestNewChat()"
      @open-beside="openBeside"
      @switch-driver="emit('switchDriver')"
      @technical-details="emit('technicalDetails')"
    >
      <template #trigger>
        <span class="flex min-w-0 items-center gap-[7px]" :data-agent-chip="agent.id">
          <Avatar :participant="{ kind: 'agent', driver: agent.sessionDriver ?? '' }" />
          <span class="min-w-0 truncate text-small font-medium text-text">{{ name }}</span>
          <Status :state="sessionLooks[agent.status.sessionState]" :label="agent.status.label" secondary />
          <template v-if="settings !== ''">
            <span class="text-meta whitespace-nowrap text-text-4 @max-[560px]:hidden" data-agent-settings>{{
              settings
            }}</span>
          </template>
          <Icon name="caret" :size="13" class="rotate-180 text-text-3" />
        </span>
      </template>
    </ConversationMenu>
  </div>
</template>
