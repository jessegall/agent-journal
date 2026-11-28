<script setup lang="ts">
import { router, usePage } from "@inertiajs/vue3";
import { useAppContext } from "@kit/appContext";
import RowSkeleton from "@kit/RowSkeleton";
import { computed, ref, watch } from "vue";
import type { ChatData } from "@generated/types/chat";
import { HOME_CHAT_PROP, readChat } from "../../chatChoice";
import { requestChatChoice } from "../../composables/useChatBarAsks";
import { useOpenChats } from "../../composables/useOpenChats";
import { conversationOf, rememberConversation } from "../../composables/useReadConversations";
import ChatPane from "./partials/ChatPane.vue";
import TerminalModal from "./partials/TerminalModal.vue";

/**
 * The chat window, on Home and on its own page. Each request reads one conversation, the chosen chat's; side by side,
 * Home shows the most recently used open chats as framed columns, each read by its own reload and on its skeleton until
 * that answers, and focusing a column chooses its chat. An agent's terminal opens over the page as a modal.
 */
const props = defineProps<{ data: ChatData }>();

const page = usePage();
const ownPage = page.component === "chat/ChatWindow";
const openChats = useOpenChats(useAppContext().viewer.value.id ?? "guest");
// The column whose own reload is out, so each column is read once at a time.
const reading = ref<string | null>(null);

watch(
  () => props.data.conversation,
  (conversation) => {
    if (conversation !== undefined) {
      rememberConversation(conversation);
    }
  },
  { immediate: true },
);

const columnAgentIds = computed(() => {
  const chosen = props.data.selectedAgentId;

  return ownPage || chosen === undefined || openChats.chats.columns < 2
    ? []
    : [chosen, ...openChats.besideOf(chosen)];
});
const isSideBySide = computed(() => columnAgentIds.value.length > 1);
const columns = computed(() => columnAgentIds.value.map((agentId) => ({ agentId, chat: columnOf(agentId) })));
const unread = computed(() => columnAgentIds.value.filter((agentId) => conversationOf(agentId) === undefined));

watch(
  unread,
  (agentIds) => {
    const next = agentIds[0];

    if (next !== undefined && reading.value === null) {
      reading.value = next;
      readChat(next, () => (reading.value = null));
    }
  },
  { immediate: true },
);

/**
 * The chat window's data for one column: the agent and the conversation its own reload read; none before that answers.
 */
function columnOf(agentId: string): ChatData | undefined {
  const conversation = conversationOf(agentId);

  return conversation === undefined ? undefined : { ...props.data, conversation, selectedAgentId: agentId };
}

// The chosen chat shows the conversation read for it, even after a column's reload brought another one.
const chosenChat = computed(() =>
  props.data.selectedAgentId === undefined ? props.data : (columnOf(props.data.selectedAgentId) ?? props.data),
);

function chooseColumn(agentId: string): void {
  const agent = props.data.agents.find((candidate) => candidate.id === agentId);

  if (agent !== undefined && agentId !== props.data.selectedAgentId) {
    requestChatChoice(agent.id, agent.sessionId);
  }
}

/**
 * Reads the dock's next page: on Chat's own page through its query, on Home through the chat window's own part of it.
 */
function loadMore(token: string): void {
  if (ownPage) {
    router.reload({ only: ["page"], data: { dock: token } });

    return;
  }

  router.reload({
    only: [HOME_CHAT_PROP],
    data: { window: { "chat.conversation": { dock: token } } },
  });
}
</script>

<template>
  <template v-if="isSideBySide">
    <div class="grid h-full min-h-0 grid-flow-col auto-cols-[minmax(400px,1fr)] gap-2 overflow-x-auto" data-side-by-side>
      <template v-for="column in columns" :key="column.agentId">
        <div
          class="min-h-0 rounded-card border border-line"
          :data-column="column.agentId"
          @focusin="chooseColumn(column.agentId)"
        >
          <template v-if="column.chat">
            <ChatPane
              :chat="column.chat"
              :offers-choice="false"
              :load-more="loadMore"
              :protected-prop="HOME_CHAT_PROP"
            />
          </template>
          <template v-else>
            <div class="p-4" data-column-loading>
              <RowSkeleton label="Loading this chat" />
            </div>
          </template>
        </div>
      </template>
    </div>
  </template>
  <template v-else>
    <ChatPane
      :chat="chosenChat"
      :offers-choice="ownPage"
      :load-more="loadMore"
      :protected-prop="ownPage ? 'page' : HOME_CHAT_PROP"
    />
  </template>
  <TerminalModal :agents="data.agents" />
</template>
