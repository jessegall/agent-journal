<script setup lang="ts">
import { router, usePage } from "@inertiajs/vue3";
import type { AgentOptionData, ChatData } from "@generated/types/chat";
import { agentUrl, chatUrl, questionUrl } from "./agentLinks";
import ChatPane from "./ChatPane.vue";
import TerminalModal from "./TerminalModal.vue";

/**
 * The chat window, on Home and on its own page. On Home the agent bar chooses the agent; on its own page the window
 * offers the choice itself. An agent's terminal opens over the page as a modal.
 */
defineProps<{ data: ChatData }>();

const page = usePage();
const ownPage = page.component === "chat/ChatWindow";
const HOME_PROP = "window_chat_conversation";

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
  <ChatPane
    :chat="data"
    :offers-choice="ownPage"
    :agent-url="(agent: AgentOptionData) => agentUrl(page.url, agent)"
    :chat-url="(inboxId: string) => chatUrl(page.url, inboxId)"
    :question-url="(messageId: string) => questionUrl(page.url, messageId)"
    :load-more="loadMore"
    :protected-prop="ownPage ? 'page' : HOME_PROP"
  />
  <TerminalModal :agents="data.agents" />
</template>
