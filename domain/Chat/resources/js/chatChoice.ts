import { router } from "@inertiajs/vue3";
import { isWindowShown, windowQueryData } from "@kit/useWindowQuery";

const HOME_CHAT_PROP = "window_chat_conversation";

/**
 * Selects the agent in Home's bar and updates the conversation if the preview is visible.
 */
export function chooseHomeChat(bar: string, agentId: string, sessionId: string | null): void {
  const data = windowQueryData("chat.conversation", { agent: agentId, inbox: undefined, read: undefined, dock: undefined });
  const only = isWindowShown(HOME_CHAT_PROP) ? [HOME_CHAT_PROP, bar] : [bar];
  router.reload({ only, data: { ...data, agent: agentId, session: sessionId ?? undefined } });
}

/**
 * Selects the conversation on its full address.
 */
export function chooseChat(agentId: string, sessionId: string | null): void {
  router.reload({
    only: ["page"],
    data: { agent: agentId, session: sessionId ?? undefined, inbox: undefined, read: undefined, dock: undefined },
  });
}
