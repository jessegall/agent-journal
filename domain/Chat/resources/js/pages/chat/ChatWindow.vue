<script setup lang="ts">
import Button from "@kit/Button";
import RowSkeleton from "@kit/RowSkeleton";
import { useAppContext } from "@kit/appContext";
import { useHostProp } from "@kit/hostProp";
import { useIsInWindow, useWindowReload } from "@kit/useWindowQuery";
import type { ChatData } from "@generated/types/chat";
import { computed, nextTick, reactive, ref, watch } from "vue";
import { requestChatChoice } from "../../composables/useChatBarAsks";
import { useOpenChats } from "../../composables/useOpenChats";
import { useReadConversations } from "../../composables/useReadConversations";
import ChatPane from "./partials/ChatPane.vue";
import TerminalModal from "./partials/TerminalModal.vue";

const props = defineProps<{ data: ChatData }>();
const { viewer } = useAppContext();
const inWindow = useIsInWindow();
const hostProp = useHostProp();
const reload = useWindowReload();
const openChats = useOpenChats(viewer.value.id ?? "guest");
const conversations = useReadConversations(() => viewer.value.id);
const reading = ref<string | null>(null);
const failed = reactive(new Set<string>());

watch(
  () => props.data.conversation,
  (conversation) => {
    if (conversation !== undefined) {
      conversations.remember(conversation, props.data.agents);
    }
  },
  { immediate: true },
);

const agents = computed(() => {
  const chosen = props.data.selectedAgentId;

  if (!inWindow || chosen === undefined || openChats.chats.columns < 2) {
    return [];
  }

  return [chosen, ...openChats.besideOf(chosen)];
});
const columns = computed(() => agents.value.map((agentId) => ({ agentId, chat: columnOf(agentId) })));
const chosenChat = computed(() => columnOf(props.data.selectedAgentId) ?? props.data);
const unread = computed(() => agents.value.find((id) => conversations.forAgent(id) === undefined && !failed.has(id)));

watch([unread, reading], ([agentId, pending]) => {
  if (agentId !== undefined && pending === null) {
    readColumn(agentId);
  }
}, { immediate: true });
watch(agents, (visible) => {
  for (const agent of failed) {
    if (!visible.includes(agent)) {
      failed.delete(agent);
    }
  }
});

function columnOf(agentId: string | undefined): ChatData | undefined {
  if (!inWindow || agentId === undefined) {
    return undefined;
  }

  const remembered = conversations.forAgent(agentId);

  if (remembered === undefined) {
    return undefined;
  }

  return {
    ...props.data,
    selectedAgentId: agentId,
    conversation: remembered.conversation,
    agents: remembered.agent !== undefined && !props.data.agents.some((agent) => agent.id === agentId)
      ? [...props.data.agents, remembered.agent]
      : props.data.agents,
    dockSections: agentId === props.data.selectedAgentId ? props.data.dockSections : [],
  };
}

function readColumn(agentId: string): void {
  if (reading.value !== null) {
    return;
  }

  failed.delete(agentId);
  reading.value = agentId;
  reload({ read: agentId, dock: undefined }, {
    preserveUrl: true,
    onNetworkError: () => true,
    onHttpException: () => true,
    onFinish: () => void nextTick(() => {
      if (conversations.forAgent(agentId) === undefined) {
        failed.add(agentId);
      }

      reading.value = null;
    }),
  });
}

function chooseColumn(agentId: string): void {
  const agent = props.data.agents.find((candidate) => candidate.id === agentId);

  if (agent !== undefined && agentId !== props.data.selectedAgentId) {
    requestChatChoice(agent.id, agent.sessionId);
  }
}

function loadMore(token: string): void {
  reload({ dock: token });
}

function loadMoreIn(agentId: string, token: string): void {
  reload({ read: agentId, dock: token }, { preserveUrl: true });
}
</script>

<template>
  <div
    v-if="columns.length > 1"
    class="grid h-full min-h-0 grid-flow-col auto-cols-[minmax(400px,1fr)] gap-2 overflow-x-auto"
    data-side-by-side
  >
    <div
      v-for="column in columns"
      :key="column.agentId"
      class="min-h-0 rounded-card border border-line"
      :data-column="column.agentId"
      @focusin="chooseColumn(column.agentId)"
    >
      <ChatPane
        v-if="column.chat"
        :chat="column.chat"
        :offers-choice="false"
        :load-more="(token) => loadMoreIn(column.agentId, token)"
        :protected-prop="hostProp"
      />
      <div v-else class="p-4" data-column-loading>
        <Button v-if="failed.has(column.agentId)" variant="bordered" @click="readColumn(column.agentId)">
          Retry conversation
        </Button>
        <RowSkeleton v-else label="Loading this chat" />
      </div>
    </div>
  </div>
  <ChatPane
    v-else
    :chat="chosenChat"
    :offers-choice="!inWindow"
    :load-more="loadMore"
    :protected-prop="hostProp"
  />
  <TerminalModal :agents="data.agents" />
</template>
