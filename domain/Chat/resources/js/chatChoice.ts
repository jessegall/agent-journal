import { router } from "@inertiajs/vue3";

/**
 * The prop Home's chat window is fed by.
 */
export const HOME_CHAT_PROP = "window_chat_conversation";

/**
 * The query that chooses an agent's chat: for the page's sections, its agent and, while it runs one, its session; for
 * the chat window, the agent, with no chat by inbox and no other conversation to read.
 */
function chosenQueryOf(agentId: string, sessionId: string | null) {
  return {
    agent: agentId,
    session: sessionId ?? "",
    window: { "chat.conversation": { agent: agentId, inbox: "", read: "" } },
  };
}

/**
 * Chooses an agent's chat by reloading only the props named, so the server reads just that chat.
 */
export function chooseChat(props: string[], agentId: string, sessionId: string | null): void {
  router.reload({ only: props, data: chosenQueryOf(agentId, sessionId), preserveScroll: true });
}

/**
 * Reads one more chat's conversation into Home's chat window, such as a column side by side, leaving the chosen chat
 * and the address as they are.
 */
export function readChat(agentId: string, onFinish: () => void): void {
  router.reload({
    only: [HOME_CHAT_PROP],
    data: { window: { "chat.conversation": { read: agentId } } },
    preserveUrl: true,
    preserveScroll: true,
    onFinish,
  });
}
