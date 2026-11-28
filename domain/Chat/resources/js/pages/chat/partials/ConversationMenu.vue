<script setup lang="ts">
import Menu from "@kit/Menu";
import MenuGroup from "@kit/MenuGroup";
import MenuSeparator from "@kit/MenuSeparator";
import { router } from "@inertiajs/vue3";
import { computed, ref, useTemplateRef } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import ConversationActions from "./ConversationActions.vue";
import ConversationRow from "./ConversationRow.vue";
import StopConfirmation from "./StopConfirmation.vue";
import { useSessionEnd } from "../../../composables/useSessionEnd";
import {
  carriesRecord,
  droppedRecord,
  useHandOver,
} from "../../../composables/useHandOver";

/**
 * The conversation menu under the chat's name, as the design draws it: the conversations with each agent that works,
 * the chosen one ticked, then the chosen agent's terminal, End session, Add someone to this chat and New group chat. A record
 * dragged onto the name opens the menu; let go on a conversation, it is handed to that agent.
 */
const props = defineProps<{
  agents: AgentOptionData[];
  mainAgentId: string | undefined;
  selectedAgentId: string | undefined;
  canCreateChats: boolean;
  agentUrl: (agent: AgentOptionData) => string;
}>();

const emit = defineEmits<{ newGroup: [] }>();

defineSlots<{ trigger(): unknown }>();

const menu = useTemplateRef<InstanceType<typeof Menu>>("menu");
const conversations = computed(() =>
  props.agents.filter((agent) => !agent.isRetired),
);
// The chosen agent's own terminal, offered while it runs in one.
const terminalAgent = computed(() =>
  props.agents.find(
    (agent) =>
      agent.id === props.selectedAgentId &&
      agent.hasTerminal &&
      agent.sessionId !== null,
  ),
);

// The chosen agent, while its status offers to end its session; End session asks first.
const endableAgent = computed(() =>
  props.agents.find(
    (agent) =>
      agent.id === props.selectedAgentId &&
      agent.status.actions.some((action) => action.type === "stop"),
  ),
);
const isEndAsked = ref(false);
const sessionEnd = useSessionEnd();

function endSession(): void {
  const agent = endableAgent.value;

  if (agent !== undefined) {
    sessionEnd.end(agent, () => (isEndAsked.value = false));
  }
}

function subLine(agent: AgentOptionData): string {
  return agent.id === props.mainAgentId ? "main agent" : agent.status.label;
}

function choose(agent: AgentOptionData): void {
  router.visit(props.agentUrl(agent), { preserveScroll: true });
}

function openOnDrag(event: DragEvent): void {
  if (carriesRecord(event)) {
    void menu.value?.open();
  }
}

const handOver = useHandOver();

function handTo(event: DragEvent, agent: AgentOptionData): void {
  handOver.hold({ ...droppedRecord(event), agentId: agent.id });
  choose(agent);
}
</script>

<template>
  <div
    @dragenter="openOnDrag"
    @dragover="carriesRecord($event) && $event.preventDefault()"
  >
    <Menu
      ref="menu"
      label="Conversations"
      align="left"
      trigger-class="gap-2.5 rounded-field py-[3px] pr-1.5 pl-[3px] text-left hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
    >
      <template #trigger>
        <slot name="trigger" />
      </template>
      <MenuGroup label="Conversations">
        <template v-for="agent in conversations" :key="agent.id">
          <ConversationRow
            :agent="agent"
            :sub-line="subLine(agent)"
            :is-chosen="agent.id === selectedAgentId"
            @choose="choose(agent)"
            @drop="handTo($event, agent)"
          />
        </template>
      </MenuGroup>
      <MenuSeparator />
      <ConversationActions
        :terminal-agent="terminalAgent"
        :endable-agent="endableAgent"
        :can-create-chats="canCreateChats"
        @new-group="emit('newGroup')"
        @end-session="isEndAsked = true"
      />
    </Menu>
    <template v-if="isEndAsked && endableAgent">
      <StopConfirmation
        :agent-name="endableAgent.name"
        :is-pending="sessionEnd.isPending.value"
        @confirm="endSession"
        @close="isEndAsked = false"
      />
    </template>
    <template v-if="sessionEnd.refusal.value">
      <p class="text-small text-danger" role="alert">
        {{ sessionEnd.refusal.value }}
      </p>
    </template>
  </div>
</template>
