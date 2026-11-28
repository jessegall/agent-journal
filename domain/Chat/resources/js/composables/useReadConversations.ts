import { onPurge } from "@kit/protectedView";
import { reactive } from "vue";
import type { ConversationData } from "@generated/types/chat";

/**
 * The conversations Home's chat window has read in this tab, by agent: each request reads one, so side by side every
 * column shows the one its own reload read last. A denial forgets them all.
 */
const read = reactive(new Map<string, ConversationData>());

onPurge(() => read.clear());

export function rememberConversation(conversation: ConversationData): void {
  if (conversation.agentId !== null) {
    read.set(conversation.agentId, conversation);
  }
}

export function conversationOf(agentId: string): ConversationData | undefined {
  return read.get(agentId);
}
