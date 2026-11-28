import { onBeforeUnmount, onMounted, ref, watch } from "vue";

/**
 * The asks a chat sends to Home's one chat bar and its own list, from wherever it shows: New chat and choosing a chat
 * reach the bar's tabs; the list of one agent's chat opens from the caret on its tab or Option+F.
 */

// Each ask is counted, so asking twice for the same thing answers twice.
const chatListAsks = ref<{ agentId: string; count: number } | null>(null);
const newChatAsks = ref(0);
const chatChoiceAsks = ref<{ agentId: string; sessionId: string | null; count: number } | null>(null);

/**
 * Asks Home's chat bar to choose this agent's chat, so its tabs and the chat window read it together.
 */
export function requestChatChoice(agentId: string, sessionId: string | null): void {
  chatChoiceAsks.value = { agentId, sessionId, count: (chatChoiceAsks.value?.count ?? 0) + 1 };
}

export function onChatChoiceRequest(choose: (agentId: string, sessionId: string | null) => void): void {
  watch(chatChoiceAsks, (ask) => {
    if (ask !== null) {
      choose(ask.agentId, ask.sessionId);
    }
  });
}

export function requestNewChat(): void {
  newChatAsks.value++;
}

export function onNewChatRequest(open: () => void): void {
  watch(newChatAsks, open);
}

export function requestChatList(agentId: string): void {
  chatListAsks.value = { agentId, count: (chatListAsks.value?.count ?? 0) + 1 };
}

/**
 * Opens the list through the callback whenever the chat list of the agent it shows is chatListAsks for.
 */
export function onChatListRequest(agentId: () => string | undefined, open: () => void): void {
  watch(chatListAsks, (ask) => {
    if (ask !== null && ask.agentId === agentId()) {
      open();
    }
  });
}

/**
 * Asks for the chat list of the agent the page shows on Option+F, while the page is mounted: one page, one listener.
 */
export function useChatListShortcut(agentId: () => string | undefined): void {
  function askOnShortcut(event: KeyboardEvent): void {
    const shown = agentId();

    if (shown !== undefined && event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyF") {
      event.preventDefault();
      requestChatList(shown);
    }
  }

  onMounted(() => window.addEventListener("keydown", askOnShortcut));
  onBeforeUnmount(() => window.removeEventListener("keydown", askOnShortcut));
}
