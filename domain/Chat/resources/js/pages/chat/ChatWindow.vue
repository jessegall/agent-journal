<script setup lang="ts">
import { router, usePage } from "@inertiajs/vue3";
import { useAppContext } from "@kit/appContext";
import { computed, watch } from "vue";
import type { AgentOptionData, ChatData, ConversationData } from "@generated/types/chat";
import { agentUrl, besideUrl } from "../../agentLinks";
import { useOpenChats } from "../../composables/useOpenChats";
import ChatPane from "./partials/ChatPane.vue";
import TerminalModal from "./partials/TerminalModal.vue";

/**
 * The chat window, on Home and on its own page. On Home the agent bar chooses the agent; on its own page the window
 * offers the choice itself. Side by side, Home shows the most recently used open chats as framed columns beside the
 * chosen one. An agent's terminal opens over the page as a modal.
 */
const props = defineProps<{ data: ChatData }>();

const page = usePage();
const ownPage = page.component === "chat/ChatWindow";
const HOME_PROP = "window_chat_conversation";
const openChats = useOpenChats(useAppContext().viewer.value.id ?? "guest");

// The chats the page should show beside the chosen one, which the window's query asks the server for.
const wanted = computed(() => (ownPage ? [] : openChats.besideOf(props.data.selectedAgentId)));
const shownBeside = computed(() => props.data.beside.map((conversation) => conversation.agentId));

watch(
  wanted,
  (agentIds) => {
    if (agentIds.join() !== shownBeside.value.join()) {
      router.visit(besideUrl(page.url, agentIds), { preserveScroll: true, preserveState: true });
    }
  },
  { immediate: true },
);

const isSideBySide = computed(() => props.data.beside.length > 0);

/**
 * The chat window's data with a column's conversation and agent chosen, so each column is a whole chat.
 */
function columnOf(conversation: ConversationData): ChatData {
  return { ...props.data, conversation, selectedAgentId: conversation.agentId ?? undefined };
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
    only: [HOME_PROP],
    data: { window: { "chat.conversation": { dock: token } } },
  });
}
</script>

<template>
  <template v-if="isSideBySide">
    <div class="grid h-full min-h-0 grid-flow-col auto-cols-[minmax(400px,1fr)] gap-2 overflow-x-auto" data-side-by-side>
      <div class="min-h-0 rounded-card border border-line" data-column>
        <ChatPane
          :chat="data"
          :offers-choice="false"
          :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
          :load-more="loadMore"
          :protected-prop="HOME_PROP"
        />
      </div>
      <template v-for="conversation in data.beside" :key="conversation.inboxId">
        <div class="min-h-0 rounded-card border border-line" data-column>
          <ChatPane
            :chat="columnOf(conversation)"
            :offers-choice="false"
            :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
            :load-more="loadMore"
            :protected-prop="HOME_PROP"
          />
        </div>
      </template>
    </div>
  </template>
  <template v-else>
    <ChatPane
      :chat="data"
      :offers-choice="ownPage"
      :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
      :load-more="loadMore"
      :protected-prop="ownPage ? 'page' : HOME_PROP"
    />
  </template>
  <TerminalModal :agents="data.agents" />
</template>
